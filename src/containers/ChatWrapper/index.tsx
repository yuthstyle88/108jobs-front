"use client";

import { ProfileImage } from "@/constants/images";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatMessageTime } from "@/utils/formatMessageTime";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { useChatRooms } from "@/contexts/ChatRoomsContext";
import type { ChatRoom } from "@/types/chat";

const ChatWrapper = () => {
    const params = useParams();
    // In this route, the dynamic segment is [roomId], not senderId
    const activeRoomId = (params as any)?.roomId as string | undefined;
    const { lang: currentLang } = useLanguage();
    const { localUser } = useMyUser();
    const { rooms, isLoading, error } = useChatRooms();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Toggle state for mobile

    const filteredRooms = useMemo(() => {
        const list = rooms || [];
        const q = searchQuery.trim().toLowerCase();
        const filtered = q
            ? list.filter(
                (r) =>
                    r.name.toLowerCase().includes(q) ||
                    (r.lastMessage?.content || "").toLowerCase().includes(q)
            )
            : list;
        // Preserve provider order to avoid index shifting; only filter here
        return filtered;
    }, [rooms, searchQuery]);

    return (
        <>
            {/* Toggle Button for Mobile */}
            <button
                className="md:hidden fixed top-24 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? "Close" : "Chats"}
            </button>
            <div
                className={`flex flex-col border-r bg-white transition-all duration-300 ${
                    isSidebarOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
                } md:translate-x-0 md:pointer-events-auto fixed md:static top-[80px] left-0 h-[calc(100vh-80px)] w-80 md:w-1/4 lg:w-1/5 max-w-md z-40 overflow-hidden shadow-md md:shadow-none`}
            >
                <div className="p-4 border-b">
                    <div className="relative">
                        <p className="text-text-primary text-center font-semibold w-full py-2 text-base md:text-lg">
                            Chat History
                        </p>
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full mt-2 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    {isLoading && filteredRooms.length === 0 && (
                        <p className="p-4 text-sm text-gray-500 text-center">
                            Loading chats…
                        </p>
                    )}
                    {error && filteredRooms.length === 0 && (
                        <p className="p-4 text-sm text-red-500 text-center">
                            Failed to load chats
                        </p>
                    )}
                    {filteredRooms?.map((room: ChatRoom) => {
                        const chatMessage = room.lastMessage;
                        const isActive = String(room.id) === activeRoomId;
                        const isUser = chatMessage
                            ? (localUser?.id ?? -1) === Number(chatMessage.senderId)
                            : false;

                        return (
                            <Link prefetch={false} key={room.id} href={`/${currentLang || 'th'}/chat/message/${room.id}`} className="block">
                                <div
                                    className={`p-3 md:p-4 flex items-start transition-colors cursor-pointer border-b ${
                                        isActive
                                            ? "border-l-4 border-third bg-blue-100 hover:bg-blue-100"
                                            : "hover:bg-gray-100 border-b-gray-200"
                                    }`}
                                >
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                        <Image
                                            src={ProfileImage.avatar}
                                            alt="User"
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="ml-2 md:ml-3 min-w-0 flex-1">
                                        <div className="flex items-center">
                                            <h4 className="font-medium text-sm md:text-base text-text-primary truncate max-w-[150px] md:max-w-[200px]">
                                                {room.name}
                                            </h4>
                                            <span className="ml-2 text-xs text-gray-400">
                        {chatMessage?.timestamp
                            ? formatMessageTime(chatMessage.timestamp, currentLang || "th")
                            : ""}
                      </span>
                                        </div>
                                        {chatMessage && (
                                            <p className="text-xs md:text-sm font-sans text-text-primary mt-1 line-clamp-1 overflow-hidden break-all max-w-[180px] md:max-w-[220px]">
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
                        <p className="p-4 text-sm text-gray-500 text-center">
                            No chats found
                        </p>
                    )}
                </div>
            </div>
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    );
};

export default ChatWrapper;