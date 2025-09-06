"use client";

import {ChatMessage} from "@/types/chat";
import ChatMessageItem from "../ChatMessageItem";
import {StaticImageData} from "next/image";
import {Virtuoso} from "react-virtuoso";
import React from "react";

interface ChatMessagesProps {
  messages: ChatMessage[];
  partnerAvatar: StaticImageData | string;
  customScrollParent?: HTMLElement | null;
  onTopReached?: () => void;
  hasMore?: boolean;
  isFetching?: boolean;
}

const formatDate = (dateStr: string, locale?: string) => {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat(locale || undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return formatter.format(date);
};

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  partnerAvatar,
  customScrollParent,
  onTopReached,
  hasMore,
  isFetching,
}) => {
  const userLocale = typeof navigator !== "undefined" ? navigator.language : undefined;

  // Virtuoso expects oldest -> newest (top to bottom). Our messages are newest-first in state.
  const data = React.useMemo(() => [...messages].reverse(), [messages]);

  return (
    <Virtuoso
      data={data}
      customScrollParent={customScrollParent || undefined}
      followOutput="auto"
      atTopStateChange={(atTop) => {
        if (atTop && onTopReached) onTopReached();
      }}
      components={{
        Header: hasMore
          ? () => (
              <div className="w-full flex justify-center my-2">
                <div className="inline-block rounded bg-gray-200 text-gray-600 text-xs px-2 py-1">
                  {isFetching ? "Loading..." : "Previous messages"}
                </div>
              </div>
            )
          : undefined,
      }}
      itemContent={(index, msg) => {
        const currentDate = formatDate(msg.createdAt, userLocale);
        const prev = index > 0 ? data[index - 1] : null;
        const prevDate = prev ? formatDate(prev.createdAt, userLocale) : null;
        const showDate = currentDate !== prevDate;
        return (
          <div key={msg.id || index}>
            {showDate && (
              <div className="w-full flex justify-center my-4">
                <div className="inline-block rounded-[10px] bg-border-secondary p-1 min-w-[120px] text-[#728197] text-[12.8px] text-center">
                  {currentDate}
                </div>
              </div>
            )}
            <ChatMessageItem message={msg} partnerAvatar={partnerAvatar} />
          </div>
        );
      }}
      style={{ overflowX: "hidden" }}
    />
  );
};

export default ChatMessages;
