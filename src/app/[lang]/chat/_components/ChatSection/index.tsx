"use client";

import Image from "next/image";
import {useCallback, useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { useMyUser } from "@/hooks/profile-api/useMyUser"; // Import useMyUser

import { API_ROUTES } from "@/api/endpoints";
import LoadingBlur from "@/components/LoadingBlur";
import { usePrivateFetch, usePrivateImagePost } from "@/hooks/api-hooks";
import { JobDetailIcon } from "@/constants/icons";
import { CategoriesImage, ProfileImage } from "@/constants/images";
import { ChatMessage, ChatResponse } from "@/types/chat";
import ChatHeader from "../ChatHeader";
import ChatInput from "../ChatInput";
import ChatJob from "../ChatJob";
import ChatMessages from "../ChatMessages";
import { useWebSocket } from "@/contexts/RealtimeChatContext";

type MessageForm = { message: string };
type UploadedFile = { fileUrl: string; fileType: string; fileName: string };

const ChatSection = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
    const endRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isSubmittingRef = useRef(false);
    const { localUser } = useMyUser(); // Get current user

    const { sendMessage, isConnected, roomId } = useWebSocket(
        "chat-message",
        (event: MessageEvent<ChatMessage | ChatMessage[]>) => {
            if (process.env.NODE_ENV !== "production") console.debug("Message received");
            let parsed: ChatMessage | ChatMessage[];
            try {
                parsed = JSON.parse(event.data);
            } catch (e) {
                console.error("Failed to parse WebSocket message:", e);
                return;
            }

            const items: ChatMessage[] = Array.isArray(parsed) ? parsed : [parsed];
            if (!items.length) return;

            setMessages((prev) => {
                const copy = [...prev];

                for (const msg of items) {
                    // Deduplicate based on content, senderId, and createdAt
                    const isDuplicate = copy.some(
                        (m) =>
                            m.content === msg.content &&
                            m.senderId === msg.senderId &&
                            Math.abs(new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 2000
                    );
                    if (isDuplicate) {
                        if (process.env.NODE_ENV !== "production") console.debug("Duplicate message ignored");
                        continue;
                    }

                    // Replace pending message if it exists
                    const idx = copy.findIndex((m) => m.id === msg.id && m.status === 0);
                    if (idx >= 0) {
                        if (process.env.NODE_ENV !== "production") console.debug("Replacing pending message");
                        copy[idx] = { ...msg, status: 1 };
                    } else {
                        copy.push({ ...msg, status: 1 });
                    }
                }

                return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            });
        }
    );

    const { data: chatData, isLoading: isChatLoading } = usePrivateFetch<ChatResponse[]>(
        API_ROUTES.chat.getChatHistory
    );

    const { trigger: uploadFile, isMutating: isUploading } = usePrivateImagePost(
        API_ROUTES.chat.uploadFile + `?roomId=${roomId}`
    );

    const currentRoom = chatData?.find(
        (room) => String(room.roomId) === roomId || String(room.job?.id) === roomId
    );

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

            // Add pending message with correct senderId
            setMessages((prev) => [
                ...prev,
                {
                    id: messageId,
                    roomId: currentRoom?.roomId || roomId,
                    content: message || "",
                    createdAt: new Date().toISOString(),
                    senderId: Number(localUser?.id) || 0, // Use localUser.id
                    receiverId: roomId.includes(":") ? Number(roomId.split(":")[1]) || 0 : 0,
                    status: 0,
                    isOwner: true,
                } as ChatMessage,
            ]);

            // Send message with same ID
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
        if (!scrollContainerRef.current) return;

        const el = scrollContainerRef.current;
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        if (atBottom) {
            endRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (chatData && currentRoom) {
            const historyMessages = currentRoom.messages?.map((msg) => ({
                ...msg,
                status: 1,
                isOwner: msg.senderId === Number(localUser?.id), // Use localUser.id
            })) || [];
            setMessages(historyMessages);
        }
    }, [chatData, currentRoom, localUser?.id]);

    if (isChatLoading) return <LoadingBlur text="" />;

    return (
        <>
            <div className="flex-1 flex flex-col h-full">
                <ChatHeader
                    avatarUrl={currentRoom?.partnerAvatar || ProfileImage.avatar}
                    displayName={currentRoom?.partnerDisplayName || "User"}
                    guideText={t("profileChat.guide") || "Usage Guide"}
                />

                <div
                    ref={scrollContainerRef}
                    data-testid="chat-list"
                    className="flex-1 overflow-y-auto p-4 bg-gray-50"
                >
                    <ChatJob currentRoom={currentRoom} />

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
                                    <p>{t("profileChat.unselectWarning")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ChatMessages
                        messages={messages}
                        partnerAvatar={currentRoom?.partnerAvatar || ProfileImage.avatar}
                    />

                    <div ref={endRef} />
                </div>

                <div className="border-t px-4 py-3 bg-white">
                    <ChatInput
                        onSubmit={onSubmit}
                        onFileUpload={handleFileUpload}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        isUploading={isUploading}
                    />
                </div>
            </div>

            <div className="w-80 flex flex-col border-l bg-white h-full">
                <div className="px-4 py-6 border-b">
                    <h3 className="text-gray-800 font-medium">{t("profileChat.details")}</h3>
                </div>

                <div className="p-4 bg-[#DBE8FC] flex items-center">
                    <Image src={JobDetailIcon.guarantee} alt="securePayment" className="w-5 mr-4" />
                    <p className="text-sm text-gray-700">{t("profileChat.securePaymentNote")}</p>
                </div>

                <div className="p-4 border-b">
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
                                {currentRoom?.job?.title || "No Job Title"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatSection;