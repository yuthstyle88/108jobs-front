import MessageClient from "./MessageClient";

export default async function ChatMessage({
  params,
}: {
  params: Promise<{senderId: string}>;
}) {
  const {senderId} = await params;

  return (
    <MessageClient senderId={senderId}/>
  );
}
