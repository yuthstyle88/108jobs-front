import {LocalUserId} from "@/lib/lemmy-js-client/src";

export type WsMessageSender = (data: MessagePayload) => void | Promise<void>;

export interface MessagePayload {
    message: string;
    senderId: LocalUserId;
    id?: string;
}