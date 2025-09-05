"use client";

import {ProfileImage} from "@/constants/images";
import Image, {StaticImageData} from "next/image";

interface ChatHeaderProps {
  avatarUrl: StaticImageData | string;
  displayName: string;
  guideText: string;
  onToggleFlow?: () => void; // mobile toggle for right sidebar
  isFlowOpen?: boolean; // state for label
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  avatarUrl,
  displayName,
  onToggleFlow,
  isFlowOpen,
}) => {
  return (
    <div className="sticky top-0 z-10 border-b p-4 flex justify-between items-center bg-white">
      <div className="flex items-center gap-2">
        <Image
          src={avatarUrl || ProfileImage.avatar}
          alt="User"
          width={40}
          height={40}
          className="w-10 h-10 object-cover rounded-full"
        />
        <span className="text-sm font-medium text-text-primary">
          {displayName}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {/* Mobile: toggle Flow in header; User Guide moved to right sidebar */}
        <button
          onClick={onToggleFlow}
          className="block md:hidden whitespace-nowrap rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2"
        >
          {isFlowOpen ? "Hide Flow" : "Show Flow"}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
