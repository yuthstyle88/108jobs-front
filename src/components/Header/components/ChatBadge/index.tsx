import {faComment} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {useUnreadStore} from "@/stores/unreadStore";
import {useEffect, useRef} from "react";
import {usePathname} from "next/navigation";

const ChatBadge = () => {
    // Compute unread count from store
    const totalUnread = useUnreadStore((s) => s.total);
    const incUnread = useUnreadStore((s) => s.inc);
    const unreadCount = totalUnread;
    const pathname = usePathname();

    // Listen globally for chat:new-message when user is outside chat pages
    useEffect(() => {
        if (typeof window === "undefined") return;
        const onNewMessage = (e: Event) => {
            try {
                const detail = (e as CustomEvent).detail as { roomId: string; senderId: number; unread?: boolean } | undefined;
                if (!detail) return;
                // Avoid double-counting when on chat pages where ChatRoomsContext already updates unread
                const isOnChatRoute = typeof pathname === 'string' && pathname.startsWith('/chat');
                if (isOnChatRoute) return;
                if (detail.unread === true && detail.roomId) {
                    incUnread(detail.roomId, 1);
                }
            } catch {}
        };
        window.addEventListener('chat:new-message' as any, onNewMessage as any);
        return () => window.removeEventListener('chat:new-message' as any, onNewMessage as any);
    }, [pathname, incUnread]);

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
