import {API_ROUTES} from "@/api/endpoints";
import {usePrivateFetch} from "@/hooks/api-hooks";
import {ChatResponse} from "@/types/chat";
import {faComment} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import { useUnreadStore } from "@/stores/unreadStore";
import { useEffect } from "react";

const ChatBadge = () => {
  const { localUser } = useMyUser();
  const {
    data: chatData,
    isLoading: isChatLoading,
  } = usePrivateFetch<ChatResponse[]>(API_ROUTES.chat.getChatHistory, {
    dedupingInterval: 10000,
  });

  // Compute unread count from store only; last message is no longer used
  const myId = Number(localUser?.id) || 0;
  const totalUnread = useUnreadStore((s) => s.total);
  const unreadCount = totalUnread;

  // Hydrate unread snapshot from API once if store is empty (no longer possible without lastMessage) -> noop
  const hydrate = useUnreadStore((s) => s.hydrate);
  useEffect(() => {
    // Without lastMessage data from API, we cannot infer unread from header; rely on store events
  }, [isChatLoading, chatData, hydrate, myId, totalUnread]);

  // In header, avoid rendering spinners or error blocks; just show the icon and badge when available
  if (isChatLoading) return (
    <Link prefetch={false} href="/chat" className="relative text-white text-sm px-3">
      <FontAwesomeIcon icon={faComment} className="w-[24px] h-[24px] text-white" />
    </Link>
  );

  return (
    <Link prefetch={false}
          href="/chat"
          className="relative text-white text-sm hover:text-white px-3"
    >
      <FontAwesomeIcon
        icon={faComment}
        className="w-[24px] h-[24px] text-white"
      />
      {unreadCount > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 text-[12px] leading-[20px] text-white bg-red-500 rounded-full flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default ChatBadge;
