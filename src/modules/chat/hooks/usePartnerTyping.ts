// src/modules/chat/hooks/usePartnerTyping.ts
// hooks/usePartnerTyping.ts
// Single-partner typing indicator with auto-decay, filtered by room and self user id.
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatRoomId, LocalUserId } from 'lemmy-js-client';
import { CHAT_EVENT } from '@/modules/chat/events';

export type TypingEvent = { roomId: ChatRoomId; senderId: LocalUserId; typing: boolean };

type Options = {
  channel: { on?: (e: string, cb: (p: any) => void) => void; off?: (e: string, cb?: (p: any) => void) => void } | null | undefined;
  roomId: ChatRoomId;
  localUserId: LocalUserId | number;
  decayMs?: number; // auto-off if no explicit stop
  onRemoteTyping?: (evt: TypingEvent) => void;
  dispatchDomEvent?: (name: string, detail: any) => void; // optional DOM bridge
};

export function usePartnerTyping(opts: Options) {
  const { channel, roomId, localUserId, decayMs = 2000, onRemoteTyping, dispatchDomEvent } = opts;
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const decayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDecay = useCallback(() => {
    if (decayRef.current) {
      try { clearTimeout(decayRef.current); } catch {}
      decayRef.current = null;
    }
  }, []);

  const armDecay = useCallback((senderId: number) => {
    clearDecay();
    decayRef.current = setTimeout(() => {
      setIsPartnerTyping(false);
      dispatchDomEvent?.('chat:partner-typing', { roomId, senderId, typing: false });
    }, decayMs);
  }, [clearDecay, decayMs, dispatchDomEvent, roomId]);

  // Primary: listen to adapter/channel if available
  useEffect(() => {
    if (!channel || typeof channel.on !== 'function') return;

    const me = Number(localUserId) || 0;
    const handle = (p: any) => {
      const evt: TypingEvent = {
        roomId: p?.roomId as ChatRoomId,
        senderId: Number(p?.senderId) as LocalUserId,
        typing: Boolean(p?.typing),
      };
      if (!evt.roomId || !evt.senderId) return;
      if (String(evt.roomId) !== String(roomId)) return;
      if (Number(evt.senderId) === me) return; // ignore self

      if (!evt.typing) {
        setIsPartnerTyping(false);
        clearDecay();
        dispatchDomEvent?.('chat:partner-typing', { roomId, senderId: Number(evt.senderId) || 0, typing: false });
        onRemoteTyping?.(evt);
        return;
      }

      // typing = true
      setIsPartnerTyping(true);
      dispatchDomEvent?.('chat:partner-typing', { roomId, senderId: Number(evt.senderId) || 0, typing: true });
      armDecay(Number(evt.senderId) || 0);
      onRemoteTyping?.(evt);
    };

    channel.on?.('chat:typing', handle);
    return () => channel.off?.('chat:typing', handle);
  }, [channel, roomId, localUserId, armDecay, clearDecay, onRemoteTyping, dispatchDomEvent]);

  // Fallback: listen to unified DOM typing event emitted by handleWSMessage
  useEffect(() => {
    const me = Number(localUserId) || 0;
    const onDomTyping = (e: Event) => {
      const anyEvt = e as CustomEvent<any>;
      const d = anyEvt?.detail ?? {};
      const evt: TypingEvent = {
        roomId: d?.roomId as ChatRoomId,
        senderId: Number(d?.senderId) as LocalUserId,
        typing: Boolean(d?.typing),
      };
      if (!evt.roomId || !evt.senderId) return;
      if (String(evt.roomId) !== String(roomId)) return;
      if (Number(evt.senderId) === me) return; // ignore self

      if (!evt.typing) {
        setIsPartnerTyping(false);
        clearDecay();
        dispatchDomEvent?.('chat:partner-typing', { roomId, senderId: Number(evt.senderId) || 0, typing: false });
        onRemoteTyping?.(evt);
        return;
      }

      setIsPartnerTyping(true);
      dispatchDomEvent?.('chat:partner-typing', { roomId, senderId: Number(evt.senderId) || 0, typing: true });
      armDecay(Number(evt.senderId) || 0);
      onRemoteTyping?.(evt);
    };

    try {
      window.addEventListener(CHAT_EVENT.TYPING as any, onDomTyping as any);
      document?.addEventListener?.(CHAT_EVENT.TYPING as any, onDomTyping as any);
    } catch {}
    return () => {
      try {
        window.removeEventListener(CHAT_EVENT.TYPING as any, onDomTyping as any);
        document?.removeEventListener?.(CHAT_EVENT.TYPING as any, onDomTyping as any);
      } catch {}
    };
  }, [roomId, localUserId, armDecay, clearDecay, onRemoteTyping, dispatchDomEvent]);

  // Cleanup on unmount
  useEffect(() => () => { clearDecay(); }, [clearDecay]);

  return { isPartnerTyping } as const;
}