import {API_ROUTES} from "@/api/endpoints";
import Error from "@/app/[lang]/error";
import Loading from "@/components/Loading";
import {usePrivateFetch} from "@/hooks/api-hooks";
import {ChatResponse} from "@/types/chat";
import {faComment} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";

const ChatBadge = () => {
  const {
    data: chatData,
    isLoading: isChatLoading,
    error: chatError,
  } = usePrivateFetch<ChatResponse[]>(API_ROUTES.chat.getChatHistory,
    {
      dedupingInterval: 10000,
    });
  const unreadCount = chatData?.length || 0;
  if (isChatLoading) return <Loading/>;
  if (chatError) return <Error/>;
  return (
    <Link prefetch={false}
          href="/chat"
          className="relative text-white text-sm hover:bg-blue-800 hover:text-white px-3"
    >
      <FontAwesomeIcon
        icon={faComment}
        className="w-[24px] h-[24px] text-white"
      />
      {unreadCount > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 text-[14px] leading-[16px] text-white bg-red-500 rounded-full flex items-center justify-center">
          {chatData && chatData.length > 9 ? "9+" : chatData?.length}
        </span>
      )}
    </Link>
  );
};

export default ChatBadge;
