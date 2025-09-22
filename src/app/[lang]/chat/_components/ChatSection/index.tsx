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
import QuotationModal, {ProposedQuotePayload} from "@/components/Common/Modal/QuotationModal";
import {useWorkflowStepper} from "@/hooks/useWorkflowMachine";
import type {CreateInvoiceForm, ApproveQuotationForm} from "lemmy-js-client";
import {useHttpPost} from "@/hooks/useHttpPost";
import {useHttpGet} from "@/hooks/useHttpGet";
import {apiToUiStatus, useStateMachineStore} from "@/stores/stateMachineStore";
import {REQUEST_STATE} from "@/services/HttpService";
import {HttpService} from "@/services/HttpService";
import {resolveWorkflowId} from "@/utils/chat/workflow";
import {isBrowser} from "@/utils/browser";
import {Trash2} from "lucide-react";
import {getLatestProposedQuotePayload, getLatestProposedQuoteSeq} from "@/utils/chat/message";
import {JobDetailModal} from "@/components/Common/Modal/JobDetailModal";
import {ReviewDeliveryModal} from "@/components/Common/Modal/ReviewDeliveryModal";
import {JobFlowContent} from "@/components/JobFlowContent";

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
    const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
    const atBottomRef = useRef<boolean>(true);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [isPartnerTyping, setIsPartnerTyping] = useState<boolean>(false);
    const partnerTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Clear typing timeout when component unmounts or room changes to avoid leaks
    useEffect(() => {
        return () => {
            if (partnerTypingTimeoutRef.current) {
                try { clearTimeout(partnerTypingTimeoutRef.current); } catch {}
                partnerTypingTimeoutRef.current = null;
            }
        };
    }, [roomId]);
    const markSeen = useUnreadStore((s) => s.markSeen);
    const [, setIsInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // New error state for API failures
    const [newSinceCount, setNewSinceCount] = useState<number>(0);
    const [isDeletingFile, setIsDeletingFile] = useState<boolean>(false);
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
                if (senderId !== Number(localUser?.id)) {
                    const val = !!info.typing;
                    setIsPartnerTyping(val);
                    if (partnerTypingTimeoutRef.current) {
                        try { clearTimeout(partnerTypingTimeoutRef.current); } catch {}
                        partnerTypingTimeoutRef.current = null;
                    }
                    if (val) {
                        partnerTypingTimeoutRef.current = setTimeout(() => setIsPartnerTyping(false), 5000);
                    }
                }
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

    // Load status from API server when available
    const {data: roomData} = useHttpGet("getChatRoom", [roomId as any]);
    const roomPostId = (roomData as any)?.room?.room?.postId ?? (roomData as any)?.room?.post?.id ?? (roomData as any)?.postId ?? (roomData as any)?.room?.postId;
    const roomCommentId = (roomData as any)?.room?.currentComment?.id ?? (roomData as any)?.currentCommentId ?? (roomData as any)?.room?.currentCommentId;

    // Determine if current user is the employer (job poster). Creator id is personId.
    const postCreatorId = (post as any)?.creatorId ?? (roomData as any)?.room?.post?.creatorId ?? (roomData as any)?.post?.creatorId;
    const isEmployer = postCreatorId != null && String(postCreatorId) === String(person?.id);
    const setWorkflowState = useStateMachineStore((s) => s.set);
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


    const goToStatus = (target: StatusKey) => {
        // Set the workflow state directly to ensure immediate UI update without requiring page reload
        try {
            setWorkflowState(target);
            // Ensure the flow panel is considered started on both sides once any status change is applied
            if (!hasStarted) setHasStarted(true);
        } catch {
            // Fallback to step-by-step transitions if direct set fails for any reason
            const targetIdx = ORDER.indexOf(target);
            let curIdx = ORDER.indexOf(currentStatus);
            while (curIdx < targetIdx) {
                send({type: "NEXT"});
                curIdx++;
            }
            while (curIdx > targetIdx) {
                send({type: "BACK"});
                curIdx--;
            }
            // Also mark as started after fallback transitions
            if (!hasStarted) setHasStarted(true);
        }
    };

    const handleChangeStatus = (key: StatusKey) => {
        if (!canGo(key)) return;
        const curIdx = ORDER.indexOf(currentStatus);
        const toIdx = ORDER.indexOf(key);
        if (toIdx === curIdx) return;
        if (Math.abs(toIdx - curIdx) === 1) {
            return toIdx > curIdx ? send({type: "NEXT"}) : send({type: "BACK"});
        }
    };

    const {execute: createInvoice} = useHttpPost("createInvoice");
    const {execute: startWorkflow} = useHttpPost("startWorkflow");
    const {execute: approveQuotationApi} = useHttpPost("approveQuotation");
    const {execute: submitStartWorkApi} = useHttpPost("submitStartWork");
    const {execute: approveWorkApi} = useHttpPost("approveWork");

    const handleStartWorkflow = async () => {
        setError(null);
        try {
            // Require postId to start workflow
            const postId = roomPostId as any;
            if (!postId) {
                setError(t("profileChat.missingPostIdForQuotation") || "This chat is not linked to a post. You cannot create a quotation.");
                return;
            }
            // For now, default to first step
            let seqNumber = 1;

            const res = await startWorkflow({postId, seqNumber, roomId: roomId});
            if (res?.state === REQUEST_STATE.SUCCESS && (res as any).data?.success) {
                setHasStarted(true);
                const wfId = (res as any)?.data?.workflowId;
                if (wfId) setWorkflowIdState(Number(wfId));
                // Ensure UI shows the flow at the initial step
                goToStatus("QuotationPending");
            } else {
                setError(
                    t("profileChat.startWorkflowFailed") ||
                    ((res as any)?.err?.message || "Failed to start workflow. Please try again.")
                );
            }
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Unknown error";
            setError(t("profileChat.startWorkflowFailed") || `Failed to start workflow: ${msg}`);
        }
    };

    const handleQuotationSubmit = async (data: ProposedQuotePayload) => {
        if (!canSend) {
            setError(disabledReason);
            setShowQuotationModal(false);
            return;
        }
        // Prevent duplicate quotations: disallow if a quotation has already been proposed
        if (hasProposedQuote) {
            setError(t('profileChat.quotationAlreadySent') || 'You have already sent a quotation for this chat.');
            setShowQuotationModal(false);
            return;
        }
        setError(null); // Reset error state before attempting submission
        try {
            // Create invoice via API
            const form: CreateInvoiceForm = {
                employerId: data.partnerId,
                postId: data.postId,
                commentId: data.commentId,
                seqNumber: 1, // TODO: need to change logic here, this is just temporary
                amount: data.amount,
                proposal: data.proposal,
                projectName: data.projectName,
                status: "QuotePendingReview",
                projectDetails: data.projectDetails,
                workingDays: data.workingDays,
                deliverables: data.deliverables,
                note: data.note ?? undefined,
                startingDay: data.startingDay,
                deliveryDay: data.deliveryDay,
            };

            // Wait for invoice creation to succeed
            const res = await createInvoice(form as any);
            if (res?.state !== REQUEST_STATE.SUCCESS) {
                setError(t("profileChat.quotationError") || "Failed to create invoice. Please try again.");
                return;
            }


            const createdBillingId = (res as any)?.data?.billingId;

            // Proceed with chat message and state updates only if invoice creation succeeds
            const messageId = uuidv4();
            const readable =
                t("profileChat.proposeQuoteMsg") ||
                `Proposed quotation: ${data.projectName} - $${data.amount.toFixed(2)}`;
            const payload = {type: "proposed-quote", quote: data, billingId: createdBillingId} as any;

            // Add message to local state
            addOwnMessage(JSON.stringify(payload), messageId);

            // Send message via WebSocket
            sendMessage({
                message: JSON.stringify(payload),
                id: messageId,
            });

            // Notify room activity (preview removed)
            const tsIso = new Date().toISOString();
            try {
                window.dispatchEvent(
                    new CustomEvent("chat:new-message", {
                        detail: {
                            roomId,
                            content: readable,
                            senderId: Number(localUser?.id) || 0,
                            timestamp: tsIso,
                        },
                    })
                );
            } catch {
                console.warn("Failed to dispatch chat:new-message event");
            }

            // Upon sending a quotation, keep status at QuotationPending
            goToStatus("QuotationPending");

            // Close modal
            setShowQuotationModal(false);
        } catch (err) {
            console.error("Failed to send quotation:", err);
            setError(t("profileChat.quotationError") || "Failed to send quotation. Please try again.");
        }
    };

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

    // File upload handler: uploads to API and stores returned URL/name in state
    const handleFileUpload = useCallback(async (e: Event) => {
        try {
            const input = e.target as HTMLInputElement | null;
            const file = (input?.files && input.files[0]) || (e as any).dataTransfer?.files?.[0];
            if (!file) return;

            // Basic validation
            const maxSizeMb = 25; // server-side limit may differ
            if (file.size > maxSizeMb * 1024 * 1024) {
                setError(`File too large. Max ${maxSizeMb}MB`);
                return;
            }
            const fileType = file.type || "application/octet-stream";

            // Call chat file upload API
            setError(null);
            const res = await HttpService.client.uploadFile({image: file} as any);
            if (res.state !== REQUEST_STATE.SUCCESS) {
                const msg = (res as any)?.err?.message || "Failed to upload file.";
                setError(msg);
                return;
            }
            const data: any = (res as any).data;
            const uploaded: UploadedFile = {
                fileUrl: String(data?.url || ""),
                fileType,
                fileName: String(data?.filename || file.name || "file"),
            };
            if (!uploaded.fileUrl) {
                setError("Upload succeeded but no file URL returned.");
                return;
            }
            setSelectedFile(uploaded);

            // Clear input value to allow re-selecting the same file
            if (input) input.value = "";
        } catch (err) {
            setError("Failed to upload file. Please try again.");
        }
    }, []);

    // Remove selected file: call API to delete then clear local state
    const handleRemoveSelectedFile = useCallback(async () => {
        if (!selectedFile || isDeletingFile) return;
        try {
            setIsDeletingFile(true);
            setError(null);
            const res = await HttpService.client.deleteFile(selectedFile.fileName as any);
            if (res.state !== REQUEST_STATE.SUCCESS) {
                const msg = (res as any)?.err?.message || t("profileChat.deleteFileError") || "Failed to delete file.";
                setError(msg);
                return;
            }
            setSelectedFile(null);
        } catch (err) {
            setError(t("profileChat.deleteFileError") || "Failed to delete file.");
        } finally {
            setIsDeletingFile(false);
        }
    }, [selectedFile, isDeletingFile, t]);

    // Approve quotation implementation
    const approveQuotation = useCallback(async () => {
        try {
            setError(null);

            // Guard: prevent approving if insufficient balance
            if (insufficientForApprove) {
                setError(t('profileChat.insufficientBalanceWarning') || 'Insufficient balance to approve the quotation.');
                return false;
            }

            // Resolve billingId from latest proposed-quote message
            const latestPayload: any | null = getLatestProposedQuotePayload(messages as any);

            // Try billingId from payload first
            let billingId = Number(latestPayload?.billingId);
            // If missing / invalid, fetch billing by comment id using new API
            if (!billingId || Number.isNaN(billingId)) {
                const commentIdFromPayload = Number(latestPayload?.quote?.commentId);
                const commentId = !Number.isNaN(commentIdFromPayload) && commentIdFromPayload
                    ? commentIdFromPayload
                    : Number((roomData as any)?.room?.currentComment?.id ?? (roomData as any)?.currentCommentId ?? undefined);

                if (!commentId || Number.isNaN(commentId)) {
                    setError(t('profileChat.quotationError') || 'Missing billing information for approval.');
                    return false;
                }

                try {
                    const res = await HttpService.client.getBillingByComment({commentId});
                    if (res?.state === REQUEST_STATE.SUCCESS && (res as any)?.data) {
                        const billing = (res as any).data as any;
                        billingId = Number(billing?.id);
                    }
                } catch (err) {
                    // fallthrough to error below
                }
            }

            if (!billingId || Number.isNaN(billingId)) {
                setError(t('profileChat.quotationError') || 'Missing billing information for approval.');
                return false;
            }

            const workflowId = resolveWorkflowId(roomData as any, workflowIdState as any);

            if (!workflowId) {
                setError(t('profileChat.startWorkflowFailed') || 'Missing workflow. Start workflow before approval.');
                return false;
            }
            // Seq number from proposed quote if available
            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);

            const form: ApproveQuotationForm = {seqNumber, billingId, walletId: person?.walletId, workflowId} as any;
            const res = await approveQuotationApi(form as any);
            if (res.state === REQUEST_STATE.FAILED) {
                if (res?.err?.name === "insufficientBalanceForTransfer") {
                    setError(res?.err?.message);
                }
            }
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean((res as any)?.data?.success);
            if (!ok) {
                setError(((res as any)?.err?.message) || 'Failed to approve quotation.');
            } else {
                // Immediately update local UI and notify partner
                try {
                    const messageId = uuidv4();
                    addOwnMessage(JSON.stringify({type: 'employer-assigned'}), messageId);
                    sendMessage({message: JSON.stringify({type: 'employer-assigned'}), id: messageId});
                    const tsIso = new Date().toISOString();
                    const readable = t('profileChat.approveQuotation') || 'Approve quotation';
                    window.dispatchEvent(new CustomEvent('chat:new-message', {
                        detail: {
                            roomId,
                            content: readable,
                            senderId: Number(localUser?.id) || 0,
                            timestamp: tsIso
                        }
                    }));
                } catch {
                }
                goToStatus('OrderApproved');
            }
            return ok;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [messages, roomData, workflowIdState, person, approveQuotationApi, t]);

    const handleStartWorkAction = useCallback(async (): Promise<boolean> => {
        try {
            setError(null);

            const workflowId = resolveWorkflowId(roomData as any, workflowIdState as any);

            if (!workflowId) {
                setError(t('profileChat.startWorkflowFailed') || 'Missing workflow. Start workflow before starting work.');
                return false;
            }

            // resolve seq from latest proposed-quote message if exists
            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);

            const form: any = {
                seqNumber,
                workflowId,
                workDescription: t('profileChat.startWorkMsg') || 'Freelancer started work.',
            };

            const res = await submitStartWorkApi(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean((res as any)?.data?.success);
            if (!ok) {
                setError(((res as any)?.err?.message) || 'Failed to start work.');
            } else {
                // Immediately notify and update status for both sides
                try {
                    const messageId = uuidv4();
                    addOwnMessage(JSON.stringify({type: 'start-work'}), messageId);
                    sendMessage({message: JSON.stringify({type: 'start-work'}), id: messageId});
                    const tsIso = new Date().toISOString();
                    const readable = t('profileChat.startWork') || 'Start work';
                    window.dispatchEvent(new CustomEvent('chat:new-message', {
                        detail: {
                            roomId,
                            content: readable,
                            senderId: Number(localUser?.id) || 0,
                            timestamp: tsIso
                        }
                    }));
                } catch {
                }
                goToStatus('InProgress');
            }
            return ok;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [messages, roomData, workflowIdState, submitStartWorkApi, t]);

    const submitDeliveryAction = useCallback(async (): Promise<boolean> => {
        try {
            setError(null);
            if (!canSend) {
                setError(disabledReason);
                return false;
            }
            if (!selectedFile || !selectedFile.fileUrl) {
                setError(t('profileChat.attachFileFirst') || 'Please attach a file before submitting delivery.');
                return false;
            }
            const workflowId = resolveWorkflowId(roomData as any, workflowIdState as any);
            if (!workflowId) {
                setError(t('profileChat.startWorkflowFailed') || 'Missing workflow. Start workflow before submitting delivery.');
                return false;
            }

            // Resolve seq number from latest proposed-quote if available
            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);

            const form: any = {
                seqNumber,
                workflowId,
                workDescription: t('profileChat.submitDeliveryMsg') || 'Freelancer submitted a delivery.',
                deliverableUrl: selectedFile.fileUrl,
            };

            const res = await HttpService.client.submitWork(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean((res as any)?.data?.success);
            if (!ok) {
                setError(((res as any)?.err?.message) || 'Failed to submit delivery.');
                return false;
            }

            // Send a structured chat message to notify and show the file
            const messageId = uuidv4();
            const payload = {
                type: 'submit-delivery',
                url: selectedFile.fileUrl,
                name: selectedFile.fileName,
                mime: selectedFile.fileType,
            } as any;

            addOwnMessage(JSON.stringify(payload), messageId);

            sendMessage({message: JSON.stringify(payload), id: messageId});
            try {
                const preview = `[Delivery] ${selectedFile.fileName}`;
                const tsIso = new Date().toISOString();
                window.dispatchEvent(
                    new CustomEvent("chat:new-message", {
                        detail: {roomId, content: preview, senderId: Number(localUser?.id) || 0, timestamp: tsIso},
                    })
                );
            } catch {
            }

            // Clear selected file after successful submit
            setSelectedFile(null);
            // Immediately reflect status change locally
            goToStatus('PendingEmployerReview');
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [messages, roomData, workflowIdState, selectedFile, localUser?.id, canSend, disabledReason, t]);

    const requestRevisionAction = useCallback(async (): Promise<boolean> => {
        try {
            setError(null);
            if (!canSend) {
                setError(disabledReason || t('profileChat.cannotPerformAction') || 'You cannot perform this action right now.');
                return false;
            }
            const workflowId = resolveWorkflowId(roomData as any, workflowIdState as any);
            if (!workflowId) {
                setError(t('profileChat.startWorkflowFailed') || 'Missing workflow. Start workflow before requesting revision.');
                return false;
            }
            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const reason = t('profileChat.requestRevisionMsg') || 'Please revise and resubmit.';
            const form: any = {seqNumber, workflowId, reason};
            const res = await HttpService.client.requestRevision(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean((res as any)?.data?.success);
            if (!ok) {
                setError(((res as any)?.err?.message) || 'Failed to request revision.');
                return false;
            }
            // Notify chat and move status
            try {
                const messageId = uuidv4();
                const payload = {type: 'request-revision', reason} as any;
                addOwnMessage(JSON.stringify(payload), messageId);
                sendMessage({message: JSON.stringify(payload), id: messageId});
                const tsIso = new Date().toISOString();
                window.dispatchEvent(new CustomEvent('chat:new-message', {
                    detail: {
                        roomId,
                        content: reason,
                        senderId: Number(localUser?.id) || 0,
                        timestamp: tsIso
                    }
                }));
            } catch {
            }
            goToStatus('InProgress');
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [canSend, disabledReason, t, roomData, workflowIdState, messages, roomId, localUser?.id]);

    const approveWorkAction = useCallback(async (): Promise<boolean> => {
        try {
            setError(null);
            if (!canSend) {
                setError(disabledReason || t('profileChat.cannotPerformAction') || 'You cannot perform this action right now.');
                return false;
            }
            const workflowId = resolveWorkflowId(roomData as any, workflowIdState as any);
            if (!workflowId) {
                setError(t('profileChat.startWorkflowFailed') || 'Missing workflow. Start workflow before approval.');
                return false;
            }
            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            // Resolve the latest delivery comment id from room data
            const commentId = Number((roomData as any)?.room?.currentComment?.id ?? (roomData as any)?.currentCommentId ?? undefined);
            if (!commentId || Number.isNaN(commentId)) {
                setError('Missing delivery reference for approval.');
                return false;
            }
            const form: any = {seqNumber, workflowId, commentId};
            const res = await approveWorkApi(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean((res as any)?.data?.success);
            if (!ok) {
                setError(((res as any)?.err?.message) || 'Failed to approve work.');
                return false;
            }
            // Notify chat that delivery accepted
            try {
                const messageId = uuidv4();
                addOwnMessage(JSON.stringify({type: 'delivery-accepted'}), messageId);
                sendMessage({message: JSON.stringify({type: 'delivery-accepted'}), id: messageId});
                const tsIso = new Date().toISOString();
                const content = t('profileChat.deliveryAccepted') || 'Delivery accepted. Proceed to payment.';
                window.dispatchEvent(new CustomEvent('chat:new-message', {
                    detail: {
                        roomId,
                        content,
                        senderId: Number(localUser?.id) || 0,
                        timestamp: tsIso
                    }
                }));
            } catch {
            }
            // Immediately reflect status as completed
            goToStatus('Completed');
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [canSend, disabledReason, t, roomData, workflowIdState, messages, roomId, localUser?.id, approveWorkApi]);

    const cancelJobAction = useCallback(async () => {
        try {
            // Block if cannot send or disabled
            if (!canSend) {
                setError(disabledReason || t('profileChat.cannotPerformAction') || 'You cannot perform this action right now.');
                return false;
            }
            const workflowId = resolveWorkflowId(roomData as any, workflowIdState as any);
            if (!workflowId) {
                setError(t('profileChat.startWorkflowFailed') || 'Missing workflow. Start workflow before cancelling.');
                return false;
            }
            // Resolve seq number similar to other actions
            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const form: any = {seqNumber, workflowId};
            const res = await HttpService.client.cancelJob(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean((res as any)?.data?.success);
            if (!ok) {
                setError(((res as any)?.err?.message) || 'Failed to cancel job.');
                return false;
            }
            // Optionally notify chat
            try {
                const messageId = uuidv4();
                const readable = t('profileChat.cancelledJobMsg') || 'The job has been cancelled.';
                addOwnMessage(readable, messageId);
                sendMessage({message: JSON.stringify({type: 'cancel-job'}), id: messageId});
                const tsIso = new Date().toISOString();
                window.dispatchEvent(new CustomEvent('chat:new-message', {
                    detail: {
                        roomId,
                        content: readable,
                        senderId: Number(localUser?.id) || 0,
                        timestamp: tsIso
                    }
                }));
            } catch {
            }
            goToStatus('Cancelled');
            return true;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [canSend, disabledReason, t, roomData, workflowIdState, messages, roomId, localUser?.id]);

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
        approveQuotation,
        startWork: async () => await handleStartWorkAction(),
        getPostId: () => roomPostId,
        submitDelivery: async () => await submitDeliveryAction(),
        hasSelectedFile: () => !!selectedFile,
        requestRevision: async () => await requestRevisionAction(),
        approveWork: async () => await approveWorkAction(),
    });

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
        if (!messages.length) return;
        const typesToStatus: Record<string, StatusKey> = {
            "proposed-quote": "QuotationPending",
            "employer-assigned": "OrderApproved",
            "start-work": "InProgress",
            "submit-delivery": "PendingEmployerReview",
            "cancel-job": "Cancelled",
            "delivery-accepted": "Completed",
            "request-revision": "InProgress",
        } as const;

        const N = 20; // scan up to the latest 20 messages
        const len = Math.min(messages.length, N);
        for (let i = 0; i < len; i++) {
            const m = messages[i];
            const content = (m.content || '').trim();
            if (!content.startsWith('{')) continue;
            try {
                const parsed = JSON.parse(content);
                const type = parsed?.type as string | undefined;
                const target = type ? (typesToStatus as any)[type] as StatusKey | undefined : undefined;
                if (target) {
                    goToStatus(target);
                    break;
                }
            } catch {
                // ignore parse errors and continue scanning
            }
        }
    }, [messages]);

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

    const renderFlowContent = () => (
        <>
            {!roomPostId && (
                <div
                    className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs sm:text-sm">
                    {t("profileChat.missingPostIdForQuotation") || "This chat is not linked to a post. You cannot create a quotation."}
                </div>
            )}

            <FreelanceChatFlow
                currentStatus={currentStatus}
                onChangeStatus={handleChangeStatus}
                orientation="vertical"
                compact={false}
                className="space-y-4"
                started={hasStarted || currentStatus !== 'QuotationPending'}
                onStart={handleStartWorkflow}
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
                    void cancelJobAction();
                }}
            />
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
                    requestRevisionAction={requestRevisionAction}
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
                onSubmit={handleQuotationSubmit}
                postId={roomPostId as number}
                commentId={roomCommentId as number}
                partnerId={partnerId as number}
                projectName={currentRoom?.job?.title || "No Job Title"}
            />
        </>
    );
};

export default ChatSection;