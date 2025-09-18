"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {v4 as uuidv4} from "uuid";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import LoadingBlur from "@/components/LoadingBlur";
import {ProfileImage} from "@/constants/images";
import type {ChatMessage as WsChatMessage, Post} from "lemmy-js-client";
import ChatHeader from "../ChatHeader";
import ChatInput from "../ChatInput";
import ChatMessages from "../ChatMessages";
import {useWebSocket} from "@/contexts/RealtimeChatContext";
import {useChatRooms} from "@/contexts/ChatRoomsContext";
import { useUnreadStore } from "@/stores/unreadStore";
import FreelanceChatFlow, {FlowActions, StatusKey} from "@/components/FreelanceChatFlow";
import { createFlowActions } from "@/utils/chat/flowActions";
import QuotationModal, {ProposedQuotePayload} from "@/components/QuotationModal";
import {useWorkflowStepper} from "@/hooks/useWorkflowMachine";
import type {CreateInvoiceForm, ApproveQuotationForm} from "lemmy-js-client";
import {useHttpPost} from "@/hooks/useHttpPost";
import {useHttpGet} from "@/hooks/useHttpGet";
import {apiToUiStatus, useStateMachineStore} from "@/stores/stateMachineStore";
import {REQUEST_STATE} from "@/services/HttpService";
import {HttpService} from "@/services/HttpService";
import { resolveWorkflowId } from "@/utils/chat/workflow";

type MessageForm = { message: string };
type UploadedFile = { fileUrl: string; fileType: string; fileName: string };

interface ChatSectionProps {
    roomId: string;
    post?: Post;
    partnerName: string;
    partnerAvatar: string;
    partnerId?: number;
}

const ChatSection: React.FC<ChatSectionProps> = ({ roomId, post, partnerName, partnerAvatar, partnerId }) => {
    const { markRoomRead, setActiveRoomId } = useChatRooms();
    const { state: stepperState, send, canGo, ORDER} = useWorkflowStepper();
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    const [showQuotationModal, setShowQuotationModal] = useState<boolean>(false);
    const [showJobDetailModal, setShowJobDetailModal] = useState<boolean>(false);
    const [hasStarted, setHasStarted] = useState<boolean>(false);
    const [isFlowOpen, setIsFlowOpen] = useState(false);
    const { t } = useTranslation();
    const [workflowIdState, setWorkflowIdState] = useState<number | null>(null);
    type UIChatMessage = WsChatMessage & { isOwner?: boolean };
        const [messages, setMessages] = useState<UIChatMessage[]>([]);
    const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
    const atBottomRef = useRef<boolean>(true);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const incUnread = useUnreadStore((s) => s.inc);
    const markSeen = useUnreadStore((s) => s.markSeen);
    const [, setIsInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // New error state for API failures
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
        if (typeof window === 'undefined') return;
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
            try { ro.disconnect(); } catch {}
        };
    }, []);
    const isSubmittingRef = useRef(false);
    const { localUser, person } = useMyUser();
    const latestIncomingRef = useRef<{ roomId: string; content: string; senderId: number; timestamp: string } | null>(null);

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
        (event: MessageEvent<string | WsChatMessage | WsChatMessage[]>) => {
            let parsed: WsChatMessage | WsChatMessage[];
            try {
                const raw = event.data as unknown;
                parsed = typeof raw === 'string' ? JSON.parse(raw as string) : (raw as any);
            } catch (e) {
                console.error("Failed to parse WebSocket message:", e);
                return;
            }

            // New protocol: provider broadcasts UI-ready ChatMessage objects (single or array)
            let items: WsChatMessage[] = [];
            if (Array.isArray(parsed)) {
                items = parsed as WsChatMessage[];
            } else if (parsed && typeof parsed === 'object') {
                items = [parsed as WsChatMessage];
            }
            if (!items.length) return;

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
                        ? ((!!atBottomRef.current || isHistoryBatch) ? 1 : 0)
                        : (typeof (msg as any).status === 'number' ? (msg as any).status : 0);
                    if (!isHistoryBatch && !atBottomRef.current && isIncoming) {
                        inc++;
                    }
                    if (idx >= 0) {
                        replaced++;
                        copy[idx] = { ...(msg as any), status: newStatus } as UIChatMessage;
                    } else {
                        added++;
                        copy.push({ ...(msg as any), status: newStatus } as UIChatMessage);
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
                    try { setNewSinceCount(prev => prev + inc); } catch {}
                    try { incUnread(roomId, inc); } catch {}
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

    // After commit, propagate last incoming message to ChatRooms context and auto-scroll for receiver
    useEffect(() => {
        if (isFetching) return; // suppress global updates while fetching history
        const d = latestIncomingRef.current;
        if (!d) return;
        try {
            // Auto-scroll to latest when receiving a new message (receiver experience)
            if (d.senderId !== Number(localUser?.id)) {
                scrollToLatestSoon();
            }
            // Only update preview; rely on global event for conditional reordering
            // no-op: last message previews removed
            try {
                const isUnread = d.senderId !== Number(localUser?.id) && !atBottomRef.current;
                window.dispatchEvent(new CustomEvent("chat:new-message", { detail: { ...d, unread: isUnread } }));
            } catch {}
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
        } catch {}
        return () => {
            try { setActiveRoomId(null); } catch {}
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
        const { data: roomData } = useHttpGet("getChatRoom", [roomId as any]);
        const roomPostId = (roomData as any)?.room?.room?.postId ?? (roomData as any)?.room?.post?.id ?? (roomData as any)?.postId ?? (roomData as any)?.room?.postId;
                const roomCommentId = (roomData as any)?.room?.currentComment?.id ?? (roomData as any)?.currentCommentId ?? (roomData as any)?.room?.currentCommentId;
        const isInvalidRoom = useMemo(() => {
            const rd: any = roomData as any;
            if (!rd) return false; // wait for data load
            const errField = String(rd?.error ?? rd?.err ?? rd?.message ?? "").toLowerCase();
            const hasRoom = !!rd?.room && typeof rd.room === "object" && !!rd.room.room && typeof rd.room.room === "object";
            return errField.includes("notfound") || !hasRoom;
        }, [roomData]);
        if (isInvalidRoom) {
            return (
                <div className="flex items-center justify-center w-full h-[calc(100vh-80px)]">
                    <div className="text-center p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{t("profileChat.roomNotFound") || "Room not found"}</h2>
                        <p className="text-gray-600">{t("profileChat.roomNotFoundDesc") || "The chat room you are trying to access does not exist or may have been deleted."}</p>
                    </div>
                </div>
            );
        }
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
        const targetIdx = ORDER.indexOf(target);
        let curIdx = ORDER.indexOf(currentStatus);
        while (curIdx < targetIdx) {
            send({ type: "NEXT" });
            curIdx++;
        }
        while (curIdx > targetIdx) {
            send({ type: "BACK" });
            curIdx--;
        }
    };

    const handleChangeStatus = (key: StatusKey) => {
        if (!canGo(key)) return;
        const curIdx = ORDER.indexOf(currentStatus);
        const toIdx = ORDER.indexOf(key);
        if (toIdx === curIdx) return;
        if (Math.abs(toIdx - curIdx) === 1) {
            return toIdx > curIdx ? send({ type: "NEXT" }) : send({ type: "BACK" });
        }
    };

    const { execute: createInvoice } = useHttpPost("createInvoice");
    const { execute: startWorkflow } = useHttpPost("startWorkflow");
    const { execute: approveQuotationApi } = useHttpPost("approveQuotation");
        const { execute: submitStartWorkApi } = useHttpPost("submitStartWork");

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

            const res = await startWorkflow({ postId, seqNumber, roomId: roomId});
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
                seqNumber: data.workSteps?.[0]?.seq ?? 1,
                amount: data.amount,
                proposal: data.proposal,
                projectName: data.projectName,
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
            const payload = { type: "proposed-quote", quote: data, billingId: createdBillingId } as any;
            
            // Add message to local state
            setMessages((prev) => [
                {
                    id: messageId,
                    roomId: currentRoom?.roomId || roomId,
                    content: JSON.stringify(payload),
                    createdAt: new Date().toISOString(),
                    senderId: Number(localUser?.id) || 0,
                    receiverId: roomId.includes(":") ? Number(roomId.split(":")[1]) || 0 : 0,
                    status: 1,
                    isOwner: true,
                } as WsChatMessage,
                ...prev,
            ]);
            scrollToLatestSoon();

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


    const onSubmit = useCallback(
        (data: MessageForm) => {
            if (isSubmittingRef.current) {
                if (process.env.NODE_ENV !== "production") console.debug("Duplicate submit ignored");
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
                    status: 1,
                    isOwner: true,
                } as WsChatMessage,
                ...prev,
            ]);
            scrollToLatestSoon();
            try {
                const tsIso = new Date().toISOString();
                try {
                    window.dispatchEvent(
                        new CustomEvent("chat:new-message", {
                            detail: { roomId, content: message, senderId: Number(localUser?.id) || 0, timestamp: tsIso },
                        })
                    );
                } catch {
                }
            } catch {
            }

            sendMessage({ message, id: messageId });

            setSelectedFile(null);
            isSubmittingRef.current = false;
        },
        [sendMessage, currentRoom, roomId, selectedFile, localUser?.id]
    );

    // Temporary file upload handler: accept a single file, validate, and store minimal info in state
    const handleFileUpload = useCallback((e: Event) => {
        try {
            const input = e.target as HTMLInputElement | null;
            const file = (input?.files && input.files[0]) || (e as any).dataTransfer?.files?.[0];
            if (!file) return;

            // Basic validation
            const maxSizeMb = 25; // temporary cap
            if (file.size > maxSizeMb * 1024 * 1024) {
                setError(`File too large. Max ${maxSizeMb}MB`);
                return;
            }
            const fileType = file.type || "application/octet-stream";

            // Create a temporary object URL for preview if needed (not persisted)
            const tempUrl = typeof window !== 'undefined' ? URL.createObjectURL(file) : "";

            const uploaded: UploadedFile = {
                fileUrl: tempUrl,
                fileType,
                fileName: file.name || "file",
            };
            setSelectedFile(uploaded);

            // Clear input value to allow re-selecting the same file
            if (input) input.value = "";
        } catch (err) {
            console.error("handleFileUpload failed", err);
            setError("Failed to attach file. Please try again.");
        }
    }, []);

    // Approve quotation implementation
    const approveQuotation = useCallback(async () => {
        try {
            setError(null);

            // Resolve billingId from latest proposed-quote message
            let latestPayload: any | null = null;
            for (const m of messages) {
                const content = (m.content || '').trim();
                if (!content.startsWith('{')) continue;
                try {
                    const parsed = JSON.parse(content);
                    if (parsed && parsed.type === 'proposed-quote') {
                        latestPayload = parsed;
                        break; // messages are newest-first
                    }
                } catch {}
            }

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
                    const res = await HttpService.client.getBillingByComment({ commentId });
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
            const seqNumber = Number(latestPayload?.quote?.workSteps?.[0]?.seq) || 1;

            const form: ApproveQuotationForm = { seqNumber, billingId, walletId: person?.walletId , workflowId } as any;
            const res = await approveQuotationApi(form as any);
            console.log("[CHAT][APPROVE QUOTATION] API response: ", res);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean((res as any)?.data?.success);
            if (!ok) {
                setError(((res as any)?.err?.message) || 'Failed to approve quotation.');
            }
            return !!ok;
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
            let latestPayload: any | null = null;
            for (const m of messages) {
                const content = (m.content || '').trim();
                if (!content.startsWith('{')) continue;
                try {
                    const parsed = JSON.parse(content);
                    if (parsed && parsed.type === 'proposed-quote') {
                        latestPayload = parsed;
                        break;
                    }
                } catch {}
            }
            const seqNumber = Number(latestPayload?.quote?.workSteps?.[0]?.seq) || 1;

            const form: any = {
                seqNumber,
                workflowId,
                workDescription: t('profileChat.startWorkMsg') || 'Freelancer started work.',
            };

            const res = await submitStartWorkApi(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean((res as any)?.data?.success);
            if (!ok) {
                setError(((res as any)?.err?.message) || 'Failed to start work.');
            }
            return !!ok;
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [messages, roomData, workflowIdState, submitStartWorkApi, t]);

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
    });

    const didInitialFetchRef = useRef(false);
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
            // Reset for next connection attempt
            didInitialFetchRef.current = false;
            console.log("[CHAT][INIT] Not connected yet");
        }
    }, [isConnected]);


    // Update workflow automatically based on latest special messages
    useEffect(() => {
        if (!messages.length) return;
        const latest = messages[0];
        const content = latest.content?.trim() || "";
        if (!content.startsWith("{")) return;
        try {
            const parsed = JSON.parse(content);
            if (parsed && parsed.type === "proposed-quote") {
                // When a quote is proposed, stay in QuotationPending
                goToStatus("QuotationPending");
            } else if (parsed && parsed.type === "employer-assigned") {
                // When employer confirms/assigns, move to OrderApproved
                goToStatus("OrderApproved");
            } else if (parsed && parsed.type === "start-work") {
                // When freelancer starts work, move to InProgress
                goToStatus("InProgress");
            }
        } catch {
            /* ignore parse errors */
        }
    }, [messages]);

    const hasProposedQuote = useMemo(() => {
        return messages.some((m) => {
            const content = (m.content || '').trim();
            if (!content.startsWith('{')) return false;
            try {
                const parsed = JSON.parse(content);
                return parsed && parsed.type === 'proposed-quote';
            } catch {
                return false;
            }
        });
    }, [messages]);

    if (!roomId) {
        return <LoadingBlur text="No room selected" />;
    }

    return (
        <>
            <div className="relative flex-1 min-w-0 flex flex-col md:flex-row h-full">
                <div className="flex-1 min-w-0 flex flex-col h-full w-full">
                    <ChatHeader
                        avatarUrl={currentRoom?.partnerAvatar || ProfileImage.avatar}
                        displayName={currentRoom?.partnerDisplayName || "User"}
                        guideText={t("profileChat.guide") || "Usage Guide"}
                        onToggleFlow={() => setIsFlowOpen((v) => !v)}
                        isFlowOpen={isFlowOpen}
                    />
                    <div
                        ref={setScrollRef}
                        data-testid="chat-list"
                        className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 pt-3 sm:pt-4 bg-gray-50 flex"
                        style={{ paddingBottom: `calc(${bottomPad}px + env(safe-area-inset-bottom))` }}
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
                                    .catch(() => {});
                            }}
                            hasMore={hasMoreMessages}
                            isFetching={isFetching}
                            onAtBottomChange={(isAtBottom) => {
                                atBottomRef.current = isAtBottom;
                                setIsAtBottom(isAtBottom);
                                if (isAtBottom) {
                                    setNewSinceCount(0);
                                    setMessages(prev => prev.map(m => (!m.isOwner && m.status === 0 ? { ...m, status: 1 } : m)));
                                    try { markRoomRead(roomId); } catch {}
                                    try { markSeen(roomId); } catch {}
                                }
                            }}
                        />
                    </div>
                    <div ref={inputContainerRef} className="border-t px-3 py-2 sm:px-4 sm:py-3 bg-white">
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                                <ChatInput
                                    onSubmit={onSubmit}
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
                    <div className="p-3 sm:p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-semibold text-primary">
                            {t("profileChat.jobFlow") || "Job Flow"}
                        </h2>
                        <button
                            className="md:hidden p-2 bg-primary text-white rounded-full hover:bg-[#063a68] transition-all duration-200"
                            onClick={() => setIsFlowOpen(false)}
                            aria-label="Close job flow sidebar"
                        >
                            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto border-b border-gray-200">
                        {!roomPostId && (
                            <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs sm:text-sm">
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
                            onProposeQuote={flowActions.onProposeQuote}
                            onApproveQuotation={flowActions.onApproveQuotation}
                            onStartWork={!isEmployer ? flowActions.onStartWork : undefined}
                            onUploadAsset={flowActions.onUploadAsset}
                            onSendMessage={flowActions.onSendMessage}
                            onSubmitDelivery={flowActions.onSubmitDelivery}
                            onRequestRevision={flowActions.onRequestRevision}
                            onReleasePayment={flowActions.onReleasePayment}
                            onCancel={flowActions.onCancel}
                        />
                    </div>
                    <div className="p-3 sm:p-4 md:p-6 bg-white border-t border-gray-200">
                        <div
                            className="flex items-center bg-white rounded-lg shadow-sm p-2 sm:p-3 hover:shadow-md transition-all duration-200 hover:transform hover:scale-105 cursor-pointer"
                            aria-label="Job details"
                            role="button"
                            tabIndex={0}
                            onClick={() => setShowJobDetailModal(true)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setShowJobDetailModal(true);
                                }
                            }}
                        >
                            <div className="flex-1">
                                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-1">
                                    {currentRoom?.job?.title || "No Job Title"}
                                </h3>
                                <p className="text-[0.65rem] sm:text-xs md:text-sm text-gray-600 line-clamp-2">
                                    {currentRoom?.job?.description || "No description available"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                {isFlowOpen && (
                    <div
                        className="md:hidden fixed top-16 sm:top-20 right-0 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] w-[80vw] sm:w-[70vw] max-w-[360px] bg-white border-l shadow-xl z-40 flex flex-col"
                    >
                        <div className="p-3 sm:p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                            <h2 className="text-base sm:text-lg font-semibold text-blue-800">
                                {t("profileChat.jobFlow") || "Job Flow"}
                            </h2>
                            <button
                                className="p-2 bg-primary text-white rounded-full hover:bg-[#063a68] transition-all duration-200"
                                onClick={() => setIsFlowOpen(false)}
                                aria-label="Close job flow drawer"
                            >
                                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 p-3 sm:p-4 overflow-y-auto border-b border-gray-200">
                            {!roomPostId && (
                                <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs sm:text-sm">
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
                                onProposeQuote={flowActions.onProposeQuote}
                                onApproveQuotation={flowActions.onApproveQuotation}
                                onStartWork={!isEmployer ? flowActions.onStartWork : undefined}
                                onUploadAsset={flowActions.onUploadAsset}
                                onSendMessage={flowActions.onSendMessage}
                                onSubmitDelivery={flowActions.onSubmitDelivery}
                                onRequestRevision={flowActions.onRequestRevision}
                                onReleasePayment={flowActions.onReleasePayment}
                                onCancel={flowActions.onCancel}
                            />
                        </div>
                        <div className="p-3 sm:p-4 bg-white">
                            <div
                                className="flex items-center bg-white rounded-lg shadow-sm p-2 sm:p-3 cursor-pointer"
                                aria-label="Job details"
                                role="button"
                                tabIndex={0}
                                onClick={() => setShowJobDetailModal(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setShowJobDetailModal(true);
                                    }
                                }}
                            >
                                <div className="flex-1">
                                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">
                                        {currentRoom?.job?.title || "No Job Title"}
                                    </h3>
                                    <p className="text-[0.65rem] sm:text-xs text-gray-600 line-clamp-2">
                                        {currentRoom?.job?.description || "No description available"}
                                    </p>
                                </div>
                            </div>
                        </div>
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
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-[95%] sm:w-[90%] max-w-md text-center shadow-lg">
                        <h3 className="text-base sm:text-lg font-semibold mb-2">
                            {t("profileChat.reviewDeliveryTitle") || "Review Delivery"}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-4">
                            {t("profileChat.reviewDeliveryDesc") ||
                                "The freelancer submitted work. Do you want to accept or request revision?"}
                        </p>
                        <div className="flex justify-center gap-2 sm:gap-3">
                            <button
                                className="rounded-md bg-green-600 hover:bg-green-700 text-white px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm transition-all duration-200"
                                onClick={() => {
                                    setShowReviewModal(false);
                                    goToStatus("Completed");
                                    sendMessage({
                                        message: t("profileChat.deliveryAccepted") || "Delivery accepted. Proceed to payment.",
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
                                    } catch {
                                    }
                                }}
                            >
                                {t("profileChat.acceptAndRelease") || "Accept & Release Payment"}
                            </button>
                            <button
                                className="rounded-md bg-red-600 hover:bg-red-700 text-white px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm transition-all duration-200"
                                onClick={() => {
                                    setShowReviewModal(false);
                                    goToStatus("InProgress");
                                    sendMessage({
                                        message: t("profileChat.requestRevisionMsg") || "Please revise and resubmit.",
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
                                    } catch {
                                    }
                                }}
                            >
                                {t("profileChat.requestRevision") || "Request Revision"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showJobDetailModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
                    onClick={() => setShowJobDetailModal(false)}
                >
                    <div
                        className="bg-white rounded-lg p-4 sm:p-6 w-[95%] sm:w-[90%] max-w-2xl shadow-lg"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="job-details-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 id="job-details-title" className="text-base sm:text-lg font-semibold text-gray-900">
                                {t("profileChat.jobDetails") || "Job Details"}
                            </h3>
                            <button
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                                aria-label="Close job details"
                                onClick={() => setShowJobDetailModal(false)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <h4 className="text-sm sm:text-base font-medium text-gray-800">
                                    {currentRoom?.job?.title || (t("profileChat.noJobTitle") || "No Job Title")}
                                </h4>
                            </div>
                            <div className="max-h-[60vh] overflow-auto">
                                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
                                    {currentRoom?.job?.description || (t("profileChat.noJobDescription") || "No description available")}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                className="rounded-md bg-primary hover:bg-[#063a68] text-white px-4 py-2 text-sm transition-all duration-200"
                                onClick={() => setShowJobDetailModal(false)}
                            >
                                {t("profileChat.cancel") || "Close"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <QuotationModal
                isOpen={showQuotationModal}
                onClose={() => setShowQuotationModal(false)}
                onSubmit={handleQuotationSubmit}
                postId={roomPostId as number}
                commentId={roomCommentId as number}
                partnerId={partnerId as number}
            />
        </>
    );
};

export default ChatSection;