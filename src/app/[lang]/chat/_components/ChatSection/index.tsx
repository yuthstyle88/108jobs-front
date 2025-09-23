"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {v4 as uuidv4} from "uuid";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import LoadingBlur from "@/components/Common/Loading/LoadingBlur";
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
import {useHttpGet} from "@/hooks/useHttpGet";
import {apiToUiStatus, useStateMachineStore} from "@/stores/stateMachineStore";
import {isBrowser} from "@/utils/browser";
import {Trash2} from "lucide-react";
import {getLatestProposedQuotePayload} from "@/utils/chat/message";
import {JobDetailModal} from "@/components/Common/Modal/JobDetailModal";
import {ReviewDeliveryModal} from "@/components/Common/Modal/ReviewDeliveryModal";
import {JobFlowContent} from "@/components/JobFlowContent";
import { TYPES_TO_STATUS } from '@/utils/chat/workflowTypes';
import { useWorkflowStatus } from '@/hooks/chat/useWorkflowStatus';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';
import { useFileUpload } from '@/hooks/chat/useFileUpload';
import { useWorkflowActions } from '@/hooks/chat/useWorkflowActions';

type MessageForm = { message: string };
type UploadedFile = { fileUrl: string; fileType: string; fileName: string };

interface ChatSectionProps {
    roomId: string;
    post?: Post;
    partnerName: string;
    partnerAvatar: string;
    partnerId?: number;
    partnerAvailable?: boolean;
    commentId: number;
}

const ChatSection: React.FC<ChatSectionProps> = ({
                                                     roomId,
                                                     post,
                                                     partnerName,
                                                     partnerAvatar,
                                                     partnerId,
                                                     partnerAvailable,
                                                     commentId
                                                 }) => {
    const {markRoomRead, setActiveRoomId} = useChatRooms();
    const {state: stepperState, send, canGo, ORDER} = useWorkflowStepper();
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    const [showQuotationModal, setShowQuotationModal] = useState<boolean>(false);
    const [showJobDetailModal, setShowJobDetailModal] = useState<boolean>(false);
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [isFlowOpen, setIsFlowOpen] = useState(false);
    const {t} = useTranslation();
    const [workflowIdState, setWorkflowIdState] = useState<number | null>(null);
    type UIChatMessage = WsChatMessage & { isOwner?: boolean };
    const [messages, setMessages] = useState<UIChatMessage[]>([]);
    // File upload handled via hook
    const atBottomRef = useRef<boolean>(true);
    const [isAtBottom, setIsAtBottom] = useState(true);
    // Typing indicator logic moved into hook
    const { isPartnerTyping, onRemoteTyping } = useTypingIndicator({ roomId });
    const markSeen = useUnreadStore((s) => s.markSeen);
    const [, setIsInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // New error state for API failures
    const { selectedFile, setSelectedFile, isDeletingFile, handleFileUpload, handleRemoveSelectedFile } = useFileUpload({ setError, t: (k: string) => t(k) });
    const [newSinceCount, setNewSinceCount] = useState<number>(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [scrollParentEl, setScrollParentEl] = useState<HTMLElement | null>(null);
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
    const isSubmittingRef = useRef(false);
    const {localUser, person, wallet} = useMyUser();
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
    // Workflow status helpers moved into useWorkflowStatus hook

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
        (event: MessageEvent<string | WsChatMessage | WsChatMessage[]>) => {
            try {
                console.debug('[CHAT][RT] handler invoked for room', roomId);
            } catch {
            }
            let parsed: WsChatMessage | WsChatMessage[];
            try {
                const raw = event.data as unknown;
                parsed = typeof raw === 'string' ? JSON.parse(raw as string) : (raw as any);
            } catch (e) {
                console.error("Failed to parse WebSocket message:", e);
                return;
            }

            // Typing payloads from provider
            if (parsed && typeof parsed === 'object' && (parsed as any).type === 'typing') {
                const info = parsed as any;
                const senderId = Number(info.senderId) || 0;
                const val = !!info.typing;
                onRemoteTyping(senderId, Number(localUser?.id) || 0, val);
                return;
            }

            // DEBUG: verify realtime delivery into this component
            try {
                (globalThis as any).__chatRTLast = parsed;
                const arrLen = Array.isArray(parsed) ? parsed.length : 1;
                console.debug('[CHAT][RT] delivered to ChatSection', {
                    roomId,
                    arrLen,
                    sample: Array.isArray(parsed) ? parsed[0] : parsed
                });
            } catch {
            }

            // New protocol: provider broadcasts UI-ready ChatMessage objects (single or array)
            let items: WsChatMessage[] = [];
            if (Array.isArray(parsed)) {
                items = parsed as WsChatMessage[];
            } else if (parsed && typeof parsed === 'object') {
                items = [parsed as WsChatMessage];
            }
            if (!items.length) return;

            // Normalize: ensure id is string, createdAt present, senderId numeric
            items = items.map((m: any) => ({
                ...m,
                id: String(m.id ?? m.uuid ?? uuidv4()),
                createdAt: m.createdAt ?? m.created_at ?? new Date().toISOString(),
                senderId: typeof m.senderId === 'number' ? m.senderId : Number(m.sender_id ?? m.senderId ?? 0),
            }));
            try {
                console.debug('[CHAT][RT] items normalized:', {count: items.length, sample: items[0]});
            } catch {
            }

            // Realtime: update workflow status immediately based on structured message type
            try {
                if (!isFetching && items.length > 0) {
                    tryUpdateStatusFromItems(items);
                }
            } catch { /* ignore */ }

            setMessages((prev) => {
                const copy = [...prev];
                let added = 0;
                let replaced = 0;
                let skippedDup = 0;
                let latestTs = 0;
                let latestContent: string | null = null;
                let latestSenderId: number | null = null;
                // Consider current batch as history if fetching or if this is the very first inflow (prev empty)
                const isHistoryBatch = isFetching || prev.length === 0;
                let inc = 0;
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

                    const idx = copy.findIndex((m) => m.id === msg.id);
                    const isIncoming = !(msg as any).isOwner;
                    const newStatus = isIncoming
                        ? ((atBottomRef.current || isHistoryBatch) ? 1 : 0)
                        : (typeof (msg as any).status === 'number' ? (msg as any).status : 0);
                    if (!isHistoryBatch && !atBottomRef.current && isIncoming) {
                        inc++;
                    }
                    if (idx >= 0) {
                        replaced++;
                        copy[idx] = {...(msg as any), status: newStatus} as UIChatMessage;
                    } else {
                        added++;
                        copy.push({...(msg as any), status: newStatus} as UIChatMessage);
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

                // Defer room preview updates only for live, single-message events (skip during history)
                if (!isHistoryBatch && inc > 0) {
                    try {
                        setNewSinceCount(prev => prev + inc);
                    } catch {
                    }
                    // Unread store is updated globally via ChatRoomsContext/ChatBadge listening to chat:new-message events.
                    // Avoid direct increments here to prevent double counting.
                }
                if (!isHistoryBatch && items.length === 1 && latestTs > 0 && latestContent != null && latestSenderId != null) {
                    const tsIso = new Date(latestTs).toISOString();
                    latestIncomingRef.current = {
                        roomId,
                        content: latestContent,
                        senderId: latestSenderId,
                        timestamp: tsIso,
                    };
                }
                return sorted;
            });
        }
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

    const currentRoom = {
        roomId,
        partnerAvatar: partnerAvatar,
        partnerDisplayName: partnerName,
        job: {
            id: post?.id,
            title: post?.name,
            description: post?.body,
        },
        messages: [],
    };

    const currentStatus: StatusKey = stepperState.name as StatusKey;

    // Workflow status helpers
    const setWorkflowState = useStateMachineStore((s) => s.set);
    const { lastRealtimeStatusAtRef, extractStatusFromContent, tryUpdateStatusFromItems, scanMessagesForStatus, goToStatus, handleChangeStatus } = useWorkflowStatus({
        currentStatus,
        setWorkflowState,
        hasStarted,
        setHasStarted,
        ORDER,
        send,
        canGo,
    });

    // Load status from API server when available
    const {data: roomData} = useHttpGet("getChatRoom", [roomId as any]);
    const roomPostId = (roomData as any)?.room?.room?.postId ?? (roomData as any)?.room?.post?.id ?? (roomData as any)?.postId ?? (roomData as any)?.room?.postId;
    const roomCommentId = (roomData as any)?.room?.currentComment?.id ?? (roomData as any)?.currentCommentId ?? (roomData as any)?.room?.currentCommentId;

    // Determine if current user is the employer (job poster). Creator id is personId.
    const postCreatorId = (post as any)?.creatorId ?? (roomData as any)?.room?.post?.creatorId ?? (roomData as any)?.post?.creatorId;
    const isEmployer = postCreatorId != null && person?.id != null ? String(postCreatorId) === String(person?.id) : undefined;
    useEffect(() => {
        const rd: any = roomData as any;
        if (!rd) return;
        const apiStatusRaw = rd?.room?.workflow?.status ?? rd?.workflow?.status ?? rd?.room?.status ?? rd?.status ?? rd?.room?.workflowStatus ?? rd?.workflowStatus;
        // If server reports a workflow status, mark as started and sync UI state
        if (typeof apiStatusRaw === 'string') {
            if (!hasStarted) setHasStarted(true);
            const uiStatus = apiToUiStatus(apiStatusRaw as any);
            if (uiStatus && uiStatus !== currentStatus) {
                setWorkflowState(uiStatus as StatusKey);
            }
        }
    }, [roomData, setWorkflowState, currentStatus, hasStarted]);



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
                receiverId: roomId.includes(":") ? Number(roomId.split(":")[1]) || 0 : 0,
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
        roomData,
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

    // File upload logic moved into useFileUpload hook
    
    const didInitialFetchRef = useRef(false);
    // Fetch initial history as soon as component mounts (or roomId changes),
    // without waiting for a websocket connection. This fixes empty chat on page refresh
    // when WS is slow or blocked; the WS effect below will no-op if we've already fetched.
    useEffect(() => {
        if (!didInitialFetchRef.current) {
            didInitialFetchRef.current = true;
            console.log("[CHAT][INIT] Initial fetchHistory() on mount/room change");
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
            console.log("[CHAT][INIT] Connected -> initial fetchHistory() (once per connection)");
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


    // Update workflow automatically based on the most recent structured workflow message
    // Scan a small window of newest messages to be robust against interleaved plain texts
    useEffect(() => {
        // Fallback scanner: run only when realtime handler may not fire
        // i.e., during history fetching or when socket is disconnected.
        if (!messages.length) return;
        if (!isFetching && isConnected) return;
        // If realtime just updated status, skip fallback to prevent duplicate transitions
        if (Date.now() - lastRealtimeStatusAtRef.current < 1000) return;

        const target = scanMessagesForStatus(messages, 20);
        if (target) {
            goToStatus(target);
        }
    }, [messages, isFetching, isConnected]);

    const hasProposedQuote = useMemo(() => {
        return Boolean(getLatestProposedQuotePayload(messages as any));
    }, [messages]);

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
                    started={hasStarted || currentStatus !== 'QuotationPending'}
                    onStart={startWorkflowAction}
                    canStartWorkflow={isEmployer && Boolean(roomPostId)}
                    showStartButton={isEmployer}
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
                />
            )}
        </>
    );

    if (!roomId) {
        return <LoadingBlur text=""/>;
    }

    return (
        <>
            <div className="relative flex-1 min-w-0 flex flex-col md:flex-row h-full">
                <div className="flex-1 min-w-0 flex flex-col h-full w-full">
                    <ChatHeader
                        avatarUrl={currentRoom?.partnerAvatar || ProfileImage.avatar}
                        displayName={currentRoom?.partnerDisplayName || "User"}
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
                                            <Trash2/>
                                        </button>
                                    </div>
                                )}
                                <ChatInput
                                    onSubmit={onSubmit}
                                    disabled={!canSend}
                                    disabledHint=""
                                    onFileUpload={(ev: any) => handleFileUpload(ev as any)}
                                    onTyping={(v) => { try { sendTyping?.(v); } catch {} }}
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
                        currentRoom={currentRoom}
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
                            currentRoom={currentRoom}
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
                    currentRoom={currentRoom}
                />
            )}
            <QuotationModal
                isOpen={showQuotationModal}
                onClose={() => setShowQuotationModal(false)}
                onSubmit={quotationSubmit}
                postId={roomPostId as number}
                commentId={roomCommentId as number}
                partnerId={partnerId as number}
                projectName={currentRoom?.job?.title || "No Job Title"}
            />
        </>
    );
};

export default ChatSection;