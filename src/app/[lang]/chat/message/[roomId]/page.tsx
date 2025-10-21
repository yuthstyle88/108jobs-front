import MessageClient from "./MessageClient";

export default async function ChatMessage({
  params,
}: {
  params: Promise<{roomId: string}>;
}) {
  const {roomId} = await params;
  console.log('ChatMessage params:', params); // ดูใน server log
  return (
    <MessageClient roomId={roomId}/>
  );
}
