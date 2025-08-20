import Error from "@/app/[lang]/error";
import Loading from "@/components/Loading";
import { mockChatData } from "@/mocks/chatMock";
import { ChatResponse } from "@/types/chat";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";


const ChatBadge = () => {
  const [chatData, setChatData] = useState<ChatResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatError, setChatError] = useState<Error | null>(null);

  useEffect(() => {
    // Fake API call
    const timer = setTimeout(() => {
      try {
        setChatData(mockChatData);
        setIsLoading(false);
      } catch (err) {
        setChatError(err as Error);
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const unreadCount = chatData?.length || 0;

  if (isLoading) return <Loading />;
  if (chatError) return <Error />;

  return (
    <Link
      prefetch={false}
      href="/chat"
      className="relative text-white text-sm hover:bg-blue-800 hover:text-white px-3"
    >
      <FontAwesomeIcon
        icon={faComment}
        className="w-[24px] h-[24px] text-white"
      />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 text-[14px] leading-[16px] text-white bg-red-500 rounded-full flex items-center justify-center">
          {chatData && chatData.length > 9 ? "9+" : chatData?.length}
        </span>
      )}
    </Link>
  );
};

export default ChatBadge;
