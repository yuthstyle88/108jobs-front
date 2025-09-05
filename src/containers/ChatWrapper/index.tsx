"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useParams } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { useChatRooms } from "@/contexts/ChatRoomsContext";
import type { ChatRoom } from "@/types/chat";
import { debounce } from "lodash";
import React from "react";
import ChatListItem from "@/app/[lang]/chat/_components/ChatListItem";

const ChatWrapper = () => {
    const params = useParams();
    const activeRoomId = params?.roomId as string | undefined;
    const { lang: currentLang } = useLanguage();
    const { localUser } = useMyUser();
    const { rooms, isLoading, error, refresh } = useChatRooms();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Debounce search input to prevent excessive re-renders
    const debouncedSetSearchQuery = useCallback(
        debounce((value: string) => setSearchQuery(value), 300),
        []
    );

    // Memoized filtered rooms to optimize search performance
    const filteredRooms = useMemo(() => {
        const list = rooms || [];
        const q = searchQuery.trim().toLowerCase();
        return q
            ? list.filter(
                (r) =>
                    r.name.toLowerCase().includes(q) ||
                    (r.lastMessage?.content || "").toLowerCase().includes(q)
            )
            : list;
    }, [rooms, searchQuery]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetSearchQuery(e.target.value);
    };

    // Toggle sidebar with accessibility
    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <>
            {/* Toggle Button for Mobile */}
            <button
                className="md:hidden fixed top-16 sm:top-20 left-3 sm:left-4 z-50 p-2 sm:p-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors min-w-[40px] min-h-[40px]"
                onClick={toggleSidebar}
                aria-label={isSidebarOpen ? "Close chat sidebar" : "Open chat sidebar"}
            >
                {isSidebarOpen ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Sidebar */}
            <div
                className={`flex flex-col bg-white border-r border-gray-200 shadow-lg md:shadow-none transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                } fixed top-16 sm:top-20 left-0 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] w-[80vw] sm:w-[70vw] md:w-64 lg:w-80 xl:w-96 max-w-[360px] z-40 overflow-y-auto md:static md:max-w-none md:h-auto md:flex-[0_0_20%] lg:flex-[0_0_25%]`}
            >
                {/* Header with Search */}
                <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 text-center">
                        Chat History
                    </h2>
                    <input
                        type="text"
                        placeholder="Search chats..."
                        defaultValue={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full mt-2 sm:mt-3 p-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow bg-white"
                        aria-label="Search chat rooms"
                    />
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading && filteredRooms.length === 0 && (
                        <p className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500 text-center">
                            Loading chats…
                        </p>
                    )}
                    {filteredRooms.map((room: ChatRoom) => (
                        <ChatListItem
                            key={room.id}
                            room={room}
                            isActive={String(room.id) === activeRoomId}
                            currentLang={currentLang || "th"}
                            localUser={localUser}
                        />
                    ))}
                    {filteredRooms.length === 0 && !isLoading && !error && (
                        <p className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500 text-center">
                            No chats found
                        </p>
                    )}
                </div>
            </div>

            {/* Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-30"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}
        </>
    );
};

export default React.memo(ChatWrapper);