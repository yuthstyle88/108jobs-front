import MessageClient from "./MessageClient";

export default async function ChatMessage({
  params,
}: {
  params: Promise<{roomId: string}>;
}) {
  // const {roomId} = await params;
  const roomId = "fd6b6372a24778a3";
  console.log('ChatMessage params:', params); // ดูใน server log
  return (
    <MessageClient roomId={roomId}/>
  );
}
