"use client";

/**
 * ChatSection
 * -------------
 * Purpose:
 *   High-level container for a freelancer/employer chat room. Renders header, message list,
 *   input area, and the job workflow side panel. Coordinates history fetching, read receipts,
 *   and workflow state synchronization.
 *
 * Key data flow:
 *   - Messages: read from `useChatStore(selectRoomMessages(roomId))`. History pages are appended
 *     via `useChatHistory({...}).actions.fetchHistory()` and written back using `upsertHistory`.
 *   - Sending: user input -> `onSubmit` -> adapter (`useChatRoom().actions.sendMessage`).
 *   - Read/Seen: when user reaches bottom or window regains focus -> `sendReadReceipt` and
 *     `roomsStore.markRoomRead/markSeen`.
 *   - Workflow: `useWorkflowStatus` + `useWorkflowActions` sync API/workflow state to UI/side panel.
 *
 * UX principles:
 *   - Minimal, predictable scrolling: keep viewport stable after loading older pages.
 *   - Clean state: no optimistic emit duplication — adapter is the single source of truth for emits.
 *   - Mobile-first layout: workflow panel collapses on small screens.
 */

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {v4 as uuidv4} from "uuid";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {ProfileImage} from "@/constants/images";
import type {ChatMessage, ChatRoomData, LocalUser, LocalUserId, Post} from "lemmy-js-client";
import ChatHeader from "../ChatHeader";
import ChatInput from "../ChatInput";
import ChatMessages from "../ChatMessages";
import {useUnreadStore} from "@/core/chat/store/unreadStore";
import {useRoomsStore} from '@/core/chat/store/roomsStore';
import FreelanceChatFlow, {FlowActions, StatusKey} from "@/components/FreelanceChatFlow";
import {createFlowActions} from "@/core/chat/utils/flowActions";
import QuotationModal from "@/components/Common/Modal/QuotationModal";
import {useWorkflowStepper} from "@/hooks/useWorkflowMachine";
import {useHttpPost} from "@/hooks/useHttpPost";
import {apiToUiStatus, useStateMachineStore} from "@/store/stateMachineStore";
import {Trash2} from "lucide-react";
import {getLatestProposedQuotePayload} from "@/core/chat/utils/message";
import {JobDetailModal} from "@/components/Common/Modal/JobDetailModal";
import {ReviewDeliveryModal} from "@/components/Common/Modal/ReviewDeliveryModal";
import {JobFlowContent} from "@/components/JobFlowContent";
import {useWorkflowStatus} from '@/core/chat/hooks/useWorkflowStatus';
import {useFileUpload} from '@/core/chat/hooks/useFileUpload';
import {useWorkflowActions} from '@/core/chat/hooks/useWorkflowActions';
import {emitChatNewMessage} from "@/core/chat/events";
import {useChatRoom} from '@/core/chat/hooks/useChatRoom';
import {useChatHistory} from '@/core/chat/hooks/useChatHistory';
import {useChatStore} from "@/core/chat/store/chatStore";
import {useShallow} from 'zustand/react/shallow';
import {selectRoomMessages} from '@/core/chat/utils/selectors';
import {useLoadLastRead} from "@/core/chat/hooks/useLoadLastRead";


/** Shape of the form submitted by ChatInput. */
type MessageForm = { message: string };


/**
 * Props for ChatSection
 * @property post               (Optional) Post record tied to this room; used for employer/freelancer role checks.
 * @property partnerName        Display name for the chat partner.
 * @property partnerAvatar      URL for the partner avatar (fallbacks applied at render).
 * @property partnerId          Numeric partner ID used by quotation modal and workflow actions.
 * @property partnerAvailable   Whether partner currently accepts messages (false blocks sending).
 * @property roomData           Full room data object (server-sourced). Used to seed currentRoom and workflow.
 * @property localUser          Current logged-in user record.
 * @property peerPublicKeyHex   Public key used for peer activity/typing via channel hook.
 */
interface ChatSectionProps {
    post?: Post;
    partnerName: string;
    partnerAvatar: string;
    partnerId: LocalUserId;
    partnerAvailable?: boolean;
    roomData: ChatRoomData;
    localUser: LocalUser;
    shareKey: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({
                                                     post,
                                                     partnerName,
                                                     partnerAvatar,
                                                     partnerId,
                                                     partnerAvailable,
                                                     roomData,
                                                     localUser,
                                                     shareKey
                                                 }) => {
    const {t} = useTranslation();
    const {person, wallet} = useMyUser();
    // --- Availability & basic send gating ---
    // Treat undefined availability as "available". Block sending if either side is unavailable.
    const isSubmittingRef = useRef(false);
    const myAvailable = person?.available !== false; // treat undefined as available
    const canSend = (partnerAvailable !== false) && myAvailable;
    const disabledReason = !myAvailable
        ? (t("profileChat.youAreNotAvailable") || "You are currently unavailable. Enable availability in your profile to send messages.")
        : (t("profileChat.userNotAvailable") || "This user is currently not accepting messages. You can read history but cannot send new messages.");
    // Set of message IDs received during this session, used by history hook to deduplicate pages.
    const receivedIds = useMemo(() => new Set<string>(), []);
    const roomId = String(roomData?.room?.room?.id ?? "");
    // Hydrate UI from the local store (messages + pending) so leftover local data shows immediately
    const {send, canGo, ORDER} = useWorkflowStepper();
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    const [showQuotationModal, setShowQuotationModal] = useState<boolean>(false);
    const [showJobDetailModal, setShowJobDetailModal] = useState<boolean>(false);
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [isFlowOpen, setIsFlowOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState<ChatRoomData>(roomData);
    // Store selector pinned to the current room. Guarantees stable ascending order and dedup at selector level.
    const roomSelector = React.useMemo(() => (s: any) => selectRoomMessages(s, String(roomId)), [roomId]);
    const messages = useChatStore(useShallow(roomSelector)) as ChatMessage[];
    const initialFetchRef = useRef(false);
    const markSeen = useUnreadStore((s) => s.markSeen);
    const [error, setError] = useState<string | null>(null);
    const {setActiveRoomId, markRoomRead} = useRoomsStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollParentEl, setScrollParentEl] = useState<HTMLElement | null>(null);
    const _rawPostId: unknown = (currentRoom as any)?.room?.post?.id;
    const hasFocusedRef = useRef(false);
    const roomPostId: number | undefined = typeof _rawPostId === 'number'
        ? _rawPostId
        : (typeof _rawPostId === 'string' && _rawPostId.trim() !== '' && !Number.isNaN(Number(_rawPostId))
            ? Number(_rawPostId)
            : undefined);
    const roomCommentId = currentRoom?.room?.currentComment?.id;
    const postCreatorId = post?.creatorId;
    const isEmployer = postCreatorId != null && person?.id != null ? String(postCreatorId) === String(person?.id) : undefined;
    const lastClientUpdateRef = useRef<{ status: StatusKey | null; timestamp: number }>({status: null, timestamp: 0});
    const currentStatus = useStateMachineStore((s) => s.state);
    const statusBeforeCancel = useStateMachineStore((s) => s.statusBeforeCancel);
    const calculatedProposedQuote = useMemo(() => {
        return Boolean(getLatestProposedQuotePayload(messages as any));
    }, [messages]);
    // Determine latest quotation amount and whether employer has sufficient balance to approve
    const latestQuoteAmount = currentRoom?.room?.post?.budget ?? 0;

    // --- Quotation & balance helpers ---
    // Compute available wallet balance and whether it is insufficient to approve the latest quotation.
    const availableBalance: number = useMemo(() => {
        const total = Number((wallet as any)?.balanceAvailable ?? (wallet as any)?.balanceTotal ?? 0);
        return Number.isFinite(total) ? total : 0;
    }, [wallet]);

    const insufficientForApprove = useMemo(() => {
        return Boolean(isEmployer && latestQuoteAmount != null && availableBalance < (latestQuoteAmount as number));
    }, [isEmployer, latestQuoteAmount, availableBalance]);

    const isEmployerKnown = typeof isEmployer === 'boolean';
    const canProposeQuoteProp =
        isEmployerKnown ? (!isEmployer && Boolean(roomPostId) && !calculatedProposedQuote) : false;
    const canApproveQuotationProp =
        isEmployerKnown ? (Boolean(isEmployer) && calculatedProposedQuote) : false;
    const {execute: createInvoice} = useHttpPost("createInvoice");
    const {execute: startWorkflow} = useHttpPost("startWorkflow");
    const {execute: approveQuotationApi} = useHttpPost("approveQuotation");
    const {execute: submitStartWorkApi} = useHttpPost("submitStartWork");
    const {execute: approveWorkApi} = useHttpPost("approveWork");
    const inputContainerRef = useRef<HTMLDivElement>(null);
    useCallback((el: HTMLDivElement | null) => {
        scrollContainerRef.current = el;
        if (el) setScrollParentEl(el);
    }, []);

    const {
        selectedFile,
        setSelectedFile,
        isDeletingFile,
        handleFileUpload,
        handleRemoveSelectedFile
    } = useFileUpload({setError, t: (k: string) => t(k)});
    const upsertHistory = useChatStore(s => s.upsertHistory);

    // fetch the last read timestamp from the backend and store it into useReadLastIdStore
    useLoadLastRead(roomId, partnerId);

    // --- History management ---
    // Pulls paginated history for this room and writes pages into the global store via upsertHistory.
    // `receivedSet` prevents double-inserting messages when pages overlap.
    const {
        state: {hasMore, isFetching},
        actions: {fetchHistory},
    } = useChatHistory({
        roomId,
        pageSize: 40,
        isE2EMock: false,
        localUserId: Number(localUser.id) || 0,
        receivedSet: receivedIds,
        broadcast: () => {
        },
        upsertHistory,
    });
    const {
        actions: {sendMessage, sendTyping, sendRoomUpdate, sendReadReceipt},
        state: {refreshRoomData, isPartnerTyping},
    } = useChatRoom({roomId, shareKey, localUser, roomData: currentRoom});

    // Deduplicate read-receipts: remember last sent message id
    const lastReadSentRef = useRef<string | null>(null);

    const sendLatestRead = useCallback(() => {
        // Prevent sending when tab is hidden or unfocused
        if (document.visibilityState !== "visible" || !document.hasFocus()) {
            return;
        }
        const last = messages[messages.length - 1];
        if (!last) return;
        // Only send if last message is not mine
        if (Number(last.senderId) === Number(localUser.id)) return;
        const lastIdStr = String(last.id);
        if (lastReadSentRef.current === lastIdStr) return; // already sent for this message
        try {
            sendReadReceipt(roomId, lastIdStr);
        } catch {
        }
        lastReadSentRef.current = lastIdStr;
    }, [messages, localUser.id, roomId, sendReadReceipt]);

    // Reset dedupe tracker whenever a new message appears
    useEffect(() => {
        const last = messages[messages.length - 1];
        if (last) {
            const lastIdStr = String(last.id);
            if (lastReadSentRef.current !== lastIdStr) {
                lastReadSentRef.current = null; // reset so we can send again
            }
        }
    }, [messages]);

    // Also reset when switching rooms
    useEffect(() => {
        lastReadSentRef.current = null;
    }, [roomId]);

    // Single source of truth for sending read-receipts (deduped by last message id)
    useEffect(() => {
        sendLatestRead();
    }, [sendLatestRead]);

    // On window focus, retry once via the same helper
    useEffect(() => {
        const onVisible = () => sendLatestRead();
        window.addEventListener("focus", onVisible);
        return () => window.removeEventListener("focus", onVisible);
    }, [sendLatestRead]);

    // Auto-collapse the workflow panel on narrow viewports to preserve space for the conversation.
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

    // Keep local `currentRoom` in sync with server-refreshed room metadata from the channel.
    useEffect(() => {
        if (!refreshRoomData) return;
        setCurrentRoom({...refreshRoomData});
    }, [refreshRoomData]);

    // Mark active + read, and notify peer on join/leave (single source of truth)
    useEffect(() => {
        try {
            setActiveRoomId(roomId);
            markRoomRead(roomId);
            markSeen(roomId);
            // announce enter immediately on join
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('chat:status-change', {detail: {roomId, status: 'room:enter'}}));
            }
        } catch {
        }
        return () => {
            try {
                // announce leave on unmount / room change
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('chat:status-change', {
                        detail: {
                            roomId,
                            status: 'room:leave'
                        }
                    }));
                }
            } catch {
            }
            try {
                setActiveRoomId('');
            } catch {
            }
        };
    }, [roomId, setActiveRoomId, markRoomRead, markSeen]);

    useEffect(() => {
        if (initialFetchRef.current) return;

        if (messages.length === 0 && hasMore && !isFetching) {
            initialFetchRef.current = true;
            // console.log("🔄 Initial page load - fetching chat history");

            fetchHistory()
                .then(() => {
                    // console.log("✅ Initial history fetch completed");
                })
                .catch((error) => {
                    console.error("❌ Failed to fetch initial history:", error);
                    initialFetchRef.current = false; // Allow retry
                });
        }
    }, [messages.length, hasMore, isFetching, fetchHistory, t]);

    const setWorkflowState = (key: StatusKey, statusBeforeCancel?: StatusKey, isClientUpdate = true) => {
        useStateMachineStore.setState({
            state: key,
            stepIndex: ORDER.indexOf(key),
            statusBeforeCancel: key === 'Cancelled' ? (statusBeforeCancel ?? currentStatus) : undefined,
        });
        if (isClientUpdate) {
            lastClientUpdateRef.current = {status: key, timestamp: Date.now()};
        }
    };

    const {goToStatus, handleChangeStatus} = useWorkflowStatus({
        currentStatus,
        setWorkflowState,
        hasStarted,
        setHasStarted,
        ORDER,
        send,
        canGo,
        statusBeforeCancel,
    });

    // Reflect backend workflow state in the UI state machine. Keeps `hasStarted` and `statusBeforeCancel` coherent.
    useEffect(() => {
        const rd: any = currentRoom as any;
        if (!rd) return;
        const apiStatusRaw = rd?.workflow?.status;
        const apiStatusBeforeCancelRaw = rd?.workflow?.statusBeforeCancel;
        if (typeof apiStatusRaw === 'string') {
            const uiStatus = apiToUiStatus(apiStatusRaw as any);
            const uiStatusBeforeCancel = apiStatusBeforeCancelRaw
                ? apiToUiStatus(apiStatusBeforeCancelRaw as any)
                : undefined;
            if (uiStatus) {
                const shouldBeStarted = uiStatus !== 'Completed' && uiStatus !== 'Cancelled';
                setHasStarted(shouldBeStarted);
                if (uiStatus !== currentStatus || uiStatusBeforeCancel !== statusBeforeCancel) {
                    setWorkflowState(uiStatus as StatusKey, uiStatusBeforeCancel as StatusKey | undefined, false);
                }
            }
        }
    }, [currentRoom, currentStatus, statusBeforeCancel, setHasStarted]);

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
        localUser,
        roomId,
        selectedFile,
        setError,
        t: (k: string) => String(t(k) ?? k),
        sendMessage,
        sendRoomUpdate,
        goToStatus,
        setHasStarted,
        setShowQuotationModal,
        setSelectedFile,
        canSend,
        disabledReason,
        createInvoice,
        startWorkflow,
        approveQuotationApi,
        submitStartWorkApi,
        approveWorkApi,
        postId: roomPostId ?? null,
        walletId: wallet?.id,
        currentStatus,
    });

    // Wrap approveQuotation with additional balance guard to keep identical behavior
    const approveQuotationWrapped = React.useCallback(async (): Promise<boolean> => {
        if (insufficientForApprove) {
            setError(t('profileChat.insufficientBalanceWarning') || 'Insufficient balance to approve the quotation.');
            return false;
        }
        return await approveQuotationFromHook();
    }, [insufficientForApprove, approveQuotationFromHook, setError, t]);

    /**
     * Handle message submit from ChatInput.
     * Steps:
     *   1) Gate by availability & submitting guard.
     *   2) Build a single source-of-truth content payload (text or file JSON).
     *   3) Delegate to adapter via `sendMessage` (adapter handles emits/broadcast).
     *   4) Clear local file selection.
     */
    const onSubmit = useCallback(
        async (data: MessageForm) => {
            if (!canSend) {
                setError(disabledReason);
                return;
            }
            if (isSubmittingRef.current) {
                return;
            }
            const message = data.message?.trim() || "";
            if (!message && !selectedFile) return;

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

            try {
                const tsIso = new Date().toISOString();
                const preview = selectedFile
                    ? (message || `[File] ${selectedFile.fileName}`)
                    : message;
                try {
                    const detail = {
                        roomId,
                        id: messageId,
                        senderId: Number(localUser.id),
                        content: preview,
                        createdAt: tsIso,
                        status: 'pending' as const,
                    };
                    emitChatNewMessage(detail);
                } catch {
                }
            } catch {
            }

            sendMessage({message: contentToSend, senderId: Number(localUser.id), id: messageId});

            setSelectedFile(null);
            isSubmittingRef.current = false;
        },
        [sendMessage, currentRoom, roomId, selectedFile, localUser.id, emitChatNewMessage]
    );
    const flowActions: FlowActions = createFlowActions({
        t,
        goToStatus,
        setShowQuotationModal,
        setShowReviewModal,
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

    // Load older history when user scrolls above halfway from the bottom.
    const handleOnTopReached = useCallback(() => {
        if (!hasMore || isFetching) return;
        const rootEl = scrollContainerRef.current ?? scrollParentEl;

        // Always fetch when ChatMessages reports top reached; preserve position if we can
        if (!rootEl) {
            fetchHistory().catch(() => {
            });
            return;
        }

        const oldHeight = rootEl.scrollHeight;
        fetchHistory()
            .then(() => {
                const newHeight = rootEl.scrollHeight;
                rootEl.scrollTop += newHeight - oldHeight; // preserve visual position
            })
            .catch(() => {
            });
    }, [hasMore, isFetching, scrollParentEl, fetchHistory]);

    const renderFlowContent = () => (
        <>
            <FreelanceChatFlow
                currentStatus={currentStatus}
                onChangeStatus={handleChangeStatus}
                orientation="vertical"
                compact={false}
                className="space-y-4"
                started={hasStarted}
                onStart={startWorkflowAction}
                canProposeQuote={canProposeQuoteProp}
                canApproveQuotation={canApproveQuotationProp}
                insufficientForApprove={insufficientForApprove}
                isEmployer={isEmployerKnown ? isEmployer : undefined}
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
                statusBeforeCancel={statusBeforeCancel}
            />
        </>
    );

    return (
        <>
            <div className="relative flex-1 min-w-0 flex flex-col md:flex-row h-full">
                <div className="flex-1 min-w-0 flex flex-col h-full w-full">
                    {/* Header: partner presence, typing indicator, and toggle for workflow side panel */}
                    <ChatHeader
                        avatarUrl={partnerAvatar}
                        displayName={partnerName || "User"}
                        roomId={roomId}
                        typingText={isPartnerTyping ? (t("profileChat.typing") || "กำลังพิมพ์...") : undefined}
                        onToggleFlow={() => setIsFlowOpen((v) => !v)}
                        isFlowOpen={isFlowOpen}
                    />
                    <ChatMessages
                        messages={messages}
                        partnerAvatar={ProfileImage.avatar}
                        customScrollParent={scrollParentEl}
                        onTopReached={handleOnTopReached}
                        hasMore={hasMore}
                        isFetching={isFetching}
                        onAtBottomChange={(isAtBottom) => {
                            if (isAtBottom) {
                                try {
                                    markRoomRead(roomId);
                                } catch {
                                }
                                try {
                                    markSeen(roomId);
                                } catch {
                                }
                                // sendLatestRead();
                            }
                        }}
                        partnerId={partnerId}
                    />
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
                > {/* Workflow side panel (desktop & responsive overlay) */}
                    <JobFlowContent
                        setIsFlowOpen={setIsFlowOpen}
                        renderFlowContent={renderFlowContent}
                        setShowJobDetailModal={setShowJobDetailModal}
                        currentRoom={currentRoom?.room ?? ""}
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
            {/* Delivery review modal (employer review of delivered work) */}
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
            {/* Job detail modal (post/room metadata) */}
            {showJobDetailModal && (
                <JobDetailModal
                    showJobDetailModal={showJobDetailModal}
                    setShowJobDetailModal={setShowJobDetailModal}
                    currentRoom={currentRoom.room}
                />
            )}
            {/* Quotation modal (propose/approve quotation for current job) */}
            <QuotationModal
                isOpen={showQuotationModal}
                onClose={() => setShowQuotationModal(false)}
                onSubmit={quotationSubmit}
                postId={roomPostId as number}
                commentId={roomCommentId as number}
                partnerId={partnerId as number}
                projectName={currentRoom?.room?.post?.name || t("profileChat.noJobTitle")}
                amount={currentRoom?.room?.post?.budget}
            />
        </>
    );
};

export default ChatSection;