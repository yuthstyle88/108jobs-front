export type WsMessageSender = (data: { message: string; id: string }) => void | Promise<void>;
