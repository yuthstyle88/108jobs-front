import React from "react";
import type {ChatRoom} from "@/types/chat";
import type {LocalUser} from "@/lib/lemmy-js-client/src/types/LocalUser";
import Link from "next/link";
import Image from "next/image";
import {ProfileImage} from "@/constants/images";
import {formatMessageTime} from "@/utils/formatMessageTime";
import {formatLastMessagePreview} from "@/utils/formatLastMessagePreview";

interface ChatListItemProps {
  room: ChatRoom;
  isActive: boolean;
  currentLang: string;
  localUser?: Pick<LocalUser, "id"> | null;
}

function ChatListItemComponent({ room, isActive, currentLang, localUser }: ChatListItemProps) {
  const chatMessage = room.lastMessage;
  const isUser = chatMessage ? (localUser?.id ?? -1) === Number(chatMessage.senderId) : false;

  return (
    <Link
      prefetch={false}
      key={room.id}
      href={`/${currentLang || "th"}/chat/message/${room.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md mx-2"
      aria-label={`Open chat with ${room.name}`}
    >
      <div
        className={`p-3 md:p-4 flex items-start transition-colors border-b ${
          isActive ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-gray-50 border-b-gray-200"
        }`}
      >
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden ring-2 ring-gray-300">
          <Image src={ProfileImage.avatar} alt={room.name} width={40} height={40} className="w-full h-full object-cover" />
        </div>
        <div className="ml-2 md:ml-3 min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm md:text-base text-gray-800 truncate max-w-[150px] md:max-w-[200px]">{room.name}</h4>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {chatMessage?.timestamp ? formatMessageTime(chatMessage.timestamp, currentLang || "th") : ""}
            </span>
          </div>
          {chatMessage && (
            <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-1 break-all max-w-[180px] md:max-w-[220px]">
              {isUser && <span className="font-medium">You: </span>}
              {formatLastMessagePreview(chatMessage.content)}
            </p>
          )}
        </div>
        {room.unreadCount > 0 && (
          <span className="ml-auto text-xs bg-blue-600 text-white rounded-full px-2 py-0.5 font-medium">{room.unreadCount}</span>
        )}
      </div>
    </Link>
  );
}

ChatListItemComponent.displayName = "ChatListItem";

const ChatListItem = React.memo(ChatListItemComponent);

export default ChatListItem;