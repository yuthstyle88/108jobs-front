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
import QuotationModal, { ProposedQuotePayload } from "@/components/QuotationModal";
import { usePrivateImagePost } from "@/hooks/api-hooks";
import { useWorkflowStepper } from "@/hooks/useWorkflowMachine";
import type { CreateInvoiceForm } from "lemmy-js-client";
import { useHttpPost } from "@/hooks/useHttpPost";
import { REQUEST_STATE } from "@/services/HttpService";

type MessageForm = { message: string };
type UploadedFile = { fileUrl: string; fileType: string; fileName: string };

interface ChatSectionProps {
    roomId: string;
    partnerName: string;
    partnerAvatar: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({ roomId, partnerName, partnerAvatar }) => {
    const { updateRoomLastMessage } = useChatRooms();
    const { state: stepperState, idx: activeStep, send, canGo } = useWorkflowStepper();
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    const [showQuotationModal, setShowQuotationModal] = useState<boolean>(false);
    const [isFlowOpen, setIsFlowOpen] = useState(false);
    const { t } = useTranslation();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // New error state for API failures
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

                if (!isHistoryBatch && latestTs > 0 && latestContent != null && latestSenderId != null) {
                    const tsIso = new Date(latestTs).toISOString();
                    try {
                        updateRoomLastMessage(roomId, latestContent, latestSenderId, tsIso);
                    } catch {
                    }
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
                    } catch {
                    }
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
        partnerAvatar: partnerAvatar,
        partnerDisplayName: partnerName,
        job: {
            id: roomId,
            title: "Sample Job",
            coverImage: CategoriesImage.seoJob,
            description: "Sample job description",
        },
        messages: [],
    };

    const currentStatus: StatusKey = stepperState.name as StatusKey;

    const ORDER: StatusKey[] = ["new", "queue", "assign", "accept", "chat", "review", "pay"];

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

    const handleQuotationSubmit = async (data: ProposedQuotePayload) => {
        setError(null); // Reset error state before attempting submission
        try {
            // Create invoice via API
            const form: CreateInvoiceForm = {
                employerId: data.employerId,
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

            // Proceed with chat message and state updates only if invoice creation succeeds
            const messageId = uuidv4();
            const readable =
                t("profileChat.proposeQuoteMsg") ||
                `Proposed quotation: ${data.projectName} - $${data.amount.toFixed(2)}`;
            const payload = { type: "proposed-quote", quote: data };

            // Add message to local state
            setMessages((prev) => [
                {
                    id: messageId,
                    roomId: currentRoom?.roomId || roomId,
                    content: readable,
                    createdAt: new Date().toISOString(),
                    senderId: Number(localUser?.id) || 0,
                    receiverId: roomId.includes(":") ? Number(roomId.split(":")[1]) || 0 : 0,
                    status: 0,
                    isOwner: true,
                } as ChatMessage,
                ...prev,
            ]);

            // Send message via WebSocket
            sendMessage({
                message: JSON.stringify(payload),
                id: messageId,
            });

            // Update room last message
            const tsIso = new Date().toISOString();
            try {
                updateRoomLastMessage(roomId, readable, Number(localUser?.id) || 0, tsIso);
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

            // Upon sending a quotation, freelancer should remain at step 2 (queue)
            goToStatus("queue");

            // Close modal
            setShowQuotationModal(false);
        } catch (err) {
            console.error("Failed to send quotation:", err);
            setError(t("profileChat.quotationError") || "Failed to send quotation. Please try again.");
        }
    };

    const flowActions: FlowActions = {
        onProposeQuote: () => {
            setShowQuotationModal(true);
        },
        onConfirmAssign: () => {
            // Employer confirms assignment -> notify freelancer to move to 'accept'
            const messageId = uuidv4();
            const readable = t("profileChat.confirmAssignMsg") || "Assignment confirmed. Waiting for freelancer to accept.";
            const payload = { type: "employer-assigned" };

            // Add local human-readable message
            setMessages((prev) => [
                {
                    id: messageId,
                    roomId: currentRoom?.roomId || roomId,
                    content: readable,
                    createdAt: new Date().toISOString(),
                    senderId: Number(localUser?.id) || 0,
                    receiverId: roomId.includes(":") ? Number(roomId.split(":")[1]) || 0 : 0,
                    status: 0,
                    isOwner: true,
                } as ChatMessage,
                ...prev,
            ]);

            // Send structured event to the other side
            sendMessage({
                message: JSON.stringify(payload),
                id: messageId,
            });

            try {
                const tsIso = new Date().toISOString();
                updateRoomLastMessage(roomId, readable, Number(localUser?.id) || 0, tsIso);
                window.dispatchEvent(
                    new CustomEvent("chat:new-message", {
                        detail: { roomId, content: readable, senderId: Number(localUser?.id) || 0, timestamp: tsIso },
                    })
                );
            } catch {
            }
            // Move employer directly to 'chat' (Work Discussion) after confirming assign
            goToStatus("chat");
        },
        onAcceptJob: () => {
            goToStatus("chat");
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
            } catch {
            }
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
            goToStatus("review");
            setShowReviewModal(true);
        },
        onRequestRevision: () => {
            goToStatus("chat");
            setShowReviewModal(false);
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
        },
        onReleasePayment: () => {
            goToStatus("pay");
            setShowReviewModal(false);
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
        },
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
                } catch {
                }
            } catch {
            }

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
            setError(t("profileChat.uploadError") || "Failed to upload file. Please try again.");
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

        const observer = new IntersectionObserver(
            (entries) => {
                const e = entries[0];
                console.log("[CHAT][OBS] Intersection change", {
                    isIntersecting: e.isIntersecting,
                    ratio: e.intersectionRatio,
                    rootBounds: e.rootBounds ? { height: e.rootBounds.height, top: e.rootBounds.top } : null,
                    boundingClientRect: { top: e.boundingClientRect.top, height: e.boundingClientRect.height },
                });
                if (e.isIntersecting && e.intersectionRatio > 0) {
                    if (isFetching) {
                        console.log("[CHAT][OBS] Visible but skip, already fetching");
                        return;
                    }
                    console.log("[CHAT][OBS] Top sentinel visible -> fetchHistory()");
                    const scrollHeight = rootEl.scrollHeight;
                    fetchHistory()
                        .then(() => {
                            const newScrollHeight = rootEl.scrollHeight;
                            console.log("[CHAT][OBS] Scroll adjustment", {
                                oldHeight: scrollHeight,
                                newHeight: newScrollHeight,
                                scrollTop: rootEl.scrollTop,
                            });
                            rootEl.scrollTop += newScrollHeight - scrollHeight;
                        })
                        .catch((err) => {
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
            fetchHistory()
                .then(() => {
                    setIsInitialLoading(false);
                })
                .catch((err) => {
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

    // Update workflow automatically based on latest special messages
    useEffect(() => {
        if (!messages.length) return;
        const latest = messages[0];
        const content = latest.content?.trim() || "";
        if (!content.startsWith("{")) return;
        try {
            const parsed = JSON.parse(content);
            if (parsed && parsed.type === "proposed-quote") {
                if (latest.isOwner) {
                    // Freelancer created quotation -> should be at step 2 (queue)
                    goToStatus("queue");
                } else {
                    // Employer received a quotation -> go to step 'assign'
                    goToStatus("assign");
                }
            } else if (parsed && parsed.type === "employer-assigned") {
                if (!latest.isOwner) {
                    // Employer finished assign -> both sides proceed to 'chat' (Work Discussion)
                    goToStatus("chat");
                }
            }
        } catch {
            /* ignore parse errors */
        }
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
                        ref={scrollContainerRef}
                        data-testid="chat-list"
                        className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50 flex flex-col-reverse"
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
                    <div className="border-t px-3 py-2 sm:px-4 sm:py-3 bg-white">
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                                <ChatInput
                                    onSubmit={onSubmit}
                                    onFileUpload={handleFileUpload}
                                    selectedFile={selectedFile}
                                    setSelectedFile={setSelectedFile}
                                    isUploading={isUploading}
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
                        <h2 className="text-base sm:text-lg font-semibold text-blue-800">
                            {t("profileChat.jobFlow") || "Job Flow"}
                        </h2>
                        <button
                            className="md:hidden p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200"
                            onClick={() => setIsFlowOpen(false)}
                            aria-label="Close job flow sidebar"
                        >
                            <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto border-b border-gray-200">
                        <FreelanceChatFlow
                            currentStatus={currentStatus}
                            onChangeStatus={handleChangeStatus}
                            orientation="vertical"
                            compact={false}
                            className="space-y-4"
                            onProposeQuote={flowActions.onProposeQuote}
                            onConfirmAssign={flowActions.onConfirmAssign}
                            onAcceptJob={flowActions.onAcceptJob}
                            onUploadAsset={flowActions.onUploadAsset}
                            onSendMessage={flowActions.onSendMessage}
                            onSubmitDelivery={flowActions.onSubmitDelivery}
                            onRequestRevision={flowActions.onRequestRevision}
                            onReleasePayment={flowActions.onReleasePayment}
                        />
                    </div>
                    <div className="p-3 sm:p-4 md:p-6 bg-white border-t border-gray-200">
                        <div className="flex items-center bg-white rounded-lg shadow-sm p-2 sm:p-3 hover:shadow-md transition-all duration-200 hover:transform hover:scale-105" aria-label="Job details">
                            <div className="w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 rounded-md bg-gray-200 overflow-hidden mr-2 sm:mr-3 md:mr-4 flex-shrink-0">
                                <Image
                                    src={currentRoom?.job?.coverImage || CategoriesImage.seoJob}
                                    alt={currentRoom?.job?.title || "Job Cover"}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            </div>
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
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200"
                                onClick={() => setIsFlowOpen(false)}
                                aria-label="Close job flow drawer"
                            >
                                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 p-3 sm:p-4 overflow-y-auto border-b border-gray-200">
                            <FreelanceChatFlow
                                currentStatus={currentStatus}
                                onChangeStatus={handleChangeStatus}
                                orientation="vertical"
                                compact={false}
                                className="space-y-4"
                                onProposeQuote={flowActions.onProposeQuote}
                                onConfirmAssign={flowActions.onConfirmAssign}
                                onAcceptJob={flowActions.onAcceptJob}
                                onUploadAsset={flowActions.onUploadAsset}
                                onSendMessage={flowActions.onSendMessage}
                                onSubmitDelivery={flowActions.onSubmitDelivery}
                                onRequestRevision={flowActions.onRequestRevision}
                                onReleasePayment={flowActions.onReleasePayment}
                            />
                        </div>
                        <div className="p-3 sm:p-4 bg-white">
                            <div className="flex items-center bg-white rounded-lg shadow-sm p-2 sm:p-3" aria-label="Job details">
                                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-md bg-gray-200 overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                                    <Image
                                        src={currentRoom?.job?.coverImage || CategoriesImage.seoJob}
                                        alt={currentRoom?.job?.title || "Job Cover"}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
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
                                    goToStatus("pay");
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
                                    goToStatus("chat");
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
            <QuotationModal
                isOpen={showQuotationModal}
                onClose={() => setShowQuotationModal(false)}
                onSubmit={handleQuotationSubmit}
            />
        </>
    );
};

export default ChatSection;