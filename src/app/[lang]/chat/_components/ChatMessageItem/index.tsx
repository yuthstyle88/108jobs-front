"use client";

import Image, { StaticImageData } from "next/image";
import { ChatMessage } from "@/types/chat";
import { MessageImage } from "@/constants/images";
import FilePreview from "../FilePreview";

interface ChatMessageItemProps {
  message: ChatMessage;
  partnerAvatar?: string | StaticImageData;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  partnerAvatar,
}) => {
  const isIncoming = !message.isOwner;
  const time = new Date(message.createdAt).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex mb-2 ${isIncoming ? "justify-start" : "justify-end"}`}
    >
      {isIncoming && (
        <Image
          src={partnerAvatar || MessageImage.chatAvt}
          alt="avatar"
          width={24}
          height={24}
          className="w-6 h-6 rounded-full mr-2 self-end"
        />
      )}
      <div
        className={`flex flex-col gap-1 ${
          isIncoming ? "items-start" : "items-end"
        }`}
      >
        <p className="text-[12.8px] text-[#728197]">{time}</p>

        {/* Text message bubble */}
        {message.content?.trim() && (
          <div
            className={`max-w-xs px-3 py-2 rounded-xl text-base font-sans break-words whitespace-pre-line ${
              isIncoming
                ? "bg-gray-200 text-gray-800 rounded-bl-none"
                : "bg-blue-500 text-white rounded-br-none"
            }`}
          >
            {message.content}
          </div>
        )}

        {message.fileUrl && (
          <div className="mt-1 max-w-xs">
            <FilePreview
              fileUrl={message.fileUrl}
              fileType={message.fileType || "application/octet-stream"}
              fileName={message?.fileName || "Attach file"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;
