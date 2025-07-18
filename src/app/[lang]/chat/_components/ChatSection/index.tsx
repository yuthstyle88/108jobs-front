"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { mutate } from "swr";

import { API_ROUTES } from "@/api/endpoints";
import LoadingBlur from "@/components/LoadingBlur";

import { useChatLanguage } from "@/contexts/ChatLanguage";
import { useWebSocket } from "@/contexts/RealtimeChatContext";
import { usePrivateFetch, usePrivateImagePost } from "@/hooks/api-hooks";

import { JobDetailIcon } from "@/constants/icons";
import { CategoriesImage, ProfileImage } from "@/constants/images";
import { ChatMessage, ChatResponse } from "@/types/chat";
import ChatHeader from "../ChatHeader";
import ChatInput from "../ChatInput";
import ChatJob from "../ChatJob";
import ChatMessages from "../ChatMessages";

type MessageForm = {
  message: string;
};

type UploadedFile = {
  fileUrl: string;
  fileType: string;
  fileName: string;
};
const ChatSection = () => {
  const { languageData: chatLanguageData } = useChatLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { sendMessage, partnerId } = useWebSocket(
    "chat-message",
    (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === data.id)) return prev;
        return [...prev, data];
      });
    }
  );

  const { data: chatData, isLoading: isChatLoading } = usePrivateFetch<
    ChatResponse[]
  >(API_ROUTES.chat.getChatHistory);

  const { trigger: uploadFile, isMutating: isUploading } = usePrivateImagePost(
    API_ROUTES.chat.uploadFile + `?roomId=${partnerId}`
  );

  const currentRoom = chatData?.find(
    (room) =>
      String(room.roomId) === partnerId || String(room.job?.id) === partnerId
  );

  const onSubmit = (data: MessageForm) => {
    const message = data.message?.trim() || "";
    if (!message && !selectedFile) return;

    sendMessage({
      message,
      fileUrl: selectedFile?.fileUrl || "",
      fileType: selectedFile?.fileType || "",
      fileName: selectedFile?.fileName || "",
    });

    setSelectedFile(null);
    mutate(API_ROUTES.chat.getChatHistory);
  };

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
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isChatLoading) return <LoadingBlur text="" />;

  return (
    <>
      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <ChatHeader
          avatarUrl={currentRoom?.partnerAvatar || ProfileImage.avatar}
          displayName={currentRoom?.partnerDisplayName || "User"}
          guideText={chatLanguageData?.guide || "คู่มือการใช้งาน"}
        />

        {/* Chat messages */}
        <div
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
                  <p>{chatLanguageData?.unselectWarning}</p>
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

        {/* Message input */}
        <div className="border-t px-4 py-3 bg-white">
          <ChatInput
            onSubmit={onSubmit}
            onFileUpload={handleFileUpload}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            isUploading={isUploading}
            chatLanguageData={chatLanguageData}
          />
        </div>
      </div>

      {/* Sidebar (optional) */}
      <div className="w-80 flex flex-col border-l bg-white h-full">
        <div className="px-4 py-6 border-b">
          <h3 className="text-gray-800 font-medium">
            {chatLanguageData?.details}
          </h3>
        </div>

        <div className="p-4 bg-[#DBE8FC] flex items-center">
          <Image
            src={JobDetailIcon.guarantee}
            alt="seoJob"
            className="w-5 mr-4"
          />
          <p className="text-sm text-gray-700">
            {chatLanguageData?.securePaymentNote}
          </p>
        </div>

        <div className="p-4 border-b">
          <div className="flex">
            <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
              <Image
                src={currentRoom?.jobCoverImage || CategoriesImage.seoJob}
                alt="seoJob"
                width={64}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-text-primary font-sans line-clamp-2">
                {currentRoom?.job.title}
              </p>
            </div>
          </div>
        </div>

        {/* <div className="border-b">
          <button
            className="flex items-center justify-between w-full p-4 text-sm hover:bg-gray-50 transition-colors"
            onClick={toggleEmployment}
          >
            <div className="flex items-center text-blue-600">
              <span className="inline-block mr-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </span>
              <span>ข้อมูลการจ้างงาน</span>
            </div>
            {isEmploymentOpen ? (
              <ChevronUp size={16} color="blue" />
            ) : (
              <ChevronDown size={16} color="blue" />
            )}
          </button>
          {isEmploymentOpen && (
            <div className="px-4 pb-4 animate-fade-in">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">เลขคำสั่งซื้อ</span>
                <div className="flex items-center">
                  <span className="text-green-600 font-medium">LPC8527T</span>
                  <button className="ml-1 text-gray-400 hover:text-gray-600">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-b">
          <button
            className="flex items-center justify-between w-full p-4 text-sm hover:bg-gray-50 transition-colors"
            onClick={toggleDocuments}
          >
            <div className="flex items-center text-blue-600">
              <span className="inline-block mr-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </span>
              <span>เอกสารจ้างงาน</span>
            </div>
            {isDocumentsOpen ? (
              <ChevronUp size={16} color="blue" />
            ) : (
              <ChevronDown size={16} color="blue" />
            )}
          </button>
          {isDocumentsOpen && (
            <div className="px-4 pb-4 animate-fade-in">
              <p className="text-sm text-gray-500 text-center">
                ยังไม่มีเอกสาร
              </p>
            </div>
          )}
        </div> */}
      </div>
    </>
  );
};

export default ChatSection;
