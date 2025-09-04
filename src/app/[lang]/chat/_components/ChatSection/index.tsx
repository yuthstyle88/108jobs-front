"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { API_ROUTES } from "@/api/endpoints";
import LoadingBlur from "@/components/LoadingBlur";
import { CategoriesImage, ProfileImage } from "@/constants/images";
import { ChatMessage } from "@/types/chat";
import ChatHeader from "../ChatHeader";
import ChatInput from "../ChatInput";
import ChatMessages from "../ChatMessages";
import { useWebSocket } from "@/contexts/RealtimeChatContext";
import { useChatRooms } from "@/contexts/ChatRoomsContext";
import FreelanceChatFlow, { FlowActions, StatusKey } from "@/components/FreelanceChatFlow";
import QuotationModal from "@/components/QuotationModal";
import { usePrivateImagePost } from "@/hooks/api-hooks";

type MessageForm = { message: string };
type UploadedFile = { fileUrl: string; fileType: string; fileName: string };

interface ChatSectionProps {
    roomId: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({ roomId }) => {
    const { bumpRoomToTop, updateRoomLastMessage } = useChatRooms();
    const [activeStep, setActiveStep] = useState<number>(0);
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    const [showQuotationModal, setShowQuotationModal] = useState<boolean>(false);
    const [isFlowOpen, setIsFlowOpen] = useState(false);
    const { t } = useTranslation();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const endRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const topSentinelRef = useRef<HTMLDivElement>(null);
    const isSubmittingRef = useRef(false);
    const { localUser } = useMyUser();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setIsFlowOpen(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { sendMessage, fetchHistory, isConnected, hasMoreMessages, isFetching } = useWebSocket(
        `chat_${roomId}`,
        (event: MessageEvent<ChatMessage | ChatMessage[]>) => {
            if (process.env.NODE_ENV !== "production")
                console.debug("Message received:", event.data);
            let parsed: ChatMessage | ChatMessage[];
            try {
                parsed = JSON.parse(event.data);
            } catch (e) {
                console.error("Failed to parse WebSocket message:", e);
                return;
            }

            const isHistoryBatch = Array.isArray(parsed);
            const items: ChatMessage[] = isHistoryBatch ? parsed : [parsed];
            if (!items.length) return;

            setMessages((prev) => {
                const beforeLen = prev.length;
                const copy = [...prev];
                let added = 0;
                let replaced = 0;
                let skippedDup = 0;
                let latestTs = 0;
                let latestContent: string | null = null;
                let latestSenderId: number | null = null;
                for (const msg of items) {
                    const isDuplicate = copy.some(
                        (m) =>
                            m.content === msg.content &&
                            m.senderId === msg.senderId &&
                            Math.abs(
                                new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime()
                            ) < 2000
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
                    const ts = new Date(msg.createdAt).getTime();
                    if (ts > latestTs) {
                        latestTs = ts;
                        latestContent = msg.content;
                        latestSenderId = msg.senderId;
                    }
                }
                const sorted = copy.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                console.log("[CHAT][STATE] apply incoming", {
                    incoming: items.length,
                    added,
                    replaced,
                    skippedDup,
                    beforeLen,
                    afterLen: sorted.length,
                    isHistoryBatch,
                });
                if (!isHistoryBatch && latestTs > 0 && latestContent != null && latestSenderId != null) {
                    const tsIso = new Date(latestTs).toISOString();
                    try {
                        updateRoomLastMessage(roomId, latestContent, latestSenderId, tsIso);
                    } catch {}
                    try {
                        window.dispatchEvent(
                            new CustomEvent("chat:new-message", {
                                detail: {
                                    roomId,
                                    content: latestContent,
                                    senderId: latestSenderId,
                                    timestamp: tsIso,
                                },
                            })
                        );
                    } catch {}
                }
                return sorted;
            });
        }
    );

    const { trigger: uploadFile, isMutating: isUploading } = usePrivateImagePost(
        API_ROUTES.chat.uploadFile + `?roomId=${roomId}`
    );

    const currentRoom = {
        roomId,
        partnerAvatar: ProfileImage.avatar,
        partnerDisplayName: "User",
        job: { id: roomId, title: "Sample Job", coverImage: CategoriesImage.seoJob, description: "Sample job description" },
        messages: [],
    };

    const statusMap: StatusKey[] = ["new", "queue", "assign", "accept", "chat", "review", "pay"];
    const currentStatus: StatusKey = statusMap[activeStep] || "new";

    const handleChangeStatus = (key: StatusKey) => {
        const newIndex = statusMap.indexOf(key);
        if (newIndex !== -1) {
            setActiveStep(newIndex);
        }
    };

    const generateQuotationPDF = async (data: {
        price: number;
        description: string;
        terms?: string;
    }) => {
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
\\textbf{To:} ${currentRoom.partnerDisplayName || "Client"} \\
\\textbf{From:} ${localUser?.displayName || "Freelancer"} \\
\\textbf{Date:} \\today \\
\\textbf{Quotation ID:} \\the\\day\\the\\month\\the\\year-\\thepage
\\section*{Service Details}
\\begin{description}[font=\\normalfont\\bfseries]
    \\item[Description:] ${data.description || "No description provided"}
    \\item[Price:] \\$${data.price.toFixed(2)}
    \\item[Terms:] ${data.terms || "No additional terms"}
\\end{description}
\\vspace{2cm}
\\hrule
\\vspace{0.5cm}
\\textit{This quotation is valid for 30 days from the date of issue. Please contact the freelancer for any clarifications.}
\\end{document}
`;

        const blob = new Blob([latexTemplate], { type: "application/x-latex" });
        return new File([blob], `quotation-${uuidv4()}.tex`, {
            type: "application/x-latex",
        });
    };

    const handleQuotationSubmit = async (data: {
        price: number;
        description: string;
        terms?: string;
    }) => {
        try {
            const pdfFile = await generateQuotationPDF(data);
            const formData = new FormData();
            formData.append("file", pdfFile);

            const result = (await uploadFile(formData)) as UploadedFile;
            setSelectedFile(result);

            const messageId = uuidv4();
            setMessages((prev) => [
                {
                    id: messageId,
                    roomId: currentRoom?.roomId || roomId,
                    content:
                        t("profileChat.proposeQuoteMsg") ||
                        `Proposed quotation: $${data.price.toFixed(2)}`,
                    createdAt: new Date().toISOString(),
                    senderId: Number(localUser?.id) || 0,
                    receiverId: roomId.includes(":")
                        ? Number(roomId.split(":")[1]) || 0
                        : 0,
                    status: 0,
                    isOwner: true,
                } as ChatMessage,
                ...prev,
            ]);

            sendMessage({
                message: `Proposed quotation: $${data.price.toFixed(2)}`,
                id: messageId,
            });
            try {
                const tsIso = new Date().toISOString();
                window.dispatchEvent(
                    new CustomEvent("chat:new-message", {
                        detail: {
                            roomId,
                            content: `Proposed quotation: $${data.price.toFixed(2)}`,
                            senderId: Number(localUser?.id) || 0,
                            timestamp: tsIso,
                        },
                    })
                );
            } catch {}
        } catch (err) {
            console.error("Failed to send quotation:", err);
            alert(t("profileChat.quotationError") || "Failed to send quotation.");
        }
    };

    const flowActions: FlowActions = {
        onProposeQuote: () => {
            setShowQuotationModal(true);
        },
        onAcceptJob: () => {
            setActiveStep(4);
            sendMessage({
                message: t("profileChat.acceptJobMsg") || "I have accepted the job.",
                id: uuidv4(),
            });
            try {
                const content = t("profileChat.acceptJobMsg") || "I have accepted the job.";
                const tsIso = new Date().toISOString();
                window.dispatchEvent(
                    new CustomEvent("chat:new-message", {
                        detail: { roomId, content, senderId: Number(localUser?.id) || 0, timestamp: tsIso },
                    })
                );
            } catch {}
        },
        onUploadAsset: () => {
            const input = document.createElement("input");
            input.type = "file";
            input.onchange = (e) => handleFileUpload(e as any);
            input.click();
        },
        onSendMessage: () => {
            const input = scrollContainerRef.current?.querySelector("input");
            if (input) input.focus();
        },
        onSubmitDelivery: () => {
            setActiveStep(5);
            setShowReviewModal(true);
        },
        onRequestRevision: () => {
            setActiveStep(4);
            setShowReviewModal(false);
            sendMessage({
                message:
                    t("profileChat.requestRevisionMsg") || "Please revise and resubmit.",
                id: uuidv4(),
            });
            try {
                const content = t("profileChat.requestRevisionMsg") || "Please revise and resubmit.";
                const tsIso = new Date().toISOString();
                window.dispatchEvent(
                    new CustomEvent("chat:new-message", {
                        detail: { roomId, content, senderId: Number(localUser?.id) || 0, timestamp: tsIso },
                    })
                );
            } catch {}
        },
        onReleasePayment: () => {
            setActiveStep(6);
            setShowReviewModal(false);
            sendMessage({
                message:
                    t("profileChat.deliveryAccepted") ||
                    "Delivery accepted. Proceed to payment.",
                id: uuidv4(),
            });
            try {
                const content = t("profileChat.deliveryAccepted") || "Delivery accepted. Proceed to payment.";
                const tsIso = new Date().toISOString();
                window.dispatchEvent(
                    new CustomEvent("chat:new-message", {
                        detail: { roomId, content, senderId: Number(localUser?.id) || 0, timestamp: tsIso },
                    })
                );
            } catch {}
        },
    };

    const onSubmit = useCallback(
        (data: MessageForm) => {
            if (isSubmittingRef.current) {
                if (process.env.NODE_ENV !== "production")
                    console.debug("Duplicate submit ignored");
                return;
            }
            const message = data.message?.trim() || "";
            if (!message && !selectedFile) return;

            isSubmittingRef.current = true;
            const messageId = uuidv4();

            setMessages((prev) => [
                {
                    id: messageId,
                    roomId: currentRoom?.roomId || roomId,
                    content: message || "",
                    createdAt: new Date().toISOString(),
                    senderId: Number(localUser?.id) || 0,
                    receiverId: roomId.includes(":") ? Number(roomId.split(":")[1]) || 0 : 0,
                    status: 0,
                    isOwner: true,
                } as ChatMessage,
                ...prev,
            ]);
            try {
                const tsIso = new Date().toISOString();
                updateRoomLastMessage(roomId, message, Number(localUser?.id) || 0, tsIso);
                try {
                    window.dispatchEvent(
                        new CustomEvent("chat:new-message", {
                            detail: { roomId, content: message, senderId: Number(localUser?.id) || 0, timestamp: tsIso },
                        })
                    );
                } catch {}
            } catch {}

            sendMessage({ message, id: messageId });

            setSelectedFile(null);
            isSubmittingRef.current = false;
        },
        [sendMessage, currentRoom, roomId, selectedFile, localUser?.id, updateRoomLastMessage]
    );

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = (await uploadFile(formData)) as UploadedFile;
            setSelectedFile(result);
            e.target.value = "";
        } catch (err) {
            console.error("Upload file failed", err);
        }
    };

    useEffect(() => {
        const rootEl = scrollContainerRef.current;
        if (!topSentinelRef.current || !rootEl || !hasMoreMessages || !isConnected) {
            console.log("[CHAT][OBS] Skipping observer setup", {
                hasTopSentinel: !!topSentinelRef.current,
                hasRoot: !!rootEl,
                hasMoreMessages,
                isConnected,
            });
            return;
        }

        console.log("[CHAT][OBS] Setting up observer");
        const observer = new IntersectionObserver(
            (entries) => {
                const e = entries[0];
                console.log("[CHAT][OBS] Intersection change", {
                    isIntersecting: e.isIntersecting,
                    ratio: e.intersectionRatio,
                    rootBounds: e.rootBounds
                        ? { height: e.rootBounds.height, top: e.rootBounds.top }
                        : null,
                    boundingClientRect: {
                        top: e.boundingClientRect.top,
                        height: e.boundingClientRect.height,
                    },
                });
                if (e.isIntersecting && e.intersectionRatio > 0) {
                    if (isFetching) {
                        console.log("[CHAT][OBS] Visible but skip, already fetching");
                        return;
                    }
                    console.log("[CHAT][OBS] Top sentinel visible -> fetchHistory()");
                    const scrollHeight = rootEl.scrollHeight;
                    fetchHistory().then(() => {
                        const newScrollHeight = rootEl.scrollHeight;
                        console.log("[CHAT][OBS] Scroll adjustment", {
                            oldHeight: scrollHeight,
                            newHeight: newScrollHeight,
                            scrollTop: rootEl.scrollTop,
                        });
                        rootEl.scrollTop += newScrollHeight - scrollHeight;
                    }).catch((err) => {
                        console.error("[CHAT][OBS] Failed to fetch history:", err);
                    });
                }
            },
            { root: rootEl, threshold: [0, 0.1], margin: "10px" }
        );

        observer.observe(topSentinelRef.current);

        return () => {
            console.log("[CHAT][OBS] Disconnecting observer");
            observer.disconnect();
        };
    }, [fetchHistory, hasMoreMessages, isConnected]);

    useEffect(() => {
        if (isConnected) {
            console.log("[CHAT][INIT] Connected -> initial fetchHistory()");
            fetchHistory().then(() => {
                setIsInitialLoading(false);
            }).catch((err) => {
                console.error("[CHAT][INIT] Failed to fetch initial history:", err);
                setIsInitialLoading(false);
            });
        } else {
            console.log("[CHAT][INIT] Not connected yet");
        }
    }, [isConnected, fetchHistory]);

    const prevLatestTsRef = useRef<number>(0);
    useEffect(() => {
        if (!messages.length || !scrollContainerRef.current) return;
        const latestTs = new Date(messages[0].createdAt).getTime();
        if (latestTs > prevLatestTsRef.current || prevLatestTsRef.current === 0) {
            console.log("[CHAT][SCROLL] Scrolling to bottom", {
                from: prevLatestTsRef.current,
                to: latestTs,
                count: messages.length,
            });
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            prevLatestTsRef.current = latestTs;
        } else {
            console.log("[CHAT][SCROLL] Not scrolling (likely prepended history)", {
                latestTs,
                prev: prevLatestTsRef.current,
                count: messages.length,
            });
        }
    }, [messages]);

    if (!roomId) {
        return <LoadingBlur text="No room selected" />;
    }

    return (
        <>
            <div className="relative flex-1 flex flex-col md:flex-row h-full">
                <div className="flex-1 flex flex-col h-full w-full">
                    <ChatHeader
                        avatarUrl={currentRoom?.partnerAvatar || ProfileImage.avatar}
                        displayName={currentRoom?.partnerDisplayName || "User"}
                        guideText={t("profileChat.guide") || "Usage Guide"}
                    />
                    <div
                        ref={scrollContainerRef}
                        data-testid="chat-list"
                        className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50 flex flex-col-reverse"
                        aria-live="polite"
                    >
                        <div ref={endRef} />
                        <ChatMessages
                            messages={messages}
                            partnerAvatar={currentRoom?.partnerAvatar || ProfileImage.avatar}
                        />
                        {hasMoreMessages && (
                            <div ref={topSentinelRef} style={{ height: "20px", background: "transparent" }} aria-hidden="true" />
                        )}
                    </div>
                    <div className="border-t px-3 py-2 md:px-4 md:py-3 bg-white">
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
                                className="md:hidden p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                                onClick={() => setIsFlowOpen(!isFlowOpen)}
                                aria-label={isFlowOpen ? "Hide job flow" : "Show job flow"}
                            >
                                {isFlowOpen ? "Hide" : "Flow"}
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className={`border-l bg-gray-50 h-full transition-all duration-300 ${
                        isFlowOpen ? "translate-x-0" : "translate-x-full"
                    } md:translate-x-0 fixed md:static top-[64px] h-[calc(100vh-64px)] w-64 sm:w-72 md:w-80 lg:w-96 max-w-md z-40 flex flex-col shadow-lg md:shadow-none`}
                    role="complementary"
                    aria-label="Job Flow Sidebar"
                >
                    <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-blue-800">
                            {t("profileChat.jobFlow") || "Job Flow"}
                        </h2>
                        <button
                            className="md:hidden p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200"
                            onClick={() => setIsFlowOpen(false)}
                            aria-label="Close job flow sidebar"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 p-4 md:p-6 overflow-y-auto border-b border-gray-200">
                        <FreelanceChatFlow
                            currentStatus={currentStatus}
                            onChangeStatus={handleChangeStatus}
                            orientation="vertical"
                            compact={false}
                            className="space-y-4"
                            onProposeQuote={flowActions.onProposeQuote}
                            onAcceptJob={flowActions.onAcceptJob}
                            onUploadAsset={flowActions.onUploadAsset}
                            onSendMessage={flowActions.onSendMessage}
                            onSubmitDelivery={flowActions.onSubmitDelivery}
                            onRequestRevision={flowActions.onRequestRevision}
                            onReleasePayment={flowActions.onReleasePayment}
                        />
                    </div>
                    <div className="p-4 md:p-6 bg-white border-t border-gray-200">
                        <div
                            className="flex items-center bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-all duration-200 hover:transform hover:scale-105"
                            aria-label="Job details"
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-md bg-gray-200 overflow-hidden mr-3 md:mr-4 flex-shrink-0">
                                <Image
                                    src={currentRoom?.job?.coverImage || CategoriesImage.seoJob}
                                    alt={currentRoom?.job?.title || "Job Cover"}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-1">
                                    {currentRoom?.job?.title || "No Job Title"}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                                    {currentRoom?.job?.description || "No description available"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {isFlowOpen && (
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-30"
                        onClick={() => setIsFlowOpen(false)}
                        aria-hidden="true"
                    />
                )}
            </div>
            {showReviewModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 md:p-6 w-[95%] sm:w-[90%] max-w-md text-center shadow-lg">
                        <h3 className="text-base md:text-lg font-semibold mb-2">
                            {t("profileChat.reviewDeliveryTitle") || "Review Delivery"}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 mb-4">
                            {t("profileChat.reviewDeliveryDesc") ||
                                "The freelancer submitted work. Do you want to accept or request revision?"}
                        </p>
                        <div className="flex justify-center gap-2 md:gap-3">
                            <button
                                className="rounded-md bg-green-600 hover:bg-green-700 text-white px-3 py-1 md:px-4 md:py-2 text-sm transition-all duration-200"
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setActiveStep(6);
                                    setMessages((prev) => [
                                        {
                                            id: uuidv4(),
                                            roomId: currentRoom?.roomId || roomId,
                                            content:
                                                t("profileChat.deliveryAccepted") ||
                                                "Delivery accepted. Proceed to payment.",
                                            createdAt: new Date().toISOString(),
                                            senderId: Number(localUser?.id) || 0,
                                            receiverId: roomId.includes(":")
                                                ? Number(roomId.split(":")[1]) || 0
                                                : 0,
                                            status: 1,
                                            isOwner: true,
                                        } as ChatMessage,
                                        ...prev,
                                    ]);
                                }}
                            >
                                {t("profileChat.acceptAndRelease") || "Accept & Release Payment"}
                            </button>
                            <button
                                className="rounded-md bg-red-600 hover:bg-red-700 text-white px-3 py-1 md:px-4 md:py-2 text-sm transition-all duration-200"
                                onClick={() => {
                                    setShowReviewModal(false);
                                    setActiveStep(4);
                                    setMessages((prev) => [
                                        {
                                            id: uuidv4(),
                                            roomId: currentRoom?.roomId || roomId,
                                            content:
                                                t("profileChat.requestRevisionMsg") ||
                                                "Please revise and resubmit.",
                                            createdAt: new Date().toISOString(),
                                            senderId: Number(localUser?.id) || 0,
                                            receiverId: roomId.includes(":")
                                                ? Number(roomId.split(":")[1]) || 0
                                                : 0,
                                            status: 1,
                                            isOwner: true,
                                        } as ChatMessage,
                                        ...prev,
                                    ]);
                                }}
                            >
                                {t("profileChat.requestRevision") || "Request Revision"}
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