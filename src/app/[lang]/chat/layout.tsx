"use client";

import React, {useState} from "react";
import Header from "@/components/Header";
import SpHeader from "@/containers/SpHeader";
import {ChatLanguageProvider} from "@/contexts/ChatLanguage";
import {LayoutProps} from "@/types/layout";
import {ChatRoomsProvider} from "@/modules/chat/contexts/ChatRoomsContext";
import {WebSocketProvider} from "@/modules/chat/contexts/WebSocketContext";
import {UserService} from "@/services/UserService";
import {useParams} from "next/navigation";
import ChatWrapper from "@/containers/ChatWrapper";
import {dbg} from "@/modules/chat/utils";

function decodeJwtSub(token?: string | null): number {
    try {
        if (!token) return 0;
        const parts = token.split(".");
        if (parts.length < 2) return 0;
        const payload = JSON.parse(typeof atob === 'function' ? atob(parts[1]) : Buffer.from(parts[1], 'base64').toString('utf-8'));
        return Number(payload?.sub) || 0;
    } catch {
        return 0;
    }
}

function resolveSenderId(token: string | null | undefined): number {
    // 1) Primary: myUserInfo.localUserView.localUser.id
    const id1 = Number((UserService as any)?.Instance?.myUserInfo?.localUserView?.localUser?.id) || 0;
    if (id1) return id1;
    // 2) Secondary: authInfo.localUser.id
    const id2 = Number((UserService as any)?.Instance?.authInfo?.localUser?.id) || 0;
    if (id2) return id2;
    // 3) Tertiary: decode from JWT `sub`
    const id3 = decodeJwtSub(token);
    if (id3) return id3;
    // 4) Last resort: try cached localStorage if app store it
    try {
        const cache = localStorage.getItem('local_user_id');
        const id4 = Number(cache) || 0;
        if (id4) return id4;
    } catch {
    }
    return 0;
}


export default function ProfileLayout({children}: LayoutProps) {
    const params = useParams();
    const activeRoomId = params?.roomId as string;
    const token = UserService.Instance.auth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [senderId, setSenderId] = React.useState<number>(() => resolveSenderId(token));
    React.useEffect(() => {
        const now = resolveSenderId(token);
        if (now && now !== senderId) setSenderId(now);
        if (!now && token) {
            // Retry lazily once; some apps hydrate myUserInfo after mount
            const t = setTimeout(() => {
                const again = resolveSenderId(token);
                if (again && again !== senderId) setSenderId(again);
            }, 300);
            return () => clearTimeout(t);
        }
    }, [token]);

    return (
      <ChatLanguageProvider>
        {/* Headers remain outside providers so they always render */}
        <div className="hidden sm:block fixed top-0 left-0 right-0 z-50">
          <Header type="primary" />
        </div>
        <div className="block sm:hidden fixed top-0 left-0 right-0 z-50">
          <SpHeader
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
            showBackButton={true}
          />
        </div>

        {/* Main Content: fix viewport height and prevent page scroll */}
        <div className="fixed top-16 sm:top-20 left-0 right-0 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] overflow-hidden">
          <div className="flex h-full">
            {senderId ? (
              <WebSocketProvider
                options={{ token, senderId, roomId: activeRoomId }}
              >
                <ChatRoomsProvider>
                  {/* Left Sidebar (desktop) */}
                  <div className="hidden md:flex md:flex-col md:w-64 lg:w-80 xl:w-96 border-r border-gray-200 h-full">
                    <ChatWrapper
                      isSidebarOpen={isSidebarOpen}
                      onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                      setIsSidebarOpen={setIsSidebarOpen}
                    />
                  </div>

                  {/* Mobile Sidebar Overlay (slides from left) */}
                  <div
                    className={`md:hidden fixed left-0 top-16 sm:top-20 h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] w-[80vw] sm:w-[70vw] max-w-[360px] bg-white border-r border-gray-200 z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Chat rooms"
                  >
                    <ChatWrapper
                      isSidebarOpen={isSidebarOpen}
                      onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                      setIsSidebarOpen={setIsSidebarOpen}
                    />
                  </div>
                  {/* Mobile Backdrop */}
                  {isSidebarOpen && (
                    <div
                      className="md:hidden fixed inset-0 bg-black/40 z-40"
                      onClick={() => setIsSidebarOpen(false)}
                      aria-hidden="true"
                    />
                  )}

                  {/* Main Content */}
                  <div className="flex-1 min-w-0 h-full">{children}</div>
                </ChatRoomsProvider>
              </WebSocketProvider>
            ) : (
              <div className="flex-1 min-w-0 h-full">{/* waiting senderId */}</div>
            )}
          </div>
        </div>
      </ChatLanguageProvider>
    );
}