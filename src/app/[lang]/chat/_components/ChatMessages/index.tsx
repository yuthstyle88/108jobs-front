"use client";

import { ChatMessage } from "@/types/chat";
import ChatMessageItem from "../ChatMessageItem";
import { StaticImageData } from "next/image";

interface ChatMessagesProps {
  messages: ChatMessage[];
  partnerAvatar: StaticImageData | string;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("th-TH", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  partnerAvatar,
}) => {
  return (
    <>
      {messages.map((msg, index) => {
        const currentDate = formatDate(msg.createdAt);
        const prevDate =
          index > 0 ? formatDate(messages[index - 1].createdAt) : null;
        const showDate = currentDate !== prevDate;

        return (
          <div key={msg.id || index}>
            {showDate && (
              <div className="w-full flex justify-center my-4">
                <div className="inline-block rounded-[10px] bg-borderSecondary p-1 min-w-[120px] text-[#728197] text-[12.8px] text-center">
                  {currentDate}
                </div>
              </div>
            )}
            <ChatMessageItem message={msg} partnerAvatar={partnerAvatar} />
          </div>
        );
      })}
    </>
  );
};

export default ChatMessages;
