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

  // Compute unread rooms where the last message is from the partner and marked unread (status === 0)
  const myId = Number(localUser?.id) || 0;
  const totalUnread = useUnreadStore((s) => s.total);
  // Fallback compute from API if store has not yet hydrated anything
  const computedFromApi = (chatData || []).reduce((acc, room) => {
    const lm = (room as any)?.lastMessage;
    if (!lm) return acc;
    const isFromPartner = Number(lm.senderId) !== myId;
    const isUnread = Number(lm.status) === 0;
    return acc + (isFromPartner && isUnread ? 1 : 0);
  }, 0);
  const unreadCount = totalUnread > 0 ? totalUnread : computedFromApi;

  // Hydrate unread snapshot from API once if store is empty
  const hydrate = useUnreadStore((s) => s.hydrate);
  useEffect(() => {
    if (isChatLoading) return;
    if (!chatData || chatData.length === 0) return;
    if (totalUnread > 0) return;
    const snap: Record<string, number> = {};
    for (const room of chatData || []) {
      const lm: any = (room as any).lastMessage;
      if (!lm) continue;
      const fromPartner = Number(lm.senderId) !== myId;
      const unread = Number(lm.status) === 0;
      const rid = String((room as any).roomId || (room as any).id || "");
      if (!rid) continue;
      snap[rid] = fromPartner && unread ? 1 : 0;
    }
    try { hydrate(snap); } catch {}
  }, [isChatLoading, chatData, hydrate, myId, totalUnread]);

  // In header, avoid rendering spinners or error blocks; just show the icon and badge when available
  if (isChatLoading) return (
    <Link prefetch={false} href="/chat" className="relative text-white text-sm hover:bg-blue-800 hover:text-white px-3">
      <FontAwesomeIcon icon={faComment} className="w-[24px] h-[24px] text-white" />
    </Link>
  );

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
          className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 text-[12px] leading-[20px] text-white bg-red-500 rounded-full flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default ChatBadge;
