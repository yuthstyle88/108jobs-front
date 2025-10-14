"use client";

import React, {useState} from "react";
import AvatarBadge from "@/components/AvatarBadge";
import {ChatRoomId, LocalUserId} from "lemmy-js-client";
import ChatWrapper from "@/containers/ChatWrapper";
import {List} from "lucide-react";
import {usePeerOnline} from "@/modules/chat/store/presenceStore";

interface ChatHeaderProps {
    avatarUrl?: string;
    displayName: string;
    roomId: ChatRoomId;
    partnerId?: LocalUserId;
    typingText?: string;
    onToggleFlow?: () => void;
    isFlowOpen?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
                                                   avatarUrl,
                                                   displayName,
                                                   typingText,
                                                   roomId,
                                                   partnerId,
                                                   onToggleFlow,
                                                   isFlowOpen,
                                               }) => {
    const online = usePeerOnline(partnerId ? Number(partnerId) : 0) ?? false;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const onToggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    return (
        <>
            {/* ✅ Header Bar */}
            <div className="sticky top-0 z-20 border-b p-4 flex justify-between items-center bg-white">
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

                    <button
                        onClick={onToggleSidebar}
                        aria-label={isSidebarOpen ? "Close chat list" : "Open chat list"}
                        className="hidden sm:flex md:hidden bg-primary text-white p-2 rounded-full"
                    >
                        <List className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="hidden sm:block md:hidden">
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-40 bg-black bg-opacity-30">
                        <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-lg overflow-y-auto">
                            <ChatWrapper
                                isSidebarOpen={isSidebarOpen}
                                onToggleSidebar={onToggleSidebar}
                                setIsSidebarOpen={setIsSidebarOpen}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ChatHeader;
