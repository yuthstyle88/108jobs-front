"use client";

import { API_ROUTES } from "@/api/endpoints";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import LoadingBlur from "@/components/LoadingBlur";
import { ProfileImage } from "@/constants/images";
import { useChatLanguage } from "@/contexts/ChatLanguage";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { ChatResponse } from "@/types/chat";
import { ProfileData } from "@/types/userData";
import { formatMessageTime } from "@/utils/formatMessageTime";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

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
  const { languageData: chatLanguageData } = useChatLanguage();
  const { lang: currentLang } = useLanguage();

  const {
    data: userData,
    isLoading: isUserLoading,
    error: isUserError,
  } = usePrivateFetch<ProfileData>(API_ROUTES.profile.get_profile);

  const {
    data: chatData,
    isLoading: isChatLoading,
    error: chatError,
  } = usePrivateFetch<ChatResponse[]>(API_ROUTES.chat.get_chat_history, {
    revalidateOnFocus: true,
    dedupingInterval: 10000,
  });

  useEffect(() => {
    if (!isChatLoading && !activeRoomId && chatData && chatData.length > 0) {
      const firstSenderId = chatData[0]?.partner_id;
      if (firstSenderId) {
        router.replace(`/chat/message/${firstSenderId}`);
      }
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

  if (isUserLoading || isChatLoading) return <Loading />;
  if (isUserError || chatError) return <Error />;

  return (
    <div
      style={{ maxWidth: "340px" }}
      className="max-w-[340px] flex flex-col border-r bg-white h-full"
    >
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder={chatLanguageData?.search_placeholder}
            className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:border-fastwork-blue"
          />
          <Search
            size={18}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      <div className="max-w-[340px] overflow-y-auto flex-1">
        {chatData?.map((chat) => {
          const chatMessage = chat.last_message;
          if (!chatMessage) return null;

          const isUser = userData?.user.id === chatMessage.sender_id;
          const isActive = String(chat.job.id) === activeRoomId;
          return (
            <Link
              key={chat.room_id}
              href={`/chat/message/${chat.job.id}`}
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
                      extractRealImageUrl(chat.partner_avatar) ||
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
                    <h4 className="font-medium text-sm text-text_primary">
                      {chat.partner_display_name}
                    </h4>
                    <span className="ml-2 text-xs text-gray-400">
                      {formatMessageTime(
                        chatMessage.created_at,
                        currentLang || "th"
                      )}
                    </span>
                  </div>
                  <p className="text-sm font-sans text-text_primary mt-1 line-clamp-1 overflow-hidden break-all max-w-[200px]">
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
