"use client";

import {ProfileImage} from "@/constants/images";
import {useLanguage} from "@/contexts/LanguageContext";
import {ChatResponse} from "@/types/chat";
import {formatMessageTime} from "@/utils/formatMessageTime";
import Image from "next/image";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {dmRoomId} from "@/utils/helpers";

// Fake chat data
const fakeChatData = [
    {
        roomId: dmRoomId(2, 3),
        partnerDisplayName: "John Doe",
        partnerAvatar: "https://example.com/avatar1.jpg",
        lastMessage: {
            senderId: "1",
            content: "Hey, how's the project going?",
            createdAt: "2025-08-29T10:30:00Z",
        },
        job: { id: "1" }
    },
    {
        roomId: dmRoomId(1, 2),
        partnerDisplayName: "Jane Smith",
        partnerAvatar: "https://example.com/avatar2.jpg",
        lastMessage: {
            senderId: "2",
            content: "Can we schedule a meeting?",
            createdAt: "2025-08-29T09:15:00Z",
        },
        job: { id: "2" }
    },
    {
        roomId: dmRoomId(1, 3),
        partnerDisplayName: "Alex Johnson",
        partnerAvatar: "https://example.com/avatar3.jpg",
        lastMessage: {
            senderId: "3",
            content: "I sent you the documents",
            createdAt: "2025-08-28T16:20:00Z",
        },
        job: { id: "3" }
    }
];

function extractRealImageUrl(url: string): string {
    try {
        const u = new URL(url);
        const realUrl = u.searchParams.get("url");
        return realUrl ? decodeURIComponent(realUrl) : url;
    } catch (err) {
        console.log("err", err);
        return url;
    }
}

const ChatWrapper = () => {
    const params = useParams();
    const router = useRouter();
    const activeRoomId = params?.senderId;
    const {lang: currentLang} = useLanguage();
    const {localUser} = useMyUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredChats, setFilteredChats] = useState<ChatResponse[]>(fakeChatData);

    // Filter chats based on search query
    useEffect(() => {
        const filtered = fakeChatData.filter((chat) =>
            chat.partnerDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredChats(filtered);
    }, [searchQuery]);

    return (
        <div className="max-w-[390px] flex flex-col border-r bg-white h-full">
            <div className="p-4 border-b">
                <div className="relative">
                    <p className="text-text-primary text-center font-semibold w-full py-2">Chat History</p>
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full mt-2 p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="max-w-[390px] overflow-y-auto flex-1">
                {filteredChats?.map((chat) => {
                    const chatMessage = chat.lastMessage;
                    if (!chatMessage) return null;
                    const senderId = Number(chatMessage.senderId);
                    const isUser = (localUser?.id ?? -1) === senderId;
                    const isActive = String(chat.roomId) === activeRoomId

                    return (
                        <Link prefetch={false}
                              key={chat.roomId}
                              href={`/chat/message/${chat.roomId}`}
                              className="block"
                        >
                            <div
                                className={`p-4 flex items-start transition-colors cursor-pointer border-b ${
                                    isActive
                                        ? "border-l-4 border-third bg-blue-100 hover:bg-blue-100"
                                        : "hover:bg-gray-100 border-b-gray-200"
                                }`}
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                    <Image
                                        src={
                                            extractRealImageUrl(chat.partnerAvatar) ||
                                            ProfileImage.avatar
                                        }
                                        alt="User"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="ml-3">
                                    <div className="flex items-center">
                                        <h4 className="font-medium text-sm text-text-primary">
                                            {chat.partnerDisplayName}
                                        </h4>
                                        <span className="ml-2 text-xs text-gray-400">
                      {formatMessageTime(
                          chatMessage.createdAt,
                          currentLang || "th"
                      )}
                    </span>
                                    </div>
                                    <p className="text-sm font-sans text-text-primary mt-1 line-clamp-1 overflow-hidden break-all max-w-[200px]">
                                        {isUser && "You: "}
                                        {chatMessage.content}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
                {filteredChats.length === 0 && (
                    <p className="p-4 text-sm text-gray-500 text-center">No chats found</p>
                )}
            </div>
        </div>
    );
};

export default ChatWrapper;