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
    initialLoadDone?: boolean;
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
                                                       initialLoadDone = false,
                                                   }) => {
    const {t} = useTranslation();
    const params = useParams();
    const currentLang = (params?.lang as string) || "th";
    const currentLocale = getLocale(currentLang);

    // Keep natural order (oldest -> newest) for Virtuoso
    const data = React.useMemo(() => [...messages], [messages]);
    const virtuosoRef = React.useRef<VirtuosoHandle | null>(null);
    const [isAtBottom, setIsAtBottom] = React.useState(true);

    const prevLengthRef = React.useRef(data.length);
    // Track first (head) message id to detect prepends (history loads)
    const headIdRef = React.useRef<string | null>(
        data.length ? String((data[0] as any)?.id ?? '') : null
    );
    const tailIdRef = React.useRef<string | null>(
        data.length ? String((data[data.length - 1] as any)?.id ?? '') : null
    );

    // Track the range to detect when we're near the top
    const rangeRef = React.useRef({startIndex: 0, endIndex: 0});
    const hasMoreRef = React.useRef(hasMore);
    const isFetchingRef = React.useRef(isFetching);

    // Track initial load state internally as fallback
    const initialLoadDoneRef = React.useRef(initialLoadDone);

    React.useEffect(() => {
        hasMoreRef.current = hasMore;
        isFetchingRef.current = isFetching;
    }, [hasMore, isFetching]);

    // Sync with parent's initialLoadDone prop
    React.useEffect(() => {
        initialLoadDoneRef.current = initialLoadDone;
    }, [initialLoadDone]);

    const handleTopReached = React.useCallback(() => {
        if (!hasMoreRef.current || isFetchingRef.current) return;
        onTopReached?.();
    }, [onTopReached]);

    const handleRangeChanged = React.useCallback((range: { startIndex: number; endIndex: number }) => {
        rangeRef.current = range;

        // ⚠️ CRITICAL: Skip initial load - let parent useEffect handle it
        if (!initialLoadDoneRef.current && range.startIndex === 0) {
            return;
        }

        // If we're at the 10th message from the start and have more to load
        if (range.startIndex <= 10 && hasMoreRef.current && !isFetchingRef.current) {
            handleTopReached();
        }
    }, [handleTopReached]);

    React.useEffect(() => {
        const prevLength = prevLengthRef.current;
        const newLength = data.length;
        const added = newLength - prevLength;

        const prevHeadId = headIdRef.current;
        const newHeadId = newLength ? String((data[0] as any)?.id ?? '') : null;

        const prevTailId = tailIdRef.current;
        const newTailId = newLength ? String((data[newLength - 1] as any)?.id ?? '') : null;

        prevLengthRef.current = newLength;
        headIdRef.current = newHeadId;
        tailIdRef.current = newTailId;

        if (added <= 0) return;

        const isPrepend = prevHeadId !== newHeadId;
        const isAppend = prevTailId !== newTailId;

        if (isPrepend) {
            setTimeout(() => {
                virtuosoRef.current?.scrollToIndex({
                    index: added,
                    behavior: 'auto',
                    align: 'start',
                });
            }, 0);
        } else if (isAppend || isAtBottom) {
            setTimeout(() => {
                virtuosoRef.current?.scrollToIndex({
                    index: newLength - 1,
                    behavior: 'auto',
                    align: 'end',
                });
            }, 0);
        }
    }, [data, isAtBottom]);

    return (
        <Virtuoso
            ref={virtuosoRef}
            data={data}
            firstItemIndex={0}
            initialTopMostItemIndex={data.length > 0 ? data.length - 1 : 0}
            followOutput={true}
            customScrollParent={customScrollParent ?? undefined}
            computeItemKey={(_index, msg) => {
                const m: any = msg as any;
                const id = m?.id ?? m?.clientId;
                if (id != null) return String(id);
                // Fallback to immutable combo; avoid content length to keep key stable
                const created = m?.createdAt ?? '';
                const sender = m?.senderId ?? '';
                return `${created}|${sender}`;
            }}
            alignToBottom
            rangeChanged={handleRangeChanged}
            atTopStateChange={(atTop) => {
                // Don't trigger loading here - we use rangeChanged instead
                // This prevents double fetching
            }}
            atBottomStateChange={(bottom) => {
                setIsAtBottom(bottom);
                onAtBottomChange?.(bottom);
                if (bottom && data.length > 0) {
                    const lastId = (data[data.length - 1] as any)?.id;
                    if (lastId != null) {
                        sendReadReceipt(roomId, String(lastId));
                    }
                }
            }}
            components={{
                Footer: () => <div style={{height: 10}}/>,
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
                const prev = index > 0 ? data[index - 1] : null;
                const prevDate = prev ? formatDateToLong(prev.createdAt, currentLocale) : null;
                const showDate = currentDate !== prevDate;

                return (
                    <div className="mb-2 last:mb-0">
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