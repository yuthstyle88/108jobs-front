"use client";

import {ProfileImage} from "@/constants/images";
import Image, {StaticImageData} from "next/image";
import React from "react";

interface ChatHeaderProps {
    avatarUrl: StaticImageData | string;
    displayName: string;
    online: boolean;
    typingText?: string;
    onToggleFlow?: () => void; // mobile toggle for right sidebar
    isFlowOpen?: boolean; // state for label
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
                                                   avatarUrl,
                                                   displayName,
                                                   online,
                                                   typingText,
                                                   onToggleFlow,
                                                   isFlowOpen,
                                               }) => {
    return (
        <div className="sticky top-0 z-10 border-b p-4 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Image
                        src={avatarUrl || ProfileImage.avatar}
                        alt="User"
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-full"
                    />
                    {/* Global network status is not per-user presence; hide the dot to avoid confusion */}
                    <span
                        className={`absolute -bottom-1 -right-1 w-3 h-3 ${online ? "bg-green-500" : "bg-gray-400"} border-2 border-white rounded-full`}
                        aria-label={online ? "Online" : "Offline"}
                        title={online ? "Online" : "Offline"}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-primary">{displayName}</span>
                    {typingText ? (
                        <span className="text-xs text-gray-500">{typingText}</span>
                    ) : null}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {/* Mobile: toggle Flow in header; User Guide moved to right sidebar */}
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
