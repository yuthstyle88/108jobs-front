"use client";

import type {ChatMessage} from "lemmy-js-client";
import ChatMessageItem from "../ChatMessageItem";
import {StaticImageData} from "next/image";
import {Virtuoso, VirtuosoHandle} from "react-virtuoso";
import React from "react";
import {useParams} from "next/navigation";
import {formatDateToLong} from "@/utils";
import {getLocale} from "@/utils/date";

type UIChatMessage = ChatMessage & { isOwner?: boolean };

interface ChatMessagesProps {
    messages: UIChatMessage[];
    partnerAvatar: StaticImageData | string;
    customScrollParent?: HTMLElement | null;
    onTopReached?: () => void;
    hasMore?: boolean;
    isFetching?: boolean;
    onAtBottomChange?: (isAtBottom: boolean) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
                                                       messages,
                                                       partnerAvatar,
                                                       customScrollParent,
                                                       onTopReached,
                                                       hasMore,
                                                       isFetching,
                                                       onAtBottomChange,
                                                   }) => {
// Reverse messages to display newest-first (API provides oldest-first)
    const displayedMessages = React.useMemo(() => [...messages].reverse(), [messages]);
    const params = useParams();
    const currentLang = (params?.lang as string) || 'th';
    const currentLocale = getLocale(currentLang);

    // Track whether the user is at the bottom for auto-scroll
    const virtuosoRef = React.useRef<VirtuosoHandle | null>(null);
    const [, setAtBottom] = React.useState(true);

    return (
        <Virtuoso
            ref={virtuosoRef}
            data={displayedMessages}
            customScrollParent={customScrollParent ?? undefined}
            computeItemKey={(_index, msg) => {
                const anyMsg: any = msg as any;
                if (anyMsg && anyMsg.id != null) return String(anyMsg.id);
                const created = anyMsg?.createdAt || "";
                const sender = anyMsg?.senderId ?? "";
                const content: string = anyMsg?.content || "";
                return `${created}|${sender}|${content.length}:${content.slice(0, 16)}`;
            }}
            followOutput={isFetching ? false : "auto"} // Auto-scroll to new messages when at bottom; disabled during history fetch
            initialTopMostItemIndex={displayedMessages.length - 1} // Start at newest message
            alignToBottom // Align viewport to bottom for newest messages
            atTopStateChange={(atTop) => {
                if (atTop && onTopReached) onTopReached(); // Fetch older messages
            }}
            atBottomStateChange={(isAtBottom) => {
                setAtBottom(isAtBottom);
                if (onAtBottomChange) onAtBottomChange(isAtBottom);
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
                Scroller: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
                    (props, ref) => (
                        <div
                            {...props}
                            ref={ref}
                            style={{
                                ...(props.style || {}),
                                overflow: customScrollParent ? "visible" : "auto",
                                display: "flex",
                                flexDirection: "column-reverse", // Render messages bottom-to-top
                            }}
                        />
                    )
                ),
            }}
            itemContent={(index, msg) => {
                const currentDate = formatDateToLong(msg.createdAt, currentLocale);
                // Compare with previous message (older) for date boundary in newest-first order
                const prev = index > 0 ? displayedMessages[index - 1] : null;
                const prevDate = prev ? formatDateToLong(prev.createdAt, currentLocale) : null;
                const showDate = currentDate !== prevDate;
                return (
                    <div key={msg.id || index} className="mb-2 last:mb-0">
                        {showDate && (
                            <div className="w-full flex justify-center my-4">
                                <div
                                    className="inline-block rounded-[10px] bg-border-secondary p-1 min-w-[120px] text-[#728197] text-[12.8px] text-center">
                                    {currentDate}
                                </div>
                            </div>
                        )}
                        <ChatMessageItem message={msg} partnerAvatar={partnerAvatar}/>
                    </div>
                );
            }}
            style={{overflowX: "hidden", width: "100%", height: "100%"}}
        />
    );
};

export default ChatMessages;