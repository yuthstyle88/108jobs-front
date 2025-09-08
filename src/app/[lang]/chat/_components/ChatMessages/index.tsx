"use client";

import type { ChatMessage } from "lemmy-js-client";
import ChatMessageItem from "../ChatMessageItem";
import { StaticImageData } from "next/image";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import React from "react";

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
    onAtBottomChange,
}) => {
    const userLocale = typeof navigator !== "undefined" ? navigator.language : undefined;

    // Virtuoso expects items in oldest-first order for chat use cases.
    // Incoming messages are newest-first, so reverse for display.
    const displayedMessages = React.useMemo(() => [...messages].reverse(), [messages]);

    // Track whether the user is at the bottom to emulate auto-scroll behavior like VirtuosoMessageList
    const virtuosoRef = React.useRef<VirtuosoHandle | null>(null);
    const [atBottom, setAtBottom] = React.useState(true);

    // When messages change and the user is at the bottom, scroll smoothly to the last item.
    React.useEffect(() => {
        if (!virtuosoRef.current) return;
        if (!displayedMessages.length) return;
        if (!atBottom) return;
        // Scroll to the end when new data arrives or item sizes change while at bottom
        virtuosoRef.current.scrollToIndex({ index: displayedMessages.length - 1, align: "end", behavior: "smooth" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayedMessages, atBottom]);

    // Force-follow when the current user sends a new message (ensure the view follows own messages).
    React.useEffect(() => {
        const latest = messages && messages.length > 0 ? messages[0] : null; // messages are newest-first
        if (!latest || !latest.isOwner) return;
        if (!virtuosoRef.current) return;
        // Always scroll to bottom for own messages to avoid having to manually scroll
        virtuosoRef.current.scrollToIndex({ index: displayedMessages.length - 1, align: "end", behavior: "smooth" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    return (
        <Virtuoso
            ref={virtuosoRef}
            data={displayedMessages}
            customScrollParent={customScrollParent ?? undefined}
            computeItemKey={(index, msg) => {
                const anyMsg: any = msg as any;
                if (anyMsg && anyMsg.id != null) return String(anyMsg.id);
                const created = anyMsg?.createdAt || "";
                const sender = anyMsg?.senderId ?? "";
                const content: string = anyMsg?.content || "";
                return `${created}|${sender}|${content.length}:${content.slice(0, 16)}`;
            }}
            // Only follow new output when the user is at the bottom
            followOutput="auto"
            initialTopMostItemIndex={displayedMessages.length - 1}
            alignToBottom
            atTopStateChange={(atTop) => {
                if (atTop && onTopReached) onTopReached();
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
                Scroller: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
                    <div
                        {...props}
                        ref={ref}
                        style={{
                            ...(props.style || {}),
                            overflow: customScrollParent ? "visible" : "auto",
                        }}
                    />
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
            style={{ overflowX: "hidden", width: "100%", height: "100%" }}
        />
    );
};

export default ChatMessages;
