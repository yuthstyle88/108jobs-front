"use client";
import React from "react";
import type {ChatRoom} from "@/types/chat";
import type {LocalUser} from "lemmy-js-client";
import Link from "next/link";
import {useChatRooms} from "@/contexts/ChatRoomsContext";

interface ChatListItemProps {
    room: ChatRoom;
    isActive: boolean;
    currentLang: string;
    localUser?: Pick<LocalUser, "id"> | null;
}

function ChatListItemComponent({room, isActive, currentLang}: ChatListItemProps) {
    const {markRoomRead} = useChatRooms();

    const handleClick = () => {
        try {
            markRoomRead(String(room.id));
        } catch {
        }
    };

    // Parse room name to extract partner name and job ID
    const [partnerName = "Unknown", jobId = ""] = (room.name || "?").split(":Job ");
    // Generate initials from partner name (first two characters or first letter)
    const initials = partnerName
        .split(" ")
        .map((w) => w.charAt(0))
        .slice(0, 2)
        .join("") || partnerName.charAt(0) || "?";

    const roomIdNum = parseInt(room.id.slice(0, 8), 16) || 0;
    const gradientIndex = roomIdNum % 4;
    // Define gradients as inline styles to avoid Tailwind issues
    const gradients = [
        {from: '#3B82F6', to: '#6366F1'}, // blue to indigo
        {from: '#8B5CF6', to: '#A78BFA'}, // purple to violet
        {from: '#0D9488', to: '#06B6D4'}, // teal to cyan
        {from: '#EC4899', to: '#F43F5E'}  // pink to rose
    ];
    const selectedGradient = gradients[gradientIndex];
    const avatarStyle = {
        background: `linear-gradient(to bottom right, ${selectedGradient.from}, ${selectedGradient.to})`
    };

    return (
        <Link
            prefetch={false}
            key={room.id}
            href={`/${currentLang || "th"}/chat/message/${room.id}`}
            className="block focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 rounded-lg mx-1.5 my-1 transition-all duration-200 hover:scale-[1.01] border border-black"
            aria-label={`Open chat with ${partnerName} about Job ${jobId}`}
            onClick={handleClick}
        >
            <div
                className={`group p-3 sm:p-4 flex items-center gap-3 rounded-lg bg-gray-100 ${
                    isActive
                        ? "bg-blue-50 border-l-4 border-blue-600 shadow-md"
                        : "hover:bg-gray-50 hover:shadow-sm"
                } transition-all duration-200`}
            >
                {/* Avatar */}
                <div
                    className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center flex-shrink-0 ring-2 ring-gray-100 shadow-sm group-hover:ring-blue-200 transition-all duration-200"
                    style={avatarStyle}
                >
                    <span className="text-sm sm:text-base font-semibold select-none">{initials.toUpperCase()}</span>
                </div>
                {/* Room Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-0.5">
                        <h4
                            className="font-semibold text-sm sm:text-base text-gray-900 truncate max-w-[160px] sm:max-w-[220px] group-hover:text-blue-600 transition-colors duration-200"
                            title={partnerName}
                        >
                            {partnerName}
                        </h4>
                        {jobId && (
                            <p
                                className="text-xs font-semibold text-blue-600 bg-blue-100 rounded px-1 py-0.5 truncate max-w-[160px] sm:max-w-[220px]"
                                title={`Job ${jobId}`}
                            >
                                Job ID: <span className="text-primary font-bold">{jobId}</span>
                            </p>
                        )}
                    </div>
                </div>
                {/* Unread Badge */}
                {room.unreadCount > 0 && (
                    <span
                        className="ml-auto text-xs bg-blue-600 group-hover:bg-blue-700 text-white rounded-full px-2.5 py-1 font-medium shadow-sm transform group-hover:scale-105 transition-all duration-200"
                    >
            {room.unreadCount}
          </span>
                )}
            </div>
        </Link>
    );
}

ChatListItemComponent.displayName = "ChatListItem";

const ChatListItem = React.memo(ChatListItemComponent);

export default ChatListItem;