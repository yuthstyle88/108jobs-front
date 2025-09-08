"use client";

import type { ChatMessage } from "lemmy-js-client";
import ChatMessageItem from "../ChatMessageItem";
import {StaticImageData} from "next/image";
import {Virtuoso} from "react-virtuoso";
import React from "react";

type UIChatMessage = ChatMessage & { isOwner?: boolean };

interface ChatMessagesProps {
    messages: UIChatMessage[];
    partnerAvatar: StaticImageData | string;
    customScrollParent?: HTMLElement | null;
    onTopReached?: () => void;
    hasMore?: boolean;
    isFetching?: boolean;
}

const formatDate = (dateStr: string, locale?: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return ""; // fail-safe for unexpected values
    return date.toLocaleDateString(locale || undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
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

    // Virtuoso expects items in oldest-first order for chat use cases.
    // Incoming messages are newest-first, so reverse for display.
    const displayedMessages = React.useMemo(() => [...messages].reverse(), [messages]);

    return (
        <Virtuoso
            data={displayedMessages}
            computeItemKey={(index, msg) => String(msg.id ?? index)}
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
                Scroller: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
                    <div {...props} ref={ref} style={{ ...(props.style || {}), overflow: "auto" }} />
                )),
            }}
            itemContent={(index, msg) => {
                const currentDate = formatDate(msg.createdAt, userLocale);
                const prev = index > 0 ? displayedMessages[index - 1] : null;
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
            style={{ overflowX: "hidden", width: "100%" }}
        />
    );
};

export default ChatMessages;
