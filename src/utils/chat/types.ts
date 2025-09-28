export type WsMessageSender = (data: { message: string; msg_ref_id: string }) => void | Promise<void>;
