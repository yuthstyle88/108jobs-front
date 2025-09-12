"use client";
import React from "react";
import type {ChatRoom} from "@/types/chat";
import type {LocalUser} from "@/lib/lemmy-js-client/src/types/LocalUser";
import Link from "next/link";
import Image from "next/image";
// last message preview removed
import {useChatRooms} from "@/contexts/ChatRoomsContext";

interface ChatListItemProps {
  room: ChatRoom;
  isActive: boolean;
  currentLang: string;
  localUser?: Pick<LocalUser, "id"> | null;
}

function ChatListItemComponent({ room, isActive, currentLang, localUser }: ChatListItemProps) {
  // last message removed; no preview or timestamp
  const { markRoomRead } = useChatRooms();


  const handleClick = () => {
    try {
      // Only mark as read when user selects the room; do not reorder the list on click
      markRoomRead(String(room.id));
    } catch {}
  };

  const initials = (room.name || "?")
    .split(" ")
    .map((w) => w.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      prefetch={false}
      key={room.id}
      href={`/${currentLang || "th"}/chat/message/${room.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg mx-2"
      aria-label={`Open chat with ${room.name}`}
      onClick={handleClick}
    >
      <div
        className={`group p-3 md:p-4 flex items-center gap-3 transition-all border-b ${
          isActive
            ? "bg-blue-50 border-l-4 border-blue-500"
            : "hover:bg-gray-50 border-b-gray-200"
        }`}
      >
        <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 ring-2 ring-blue-100 shadow-sm">
          <span className="text-xs md:text-sm font-semibold select-none">{initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-sm md:text-base text-gray-800 truncate max-w-[150px] md:max-w-[200px] group-hover:text-blue-700">
              {room.name}
            </h4>
            <span className="text-[10px] md:text-xs text-gray-400 flex-shrink-0">•</span>
          </div>
        </div>
        {room.unreadCount > 0 && (
          <span className="ml-auto text-[10px] md:text-xs bg-primary group-hover:bg-[#063a68] text-white rounded-full px-2 py-0.5 font-medium shadow-sm">
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