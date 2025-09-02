'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useMyUser } from '@/hooks/profile-api/useMyUser';
import { API_ROUTES } from '@/api/endpoints';
import LoadingBlur from '@/components/LoadingBlur';
import { CategoriesImage, ProfileImage } from '@/constants/images';
import { ChatMessage } from '@/types/chat';
import ChatHeader from '../ChatHeader';
import ChatInput from '../ChatInput';
import ChatMessages from '../ChatMessages';
import { useWebSocket } from '@/contexts/RealtimeChatContext';
import FreelanceChatFlow, { StatusKey, FlowActions } from '@/components/FreelanceChatFlow';
import QuotationModal from '@/components/QuotationModal';
import { usePrivateImagePost } from '@/hooks/api-hooks';

type MessageForm = { message: string };
type UploadedFile = { fileUrl: string; fileType: string; fileName: string };

interface ChatSectionProps {
    roomId: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({ roomId }) => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    const [showQuotationModal, setShowQuotationModal] = useState<boolean>(false);
    const { t } = useTranslation();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const endRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const topSentinelRef = useRef<HTMLDivElement>(null);
    const isSubmittingRef = useRef(false);
    const { localUser } = useMyUser();

    const { sendMessage, fetchHistory, isConnected, hasMoreMessages, isFetching } = useWebSocket(
        `chat_${roomId}`,
        (event: MessageEvent<ChatMessage | ChatMessage[]>) => {
            if (process.env.NODE_ENV !== 'production') console.debug('Message received:', event.data);
            let parsed: ChatMessage | ChatMessage[];
            try {
                parsed = JSON.parse(event.data);
            } catch (e) {
                console.error('Failed to parse WebSocket message:', e);
                return;
            }

            const items: ChatMessage[] = Array.isArray(parsed) ? parsed : [parsed];
            if (!items.length) return;

            setMessages((prev) => {
                const beforeLen = prev.length;
                const copy = [...prev];
                let added = 0;
                let replaced = 0;
                let skippedDup = 0;
                for (const msg of items) {
                    const isDuplicate = copy.some(
                        (m) =>
                            m.content === msg.content &&
                            m.senderId === msg.senderId &&
                            Math.abs(new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 2000
                    );
                    if (isDuplicate) {
                        skippedDup++;
                        continue;
                    }

                    const idx = copy.findIndex((m) => m.id === msg.id && m.status === 0);
                    if (idx >= 0) {
                        replaced++;
                        copy[idx] = { ...msg, status: 1 };
                    } else {
                        added++;
                        copy.push({ ...msg, status: 1 });
                    }
                }
                const sorted = copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                console.log('[CHAT][STATE] apply incoming', { incoming: items.length, added, replaced, skippedDup, beforeLen, afterLen: sorted.length });
                return sorted;
            });
        }
    );

    const { trigger: uploadFile, isMutating: isUploading } = usePrivateImagePost(
        API_ROUTES.chat.uploadFile + `?roomId=${roomId}`
    );

    // Mock currentRoom for compatibility (replace with actual data if needed)
    const currentRoom = {
        roomId,
        partnerAvatar: ProfileImage.avatar,
        partnerDisplayName: 'User',
        job: { id: roomId, title: 'Sample Job', coverImage: CategoriesImage.seoJob },
        messages: [],
    };

    // Map activeStep to StatusKey
    const statusMap: StatusKey[] = ['new', 'queue', 'assign', 'accept', 'chat', 'review', 'pay'];
    const currentStatus: StatusKey = statusMap[activeStep] || 'new';

    // Handle status change
    const handleChangeStatus = (key: StatusKey) => {
        const newIndex = statusMap.indexOf(key);
        if (newIndex !== -1) {
            setActiveStep(newIndex);
        }
    };

    // Generate PDF quotation
    const generateQuotationPDF = async (data: { price: number; description: string; terms?: string }) => {
        const latexTemplate = `
\\documentclass[a4paper,12pt]{article}
\\usepackage{geometry}
\\usepackage{amsmath}
\\usepackage{parskip}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage{titling}
\\usepackage{datetime}
\\usepackage{noto}
\\setmainfont{Noto Serif}
\\geometry{margin=1in}
\\definecolor{titleblue}{RGB}{37,99,235}
\\setlength{\\parindent}{0pt}
\\title{\\textbf{\\textcolor{titleblue}{Quotation}}}
\\author{}
\\date{\\today}
\\begin{document}
\\maketitle
\\section*{Quotation Details}
\\textbf{To:} ${currentRoom.partnerDisplayName || 'Client'} \\
\\textbf{From:} ${localUser?.displayName || 'Freelancer'} \\
\\textbf{Date:} \\today \\
\\textbf{Quotation ID:} \\the\\day\\the\\month\\the\\year-\\thepage
\\section*{Service Details}
\\begin{description}[font=\\normalfont\\bfseries]
    \\item[Description:] ${data.description || 'No description provided'}
    \\item[Price:] \\$${data.price.toFixed(2)}
    \\item[Terms:] ${data.terms || 'No additional terms'}
\\end{description}
\\vspace{2cm}
\\hrule
\\vspace{0.5cm}
\\textit{This quotation is valid for 30 days from the date of issue. Please contact the freelancer for any clarifications.}
\\end{document}
`;

        // Simulate PDF generation (client-side workaround)
        const blob = new Blob([latexTemplate], { type: 'application/x-latex' });
        const file = new File([blob], `quotation-${uuidv4()}.tex`, { type: 'application/x-latex' });
        return file;
    };

    // Handle quotation form submission
    const handleQuotationSubmit = async (data: { price: number; description: string; terms?: string }) => {
        try {
            const pdfFile = await generateQuotationPDF(data);
            const formData = new FormData();
            formData.append('file', pdfFile);

            const result = (await uploadFile(formData)) as UploadedFile;
            setSelectedFile(result);

            const messageId = uuidv4();
            setMessages((prev) => [
                {
                    id: messageId,
                    roomId: currentRoom?.roomId || roomId,
                    content: t('profileChat.proposeQuoteMsg') || `Proposed quotation: $${data.price.toFixed(2)}`,
                    createdAt: new Date().toISOString(),
                    senderId: Number(localUser?.id) || 0,
                    receiverId: roomId.includes(':') ? Number(roomId.split(':')[1]) || 0 : 0,
                    status: 0,
                    isOwner: true,
                } as ChatMessage,
                ...prev,
            ]);

            sendMessage({ message: `Proposed quotation: $${data.price.toFixed(2)}`, id: messageId });
        } catch (err) {
            console.error('Failed to send quotation:', err);
            alert(t('profileChat.quotationError') || 'Failed to send quotation.');
        }
    };

    // Define FlowActions callbacks
    const flowActions: FlowActions = {
        onProposeQuote: () => {
            setShowQuotationModal(true);
        },
        onAcceptJob: () => {
            setActiveStep(4); // Move to 'chat' step
            sendMessage({ message: t('profileChat.acceptJobMsg') || 'I have accepted the job.', id: uuidv4() });
        },
        onUploadAsset: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e) => handleFileUpload(e as any);
            input.click();
        },
        onSendMessage: () => {
            const input = scrollContainerRef.current?.querySelector('input');
            if (input) input.focus();
        },
        onSubmitDelivery: () => {
            setActiveStep(5); // Move to 'review' step
            setShowReviewModal(true);
        },
        onRequestRevision: () => {
            setActiveStep(4); // Move to 'chat' step
            setShowReviewModal(false);
            sendMessage({
                message: t('profileChat.requestRevisionMsg') || 'Please revise and resubmit.',
                id: uuidv4(),
            });
        },
        onReleasePayment: () => {
            setActiveStep(6); // Move to 'pay' step
            setShowReviewModal(false);
            sendMessage({
                message: t('profileChat.deliveryAccepted') || 'Delivery accepted. Proceed to payment.',
                id: uuidv4(),
            });
        },
    };

    const onSubmit = useCallback(
        (data: MessageForm) => {
            if (isSubmittingRef.current) {
                if (process.env.NODE_ENV !== 'production') console.debug('Duplicate submit ignored');
                return;
            }
            const message = data.message?.trim() || '';
            if (!message && !selectedFile) return;

            isSubmittingRef.current = true;
            const messageId = uuidv4();

            setMessages((prev) => [
                {
                    id: messageId,
                    roomId: currentRoom?.roomId || roomId,
                    content: message || '',
                    createdAt: new Date().toISOString(),
                    senderId: Number(localUser?.id) || 0,
                    receiverId: roomId.includes(':') ? Number(roomId.split(':')[1]) || 0 : 0,
                    status: 0,
                    isOwner: true,
                } as ChatMessage,
                ...prev,
            ]);

            sendMessage({ message, id: messageId });

            setSelectedFile(null);
            isSubmittingRef.current = false;
        },
        [sendMessage, currentRoom, roomId, selectedFile, localUser?.id]
    );

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = (await uploadFile(formData)) as UploadedFile;
            setSelectedFile(result);
            e.target.value = '';
        } catch (err) {
            console.error('Upload file failed', err);
        }
    };

    useEffect(() => {
        const rootEl = scrollContainerRef.current;
        if (!topSentinelRef.current || !rootEl || !hasMoreMessages || !isConnected) {
            console.log('[CHAT][OBS] Skipping observer setup', {
                hasTopSentinel: !!topSentinelRef.current,
                hasRoot: !!rootEl,
                hasMoreMessages,
                isConnected,
            });
            return;
        }

        const rootInfo = {
            clientHeight: rootEl.clientHeight,
            scrollHeight: rootEl.scrollHeight,
            scrollTop: rootEl.scrollTop,
        };
        console.log('[CHAT][OBS] Creating IntersectionObserver with root info', rootInfo);

        const observer = new IntersectionObserver(
            (entries) => {
                const e = entries[0];
                console.log('[CHAT][OBS] Intersection change', {
                    isIntersecting: e.isIntersecting,
                    ratio: e.intersectionRatio,
                    rootBounds: e.rootBounds ? { height: e.rootBounds.height, top: e.rootBounds.top } : null,
                    boundingClientRect: { top: e.boundingClientRect.top, height: e.boundingClientRect.height },
                });
                if (e.isIntersecting) {
                    if (isFetching) {
                        console.log('[CHAT][OBS] Visible but skip, already fetching');
                        return;
                    }
                    console.log('[CHAT][OBS] Top sentinel visible -> fetchHistory()');
                    fetchHistory();
                }
            },
            { root: rootEl, threshold: 0 }
        );

        observer.observe(topSentinelRef.current);

        return () => {
            console.log('[CHAT][OBS] Disconnecting observer');
            observer.disconnect();
        };
    }, [fetchHistory, hasMoreMessages, isConnected]);

    useEffect(() => {
        if (isConnected) {
            console.log('[CHAT][INIT] Connected -> initial fetchHistory()');
            fetchHistory();
            setIsInitialLoading(false);
        } else {
            console.log('[CHAT][INIT] Not connected yet');
        }
    }, [isConnected, fetchHistory]);

    const prevLatestTsRef = useRef<number>(0);
    useEffect(() => {
        if (!messages.length || !endRef.current) return;
        const latestTs = new Date(messages[messages.length - 1].createdAt).getTime();
        if (latestTs > prevLatestTsRef.current) {
            console.log('[CHAT][SCROLL] Scrolling to bottom', { from: prevLatestTsRef.current, to: latestTs, count: messages.length });
            endRef.current.scrollIntoView({ behavior: prevLatestTsRef.current === 0 ? 'auto' : 'smooth' });
            prevLatestTsRef.current = latestTs;
        } else {
            console.log('[CHAT][SCROLL] Not scrolling (likely prepended history)', { latestTs, prev: prevLatestTsRef.current, count: messages.length });
        }
    }, [messages]);

    if (!roomId) {
        return <LoadingBlur text="No room selected" />;
    }

    return (
        <>
            <div className="flex-1 flex flex-col h-full">
                <ChatHeader
                    avatarUrl={currentRoom?.partnerAvatar || ProfileImage.avatar}
                    displayName={currentRoom?.partnerDisplayName || 'User'}
                    guideText={t('profileChat.guide') || 'Usage Guide'}
                />
                <div
                    ref={scrollContainerRef}
                    data-testid="chat-list"
                    className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col"
                >
                    <div ref={topSentinelRef} style={{ height: '10px' }} />
                    <ChatMessages
                        messages={messages}
                        partnerAvatar={currentRoom?.partnerAvatar || ProfileImage.avatar}
                    />
                    <div ref={endRef} />
                    <div className="flex items-center justify-center my-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mx-auto max-w-lg">
                            <div className="flex">
                                <div className="text-yellow-600 mr-2">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                </div>
                                <div className="text-sm text-gray-700">
                                    <p>{t('profileChat.unselectWarning')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t px-4 py-3 bg-white">
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <ChatInput
                                onSubmit={onSubmit}
                                onFileUpload={handleFileUpload}
                                selectedFile={selectedFile}
                                setSelectedFile={setSelectedFile}
                                isUploading={isUploading}
                            />
                        </div>
                        <button
                            type="button"
                            className="whitespace-nowrap rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2"
                            onClick={() => {
                                setActiveStep(5);
                                setShowReviewModal(true);
                            }}
                        >
                            {t('profileChat.submitDelivery') || 'Submit Delivery'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-80 flex flex-col border-l bg-white h-full">
                <FreelanceChatFlow
                    currentStatus={currentStatus}
                    onChangeStatus={handleChangeStatus}
                    orientation="vertical"
                    compact={false}
                    className="flex-1"
                    onProposeQuote={flowActions.onProposeQuote}
                    onAcceptJob={flowActions.onAcceptJob}
                    onUploadAsset={flowActions.onUploadAsset}
                    onSendMessage={flowActions.onSendMessage}
                    onSubmitDelivery={flowActions.onSubmitDelivery}
                    onRequestRevision={flowActions.onRequestRevision}
                    onReleasePayment={flowActions.onReleasePayment}
                />
                <div className="p-4 border-t">
                    <div className="flex">
                        <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
                            <Image
                                src={currentRoom?.jobCoverImage || CategoriesImage.seoJob}
                                alt="jobCover"
                                width={64}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-sm text-text-primary font-sans line-clamp-2">
                                {currentRoom?.job?.title || 'No Job Title'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {showReviewModal && (
                <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md text-center shadow-lg">
                        <h3 className="text-lg font-semibold mb-2">
                            {t('profileChat.reviewDeliveryTitle') || 'Review Delivery'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {t('profileChat.reviewDeliveryDesc') ||
                                'The freelancer submitted work. Do you want to accept or request revision?'}
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                className="rounded-md bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm"
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setActiveStep(6);
                                    setMessages((prev) => [
                                        {
                                            id: uuidv4(),
                                            roomId: currentRoom?.roomId || roomId,
                                            content: t('profileChat.deliveryAccepted') || 'Delivery accepted. Proceed to payment.',
                                            createdAt: new Date().toISOString(),
                                            senderId: Number(localUser?.id) || 0,
                                            receiverId: roomId.includes(':') ? Number(roomId.split(':')[1]) || 0 : 0,
                                            status: 1,
                                            isOwner: true,
                                        } as ChatMessage,
                                        ...prev,
                                    ]);
                                }}
                            >
                                {t('profileChat.acceptAndRelease') || 'Accept & Release Payment'}
                            </button>
                            <button
                                className="rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm"
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setActiveStep(4);
                                    setMessages((prev) => [
                                        {
                                            id: uuidv4(),
                                            roomId: currentRoom?.roomId || roomId,
                                            content: t('profileChat.requestRevisionMsg') || 'Please revise and resubmit.',
                                            createdAt: new Date().toISOString(),
                                            senderId: Number(localUser?.id) || 0,
                                            receiverId: roomId.includes(':') ? Number(roomId.split(':')[1]) || 0 : 0,
                                            status: 1,
                                            isOwner: true,
                                        } as ChatMessage,
                                        ...prev,
                                    ]);
                                }}
                            >
                                {t('profileChat.requestRevision') || 'Request Revision'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <QuotationModal
                isOpen={showQuotationModal}
                onClose={() => setShowQuotationModal(false)}
                onSubmit={handleQuotationSubmit}
            />
        </>
    );
};

export default ChatSection;