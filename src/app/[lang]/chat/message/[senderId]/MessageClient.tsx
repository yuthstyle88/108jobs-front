"use client";

import { WebSocketProvider } from "@/contexts/RealtimeChatContext";
// import { useSession } from "next-auth/react";
import ChatSection from "../../_components/ChatSection";
import {useSessionContext} from "@/contexts/SessionContext";

export default function MessageClient({ senderId }: { senderId: string }) {
  // const { data: session, status } = useSession();
  const { session } = useSessionContext();
  if (status !== "authenticated" || !session?.accessToken) return null;

  return (
    <WebSocketProvider token={session.accessToken} partnerId={senderId}>
      <ChatSection />
    </WebSocketProvider>
  );
}
