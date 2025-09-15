import MessageClient from "./MessageClient";

export default async function ChatMessage({
  params,
}: {
  params: any;
}) {
  return (
    <MessageClient roomId={params.roomId}/>
  );
}
