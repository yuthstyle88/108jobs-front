"use client";

import React from "react";
import AvatarBadge from "@/components/AvatarBadge";
import {useChatRoomsContext} from "@/core/chat/contexts/ChatRoomsContext";
import {ChatRoomId} from "@/lib/lemmy-js-client/src";

interface ChatHeaderProps {
    avatarUrl?: string;
    displayName: string;
    roomId: ChatRoomId;
    typingText?: string;
    onToggleFlow?: () => void;
    isFlowOpen?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
                                                   avatarUrl,
                                                   displayName,
                                                   typingText,
                                                   roomId,
                                                   onToggleFlow,
                                                   isFlowOpen,
                                               }) => {
    const {peerPresence} = useChatRoomsContext();
    const online = peerPresence?.[String(roomId)] ?? false;

    return (
        <div className="sticky top-0 z-10 border-b p-4 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
                <AvatarBadge
                    name={displayName}
                    avatarUrl={avatarUrl}
                    online={online}
                    isActive
                    size={48}
                />
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-primary truncate max-w-[160px]">
                        {displayName}
                    </span>
                    {typingText && (
                        <span className="text-xs text-gray-500">{typingText}</span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleFlow}
                    className="block md:hidden whitespace-nowrap rounded-md bg-primary hover:bg-[#063a68] text-white text-xs px-3 py-2"
                >
                    {isFlowOpen ? "Hide Flow" : "Show Flow"}
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
