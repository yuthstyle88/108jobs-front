"use client";

import Error from "@/app/[lang]/error";
import Loading from "@/components/Loading";
import LoadingBlur from "@/components/LoadingBlur";
import {ProfileImage} from "@/constants/images";
import {useLanguage} from "@/contexts/LanguageContext";
// import {usePrivateFetch} from "@/hooks/api-hooks"; // ⛔️ bỏ khi mock
import {ChatResponse} from "@/types/chat";
import {formatMessageTime} from "@/utils/formatMessageTime";
import Image from "next/image";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import { mockChatData } from "@/mocks/chatMock";

/** Keep helper */
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
  const activeRoomId = params?.senderId as string | undefined;
  const {lang: currentLang} = useLanguage();
  const {localUser} = useMyUser();

  // ---- Mock fetch state ----
  const [chatData, setChatData] = useState<ChatResponse[] | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [chatError, setChatError] = useState<Error | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        setChatData(mockChatData);
      } catch (e) {
        setChatError(e as Error);
      } finally {
        setIsChatLoading(false);
      }
    }, 800); 

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isChatLoading && !activeRoomId && chatData && chatData.length > 0) {
      const firstRoomId = chatData[0]?.roomId;
      if (firstRoomId) router.replace(`/chat/message/${firstRoomId}`);
    }
  }, [isChatLoading, chatData, activeRoomId, router]);

  useEffect(() => {
    if (!isChatLoading && chatData && chatData.length === 0) {
      router.push("/chat/no-message");
    }
  }, [isChatLoading, chatData, router]);

  if (!activeRoomId && (!chatData || isChatLoading)) {
    return <LoadingBlur text="" />;
  }

  if (!activeRoomId && chatData && chatData.length > 0) {
    return null;
  }

  if (isChatLoading) return <Loading />;
  if (chatError) return <Error />;

  return (
    <div
      style={{ maxWidth: "340px" }}
      className="max-w-[340px] flex flex-col border-r bg-white h-full"
    >
      <div className="p-4 border-b">
        <div className="relative">
          <p className="text-text-primary text-center font-semibold w-full py-2 ">
            Chat History
          </p>
        </div>
      </div>

      <div className="max-w-[340px] overflow-y-auto flex-1">
        {chatData?.map((chat) => {
          const chatMessage = chat.lastMessage;
          if (!chatMessage) return null;

          const senderIdNum = Number(chatMessage.senderId);
          const isUser = (localUser?.id ?? -1) === senderIdNum;
          const isActive =
            String(chat.roomId) === activeRoomId ||
            String(chat.job?.id) === activeRoomId;

          return (
            <Link
              prefetch={false}
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
      </div>
    </div>
  );
};

export default ChatWrapper;
