"use client";

import type {ChatMessage} from "lemmy-js-client";
import ChatMessageItem from "../ChatMessageItem";
import {StaticImageData} from "next/image";
import {Virtuoso, VirtuosoHandle} from "react-virtuoso";
import React from "react";
import {useParams} from "next/navigation";
import {formatDateToLong} from "@/utils";
import {getLocale} from "@/utils/date";
import {useTranslation} from "react-i18next";

interface ChatMessagesProps {
    messages: ChatMessage[];
    partnerAvatar: StaticImageData | string;
    customScrollParent?: HTMLElement | null;
    onTopReached?: () => void;
    hasMore?: boolean;
    isFetching?: boolean;
    onAtBottomChange?: (isAtBottom: boolean) => void;
    sendReadReceipt: (roomIdArg: string, lastMessageId: string) => void;
    roomId: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
                                                       messages,
                                                       partnerAvatar,
                                                       customScrollParent,
                                                       onTopReached,
                                                       hasMore,
                                                       isFetching,
                                                       onAtBottomChange,
                                                       sendReadReceipt,
                                                       roomId,
                                                   }) => {
    const {t} = useTranslation();
    const params = useParams();
    const currentLang = (params?.lang as string) || "th";
    const currentLocale = getLocale(currentLang);

    const displayedMessages = React.useMemo(() => [...messages].reverse(), [messages]);
    const virtuosoRef = React.useRef<VirtuosoHandle | null>(null);
    const [isAtBottom, setIsAtBottom] = React.useState(true);

    const prevLengthRef = React.useRef(displayedMessages.length);

    React.useEffect(() => {
        const prevLength = prevLengthRef.current;
        const newLength = displayedMessages.length;
        const added = newLength - prevLength;
        prevLengthRef.current = newLength;

        // Only scroll if messages grew by 1 (new chat message)
        // or user was at bottom when multiple new messages arrived
        if (added <= 0) return; // no new messages

        if (added === 1 || isAtBottom) {
            virtuosoRef.current?.scrollToIndex({
                index: newLength - 1,
                behavior: "auto",
            });
        }
    }, [displayedMessages.length, isAtBottom]);

    return (
        <Virtuoso
            ref={virtuosoRef}
            data={displayedMessages}
            customScrollParent={customScrollParent ?? undefined}
            computeItemKey={(_index, msg) => String(msg.id ?? _index)}
            alignToBottom
            atTopStateChange={(atTop) => {
                if (atTop && onTopReached) onTopReached();
            }}
            atBottomStateChange={(bottom) => {
                setIsAtBottom(bottom);
                onAtBottomChange?.(bottom);

                if (bottom && displayedMessages.length > 0) {
                    sendReadReceipt(roomId, displayedMessages[displayedMessages.length - 1]?.id);
                }
            }}
            components={{
                Footer: () => <div style={{height: 20}}/>,
                Header: hasMore
                    ? () => (
                        <div className="w-full flex justify-center my-2">
                            <div className="inline-block rounded bg-gray-200 text-gray-600 text-xs px-2 py-1">
                                {isFetching ? "Loading..." : t("profileChat.previousMessages")}
                            </div>
                        </div>
                    )
                    : undefined,
            }}
            itemContent={(index, msg) => {
                const currentDate = formatDateToLong(msg.createdAt, currentLocale);
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
            style={{height: "100%", width: "100%", overflowX: "hidden"}}
        />
    );
};

export default ChatMessages;
