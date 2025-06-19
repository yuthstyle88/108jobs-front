"use client";

import { ProfileImage } from "@/constants/images";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface ChatHeaderProps {
  avatarUrl: StaticImageData | string;
  displayName: string;
  guideText: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  avatarUrl,
  displayName,
  guideText,
}) => {
  return (
    <div className="border-b p-4 flex justify-between items-center bg-white">
      <div className="flex items-center gap-2">
        <Image
          src={avatarUrl || ProfileImage.avatar}
          alt="User"
          width={40}
          height={40}
          className="w-10 h-10 object-cover rounded-full"
        />
        <span className="text-sm font-medium text-text_primary">
          {displayName}
        </span>
      </div>
      <Link
        href="#"
        className="text-third hover:bg-gray-100 text-[14px] px-4 py-2 rounded-sm border border-border_primary"
      >
        {guideText}
      </Link>
    </div>
  );
};

export default ChatHeader;
