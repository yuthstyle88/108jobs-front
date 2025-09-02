"use client";

import {ProfileImage} from "@/constants/images";
import {useLanguage} from "@/contexts/LanguageContext";
import {formatMessageTime} from "@/utils/formatMessageTime";
import Image from "next/image";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import { useChatRooms } from "@/contexts/ChatRoomsContext";
import type { ChatRoom } from "@/types/chat";

function extractRealImageUrl(url: string): string {
    try {
        const u = new URL(url);
        const realUrl = u.searchParams.get("url");
        return realUrl ? decodeURIComponent(realUrl) : url;
    } catch (err) {
        if (process.env.NODE_ENV !== "production") console.debug("Invalid URL in extractRealImageUrl");
        return url;
    }
}

const ChatWrapper = () => {
    const params = useParams();
    const activeRoomId = params?.senderId;
    const {lang: currentLang} = useLanguage();
    const {localUser} = useMyUser();
    const { rooms, isLoading, error } = useChatRooms();

    const [searchQuery, setSearchQuery] = useState("");

    const filteredRooms = useMemo(() => {
        const list = rooms || [];
        const q = searchQuery.trim().toLowerCase();
        const filtered = q
            ? list.filter(r =>
                r.name.toLowerCase().includes(q) ||
                (r.lastMessage?.content || "").toLowerCase().includes(q)
              )
            : list;
        // Sort by lastMessage timestamp desc if exists
        return [...filtered].sort((a, b) => {
            const ta = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
            const tb = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
            return tb - ta;
        });
    }, [rooms, searchQuery]);

    return (
        <div className="max-w-[390px] flex flex-col border-r bg-white h-full">
            <div className="p-4 border-b">
                <div className="relative">
                    <p className="text-text-primary text-center font-semibold w-full py-2">Chat History</p>
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full mt-2 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="max-w-[390px] overflow-y-auto flex-1">
                {isLoading && filteredRooms.length === 0 && (
                    <p className="p-4 text-sm text-gray-500 text-center">Loading chats…</p>
                )}
                {error && filteredRooms.length === 0 && (
                    <p className="p-4 text-sm text-red-500 text-center">Failed to load chats</p>
                )}
                {filteredRooms?.map((room: ChatRoom) => {
                    const chatMessage = room.lastMessage;
                    const isActive = String(room.id) === activeRoomId;
                    const isUser = chatMessage ? (localUser?.id ?? -1) === Number(chatMessage.senderId) : false;

                    return (
                        <Link prefetch={false}
                              key={room.id}
                              href={`/chat/message/${room.id}`}
                              className="block"
                        >
                            <div
                                className={`p-4 flex items-start transition-colors cursor-pointer border-b ${
                                    isActive
                                        ? "border-l-4 border-third bg-blue-100 hover:bg-blue-100"
                                        : "hover:bg-gray-100 border-b-gray-200"
                                }`}
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                    <Image
                                        src={ProfileImage.avatar}
                                        alt="User"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="ml-3 min-w-0">
                                    <div className="flex items-center">
                                        <h4 className="font-medium text-sm text-text-primary truncate max-w-[200px]">
                                            {room.name}
                                        </h4>
                                        <span className="ml-2 text-xs text-gray-400">
                      {chatMessage?.timestamp ? formatMessageTime(
                          chatMessage.timestamp,
                          currentLang || "th"
                      ) : ""}
                    </span>
                                    </div>
                                    {chatMessage && (
                                        <p className="text-sm font-sans text-text-primary mt-1 line-clamp-1 overflow-hidden break-all max-w-[220px]">
                                            {isUser && "You: "}
                                            {chatMessage.content}
                                        </p>
                                    )}
                                </div>
                                {room.unreadCount > 0 && (
                                    <span className="ml-auto text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">
                                        {room.unreadCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
                {filteredRooms.length === 0 && !isLoading && !error && (
                    <p className="p-4 text-sm text-gray-500 text-center">No chats found</p>
                )}
            </div>
        </div>
    );
};

export default ChatWrapper;