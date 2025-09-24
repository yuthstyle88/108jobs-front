"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {v4 as uuidv4} from "uuid";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {ProfileImage} from "@/constants/images";
import type {ChatMessage as WsChatMessage, Post} from "lemmy-js-client";
import ChatHeader from "../ChatHeader";
import ChatInput from "../ChatInput";
import ChatMessages from "../ChatMessages";
import {useWebSocket} from "@/contexts/RealtimeChatContext";
import {useChatRooms} from "@/contexts/ChatRoomsContext";
import {useUnreadStore} from "@/stores/unreadStore";
import FreelanceChatFlow, {FlowActions, StatusKey} from "@/components/FreelanceChatFlow";
import {createFlowActions} from "@/utils/chat/flowActions";
import QuotationModal from "@/components/Common/Modal/QuotationModal";
import {useWorkflowStepper} from "@/hooks/useWorkflowMachine";
import {useHttpPost} from "@/hooks/useHttpPost";
import {apiToUiStatus, useStateMachineStore} from "@/stores/stateMachineStore";
import {isBrowser} from "@/utils/browser";
import {Trash2} from "lucide-react";
import {getLatestProposedQuotePayload} from "@/utils/chat/message";
import {JobDetailModal} from "@/components/Common/Modal/JobDetailModal";
import {ReviewDeliveryModal} from "@/components/Common/Modal/ReviewDeliveryModal";
import {JobFlowContent} from "@/components/JobFlowContent";
import {useWorkflowStatus} from '@/hooks/chat/useWorkflowStatus';
import {useTypingIndicator} from '@/hooks/chat/useTypingIndicator';
import {useFileUpload} from '@/hooks/chat/useFileUpload';
import {useWorkflowActions} from '@/hooks/chat/useWorkflowActions';
import {createChatRealtimeHandler} from './createChatRealtimeHandler';

type MessageForm = { message: string };
type UIChatMessage = WsChatMessage & { isOwner?: boolean };

interface ChatSectionProps {
    post?: Post;
    partnerName: string;
    partnerAvatar: string;
    partnerId?: number;
    partnerAvailable?: boolean;
    currentRoom: any;
}

const ChatSection: React.FC<ChatSectionProps> = ({
                                                     post,
                                                     partnerName,
                                                     partnerAvatar,
                                                     partnerId,
                                                     partnerAvailable,
                                                     currentRoom
                                                 }) => {
    const {t} = useTranslation();
    const {localUser, person, wallet} = useMyUser();
    const isSubmittingRef = useRef(false);
    const myAvailable = person?.available !== false; // treat undefined as available
    const canSend = (partnerAvailable !== false) && myAvailable;
    const disabledReason = !myAvailable
        ? (t("profileChat.youAreNotAvailable") || "You are currently unavailable. Enable availability in your profile to send messages.")
        : (t("profileChat.userNotAvailable") || "This user is currently not accepting messages. You can read history but cannot send new messages.");
    const latestIncomingRef = useRef<{
        roomId: string;
        content: string;
        senderId: number;
        timestamp: string
    } | null>(null);
    const roomId = currentRoom.room.room.id;
    const {markRoomRead, setActiveRoomId} = useChatRooms();
    const {send, canGo, ORDER} = useWorkflowStepper();
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    const [showQuotationModal, setShowQuotationModal] = useState<boolean>(false);
    const [showJobDetailModal, setShowJobDetailModal] = useState<boolean>(false);
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [isFlowOpen, setIsFlowOpen] = useState(false);
    const [workflowIdState, setWorkflowIdState] = useState<number | null>(null);
    const [hasProposedQuote, setHasProposedQuote] = useState<boolean>(currentRoom.workflow?.hasProposedQuote || false);
    const [messages, setMessages] = useState<UIChatMessage[]>([]);
    const atBottomRef = useRef<boolean>(true);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const {isPartnerTyping, onRemoteTyping} = useTypingIndicator({roomId});
    const markSeen = useUnreadStore((s) => s.markSeen);
    const [, setIsInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {
        selectedFile,
        setSelectedFile,
        isDeletingFile,
        handleFileUpload,
        handleRemoveSelectedFile
    } = useFileUpload({setError, t: (k: string) => t(k)});
    const [newSinceCount, setNewSinceCount] = useState<number>(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollParentEl, setScrollParentEl] = useState<HTMLElement | null>(null);
    const roomPostId = currentRoom?.room?.post?.id;
    const roomCommentId = currentRoom?.room?.currentComment?.id;
    const postCreatorId = post?.creatorId;
    const isEmployer = postCreatorId != null && person?.id != null ? String(postCreatorId) === String(person?.id) : undefined;
    const lastClientUpdateRef = useRef<{ status: StatusKey | null; timestamp: number }>({status: null, timestamp: 0});
    const setScrollRef = useCallback((el: HTMLDivElement | null) => {
        scrollContainerRef.current = el;
        if (el) setScrollParentEl(el);
    }, []);
    const scrollToLatest = () => {
        const rootEl = scrollContainerRef.current;
        if (rootEl) {
            rootEl.scrollTop = rootEl.scrollHeight - rootEl.clientHeight;
        }
    };
    const scrollToLatestSoon = () => {
        if (!isBrowser()) return;
        try {
            requestAnimationFrame(() => requestAnimationFrame(scrollToLatest));
        } catch {
            setTimeout(scrollToLatest, 0);
        }
    };

    // Measure chat input height to prevent last message being obscured
    const inputContainerRef = useRef<HTMLDivElement>(null);
    const [bottomPad, setBottomPad] = useState<number>(0);
    useEffect(() => {
        const el = inputContainerRef.current;
        if (!el || typeof ResizeObserver === "undefined") return;
        const ro = new ResizeObserver((entries) => {
            const rect = entries[0]?.contentRect;
            if (rect) {
                // Add small gap (8px) for visual breathing room
                setBottomPad(Math.ceil(rect.height + 8));
            }
        });
        ro.observe(el);
        return () => {
            try {
                ro.disconnect();
            } catch {
            }
        };
    }, []);

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

    const {sendMessage, sendTyping, fetchHistory, isConnected, hasMoreMessages, isFetching} = useWebSocket(
        `chat-view:${roomId}`,
        (event: MessageEvent<string | WsChatMessage | WsChatMessage[]>) =>
            createChatRealtimeHandler({
                roomId,
                localUserId: Number(localUser?.id) || 0,
                onRemoteTyping,
                getIsFetching: () => isFetching,
                tryUpdateStatusFromItems,
                setMessages: setMessages as any,
                atBottomRef,
                setNewSinceCount,
                latestIncomingRef,
            })(event)
    );

    // After commit, propagate the last incoming message to ChatRooms context and auto-scroll for receiver
    useEffect(() => {
        if (isFetching) return; // suppress global updates while fetching history
        const d = latestIncomingRef.current;
        if (!d) return;
        try {
            // Auto-scroll to the latest when receiving a new message (receiver experience)
            if (d.senderId !== Number(localUser?.id)) {
                scrollToLatestSoon();
            }
            // Only update preview; rely on global event for conditional reordering
            // no-op: last message previews removed
            try {
                const isUnread = d.senderId !== Number(localUser?.id) && !atBottomRef.current;
                window.dispatchEvent(new CustomEvent("chat:new-message", {detail: {...d, unread: isUnread}}));
            } catch {
            }
        } finally {
            latestIncomingRef.current = null;
        }
    }, [messages, isFetching]);

    // Mark this room as active and mark as read on mount
    useEffect(() => {
        try {
            setActiveRoomId(roomId);
            markRoomRead(roomId);
            markSeen(roomId);
        } catch {
        }
        return () => {
            try {
                setActiveRoomId(null);
            } catch {
            }
        };
    }, [roomId, setActiveRoomId, markRoomRead]);

    const currentStatus = useStateMachineStore((s) => s.state);

    // Define setWorkflowState reactively
    const setWorkflowState = (key: StatusKey, isClientUpdate = true) => {  // Add optional flag
        useStateMachineStore.setState({
            state: key,
            stepIndex: ORDER.indexOf(key),
        });
        if (isClientUpdate) {
            lastClientUpdateRef.current = {status: key, timestamp: Date.now()};
        }
    };
    const {
        tryUpdateStatusFromItems,
        goToStatus,
        handleChangeStatus
    } = useWorkflowStatus({
        currentStatus,
        setWorkflowState,
        hasStarted,
        setHasStarted,
        ORDER,
        send,
        canGo,
    });

    useEffect(() => {
        const rd: any = currentRoom as any;
        if (!rd) return;
        const apiStatusRaw = rd?.room?.workflow?.status ?? rd?.workflow?.status ?? rd?.room?.status ?? rd?.status ?? rd?.room?.workflowStatus ?? rd?.workflowStatus;
        if (typeof apiStatusRaw === 'string') {
            const uiStatus = apiToUiStatus(apiStatusRaw as any);
            if (uiStatus) {
                const now = Date.now();
                const recentClientUpdate = lastClientUpdateRef.current;
                const gracePeriodMs = 5000;
                if (
                    recentClientUpdate.status &&
                    recentClientUpdate.status !== uiStatus &&
                    now - recentClientUpdate.timestamp < gracePeriodMs
                ) {
                    return;
                }
                const shouldBeStarted = uiStatus !== 'Completed' && uiStatus !== 'Cancelled';
                setHasStarted(shouldBeStarted);
                if (uiStatus !== currentStatus) {
                    setWorkflowState(uiStatus as StatusKey, false);
                }
            }
        }
    }, [currentRoom, currentStatus, hasStarted]);


    const {execute: createInvoice} = useHttpPost("createInvoice");
    const {execute: startWorkflow} = useHttpPost("startWorkflow");
    const {execute: approveQuotationApi} = useHttpPost("approveQuotation");
    const {execute: submitStartWorkApi} = useHttpPost("submitStartWork");
    const {execute: approveWorkApi} = useHttpPost("approveWork");


    // Helper to add a local (owner) message to the list and scroll
    const addOwnMessage = useCallback((content: string, id?: string) => {
        const messageId = id ?? uuidv4();
        setMessages((prev) => [
            {
                id: messageId,
                roomId: currentRoom?.roomId || roomId,
                content,
                createdAt: new Date().toISOString(),
                senderId: Number(localUser?.id) || 0,
                status: 1,
                isOwner: true,
            } as WsChatMessage,
            ...prev,
        ]);
        scrollToLatestSoon();
        return messageId;
    }, [currentRoom, roomId, localUser?.id]);

    // Centralize all workflow actions into a dedicated hook
    const {
        startWorkflowAction,
        quotationSubmit,
        approveQuotation: approveQuotationFromHook,
        startWork,
        submitDelivery,
        requestRevision,
        approveWork,
        cancelJob,
    } = useWorkflowActions({
        messages,
        roomData: currentRoom,
        workflowIdState,
        localUser: localUser || person,
        roomId,
        selectedFile,
        setError,
        t: (k: string) => t(k) || k,
        addOwnMessage,
        sendMessage,
        goToStatus,
        setHasStarted,
        setWorkflowIdState,
        setShowQuotationModal,
        setSelectedFile,
        canSend,
        disabledReason,
        createInvoice,
        startWorkflow,
        approveQuotationApi,
        submitStartWorkApi,
        approveWorkApi,
        postId: roomPostId,
        walletId: wallet?.id,
        currentStatus,
        setHasProposedQuote,
    });

    const onSubmit = useCallback(
        (data: MessageForm) => {
            if (!canSend) {
                setError(disabledReason);
                return;
            }
            if (isSubmittingRef.current) {
                return;
            }
            const message = data.message?.trim() || "";
            if (!message && !selectedFile) return;

            // Build content (file payload or plain text)
            const contentToSend = selectedFile
                ? JSON.stringify({
                    type: "file",
                    url: selectedFile.fileUrl,
                    name: selectedFile.fileName,
                    mime: selectedFile.fileType,
                    caption: message || undefined,
                })
                : message;

            isSubmittingRef.current = true;
            const messageId = uuidv4();

            addOwnMessage(contentToSend || "", messageId);
            try {
                const tsIso = new Date().toISOString();
                const preview = selectedFile
                    ? (message || `[File] ${selectedFile.fileName}`)
                    : message;
                try {
                    window.dispatchEvent(
                        new CustomEvent("chat:new-message", {
                            detail: {roomId, content: preview, senderId: Number(localUser?.id) || 0, timestamp: tsIso},
                        })
                    );
                } catch {
                }
            } catch {
            }

            sendMessage({message: contentToSend, id: messageId});

            setSelectedFile(null);
            isSubmittingRef.current = false;
        },
        [sendMessage, currentRoom, roomId, selectedFile, localUser?.id]
    );

    const didInitialFetchRef = useRef(false);
    // Fetch initial history as soon as component mounts (or roomId changes),
    // without waiting for a websocket connection. This fixes empty chat on page refresh
    // when WS is slow or blocked; the WS effect below will no-op if we've already fetched.
    useEffect(() => {
        if (!didInitialFetchRef.current) {
            didInitialFetchRef.current = true;
            fetchHistory()
                .then(() => {
                    setIsInitialLoading(false);
                })
                .catch((err) => {
                    console.error("[CHAT][INIT] Failed to fetch initial history:", err);
                    setIsInitialLoading(false);
                });
        }
        // Reset the guard if roomId changes (new chat)
        return () => { /* no-op */
        };
    }, [roomId]);

    // Keep previous behavior: when WS connects later (after slow networks), ensure
    // we have at least one initial fetch; guarded to avoid duplicates.
    useEffect(() => {
        if (isConnected && !didInitialFetchRef.current) {
            didInitialFetchRef.current = true;
            fetchHistory()
                .then(() => {
                    setIsInitialLoading(false);
                })
                .catch((err) => {
                    console.error("[CHAT][INIT] Failed to fetch initial history:", err);
                    setIsInitialLoading(false);
                });
        } else if (!isConnected) {
            // Allow another initial fetch if we fully disconnect and reconnect later
            didInitialFetchRef.current = false;
            console.log("[CHAT][INIT] Not connected yet");
        }
    }, [isConnected]);

    // Determine latest quotation amount and whether employer has sufficient balance to approve
    const latestQuoteAmount = useMemo(() => {
        const p: any = getLatestProposedQuotePayload(messages as any);
        const amt = Number(p?.quote?.amount);
        return Number.isFinite(amt) ? amt : undefined;
    }, [messages]);

    const availableBalance: number = useMemo(() => {
        const total = Number((wallet as any)?.balanceAvailable ?? (wallet as any)?.balanceTotal ?? 0);
        return Number.isFinite(total) ? total : 0;
    }, [wallet]);

    const insufficientForApprove = useMemo(() => {
        return Boolean(isEmployer && hasProposedQuote && latestQuoteAmount != null && availableBalance < (latestQuoteAmount as number));
    }, [isEmployer, hasProposedQuote, latestQuoteAmount, availableBalance]);

    // Wrap approveQuotation with additional balance guard to keep identical behavior
    const approveQuotationWrapped = React.useCallback(async (): Promise<boolean> => {
        if (insufficientForApprove) {
            setError(t('profileChat.insufficientBalanceWarning') || 'Insufficient balance to approve the quotation.');
            return false;
        }
        return await approveQuotationFromHook();
    }, [insufficientForApprove, approveQuotationFromHook, setError, t]);

    const flowActions: FlowActions = createFlowActions({
        t,
        goToStatus,
        setShowQuotationModal,
        setShowReviewModal,
        setMessages,
        sendMessage,
        handleFileUpload: (ev: any) => handleFileUpload(ev as any),
        scrollContainerRef,
        currentRoom,
        roomId,
        localUser,
        setError,
        approveQuotation: approveQuotationWrapped,
        startWork: async () => await startWork(),
        getPostId: () => roomPostId,
        submitDelivery: async () => await submitDelivery(),
        hasSelectedFile: () => !!selectedFile,
        requestRevision: async () => await requestRevision(),
        approveWork: async () => await approveWork(),
    });

    const renderFlowContent = () => (
        <>
            {isEmployer !== undefined && (
                <FreelanceChatFlow
                    currentStatus={currentStatus}
                    onChangeStatus={handleChangeStatus}
                    orientation="vertical"
                    compact={false}
                    className="space-y-4"
                    started={hasStarted}
                    onStart={startWorkflowAction}
                    canProposeQuote={!isEmployer && Boolean(roomPostId) && !hasProposedQuote}
                    canApproveQuotation={isEmployer && hasProposedQuote}
                    insufficientForApprove={insufficientForApprove}
                    isEmployer={isEmployer}
                    canSubmitDelivery={!!selectedFile}
                    onProposeQuote={flowActions.onProposeQuote}
                    onApproveQuotation={flowActions.onApproveQuotation}
                    onStartWork={!isEmployer ? flowActions.onStartWork : undefined}
                    onUploadAsset={!isEmployer ? flowActions.onUploadAsset : undefined}
                    onSendMessage={flowActions.onSendMessage}
                    onSubmitDelivery={!isEmployer ? flowActions.onSubmitDelivery : undefined}
                    onRequestRevision={isEmployer ? flowActions.onRequestRevision : undefined}
                    onReleasePayment={isEmployer ? flowActions.onReleasePayment : undefined}
                    onCancel={() => {
                        void cancelJob();
                    }}
                    onFileUpload={(ev: any) => handleFileUpload(ev as any)}
                    selectedFile={selectedFile}
                    isDeletingFile={isDeletingFile}
                    onFileRemove={handleRemoveSelectedFile}
                />
            )}
        </>
    );

    return (
        <>
            <div className="relative flex-1 min-w-0 flex flex-col md:flex-row h-full">
                <div className="flex-1 min-w-0 flex flex-col h-full w-full">
                    <ChatHeader
                        avatarUrl={partnerAvatar || ProfileImage.avatar}
                        displayName={partnerName || "User"}
                        typingText={isPartnerTyping ? (t("profileChat.typing") || "กำลังพิมพ์...") : undefined}
                        onToggleFlow={() => setIsFlowOpen((v) => !v)}
                        isFlowOpen={isFlowOpen}
                    />
                    <div
                        ref={setScrollRef}
                        data-testid="chat-list"
                        className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 pt-3 sm:pt-4 bg-gray-50 flex"
                        style={{paddingBottom: `calc(${bottomPad}px + env(safe-area-inset-bottom))`}}
                        aria-live="polite"
                    >
                        <ChatMessages
                            messages={messages}
                            partnerAvatar={currentRoom?.partnerAvatar || ProfileImage.avatar}
                            customScrollParent={scrollParentEl}
                            onTopReached={() => {
                                if (!hasMoreMessages || isFetching) return;
                                const rootEl = scrollContainerRef.current;
                                const oldHeight = rootEl?.scrollHeight || 0;
                                fetchHistory()
                                    .then(() => {
                                        const newHeight = rootEl?.scrollHeight || 0;
                                        if (rootEl) rootEl.scrollTop += newHeight - oldHeight;
                                    })
                                    .catch(() => {
                                    });
                            }}
                            hasMore={hasMoreMessages}
                            isFetching={isFetching}
                            onAtBottomChange={(isAtBottom) => {
                                atBottomRef.current = isAtBottom;
                                setIsAtBottom(isAtBottom);
                                if (isAtBottom) {
                                    setNewSinceCount(0);
                                    setMessages(prev => prev.map(m => (!m.isOwner && m.status === 0 ? {
                                        ...m,
                                        status: 1
                                    } : m)));
                                    try {
                                        markRoomRead(roomId);
                                    } catch {
                                    }
                                    try {
                                        markSeen(roomId);
                                    } catch {
                                    }
                                }
                            }}
                        />
                    </div>
                    <div ref={inputContainerRef} className="border-t px-3 py-2 sm:px-4 sm:py-3 bg-white">
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                                {!canSend && (
                                    <div
                                        className="mb-2 p-2 rounded bg-yellow-50 text-yellow-800 text-xs border border-yellow-200">
                                        {(!myAvailable ? (t("profileChat.youAreNotAvailable") || "You are currently unavailable. Enable availability in your profile to send messages.") : (t("profileChat.userNotAvailable") || "This user is currently not accepting messages. You can read history but cannot send new messages."))}
                                    </div>
                                )}
                                {selectedFile && (
                                    <div
                                        className="mb-2 flex items-center justify-between rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span aria-hidden className="text-blue-600">📎</span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-blue-900 truncate"
                                                   title={selectedFile.fileName}>
                                                    {selectedFile.fileName}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveSelectedFile}
                                            disabled={isDeletingFile}
                                            className={`text-xs ${isDeletingFile ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-800'}`}
                                            aria-label="Remove attached file"
                                            aria-busy={isDeletingFile}
                                        >
                                            <Trash2 className={`h-4 w-4 ${isDeletingFile ? 'animate-spin' : ''}`}
                                                    aria-hidden="true"/>
                                        </button>
                                    </div>
                                )}
                                <ChatInput
                                    onSubmit={onSubmit}
                                    disabled={!canSend}
                                    disabledHint=""
                                    onFileUpload={(ev: any) => handleFileUpload(ev as any)}
                                    onTyping={(v) => {
                                        try {
                                            sendTyping?.(v);
                                        } catch {
                                        }
                                    }}
                                    typingHint={isPartnerTyping ? (t("profileChat.typing") || "กำลังพิมพ์...") : undefined}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={`hidden md:flex border-l bg-gray-50 h-full transition-all duration-300 ${
                        isFlowOpen ? "translate-x-0" : "translate-x-full"
                    } md:translate-x-0 fixed md:static top-16 sm:top-20 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] w-[80vw] sm:w-[70vw] md:w-64 lg:w-80 xl:w-96 max-w-[360px] z-40 flex-col shadow-lg md:shadow-none`}
                    role="complementary"
                    aria-label="Job Flow Sidebar"
                >
                    <JobFlowContent
                        setIsFlowOpen={setIsFlowOpen}
                        renderFlowContent={renderFlowContent}
                        setShowJobDetailModal={setShowJobDetailModal}
                        currentRoom={currentRoom.room}
                    />
                </div>
                {isFlowOpen && (
                    <div
                        className="md:hidden fixed top-16 sm:top-20 right-0 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] w-[80vw] sm:w-[70vw] max-w-[360px] bg-white border-l shadow-xl z-40 flex flex-col"
                    >
                        <JobFlowContent
                            setIsFlowOpen={setIsFlowOpen}
                            renderFlowContent={renderFlowContent}
                            setShowJobDetailModal={setShowJobDetailModal}
                            currentRoom={currentRoom.room}
                        />
                    </div>
                )}
                {isFlowOpen && (
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-30"
                        onClick={() => setIsFlowOpen(false)}
                        aria-hidden="true"
                    />
                )}
            </div>
            {showReviewModal && (
                <ReviewDeliveryModal
                    showReviewModal={showReviewModal}
                    setShowReviewModal={setShowReviewModal}
                    goToStatus={goToStatus}
                    canSend={canSend}
                    setError={setError}
                    disabledReason={disabledReason}
                    sendMessage={sendMessage}
                    requestRevisionAction={requestRevision}
                    roomId={roomId}
                    localUser={localUser}
                />
            )}
            {showJobDetailModal && (
                <JobDetailModal
                    showJobDetailModal={showJobDetailModal}
                    setShowJobDetailModal={setShowJobDetailModal}
                    currentRoom={currentRoom.room}
                />
            )}
            <QuotationModal
                isOpen={showQuotationModal}
                onClose={() => setShowQuotationModal(false)}
                onSubmit={quotationSubmit}
                postId={roomPostId as number}
                commentId={roomCommentId as number}
                partnerId={partnerId as number}
                projectName={currentRoom.room.post.name || t("profileChat.noJobTitle")}
                amount={currentRoom.room.post.budget}
            />
        </>
    );
};

export default ChatSection;