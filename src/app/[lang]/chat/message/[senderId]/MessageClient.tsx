"use client";

import { WebSocketProvider } from "@/contexts/RealtimeChatContext";
import { useSession } from "next-auth/react";
import ChatSection from "../../_components/ChatSection";

export default function MessageClient({ senderId }: { senderId: string }) {
  const { data: session, status } = useSession();
  if (status !== "authenticated" || !session?.accessToken) return null;

  return (
    <WebSocketProvider token={session.accessToken} partnerId={senderId}>
      <ChatSection />
    </WebSocketProvider>
  );
}
