import { useCallback, useRef } from 'react';
import type { StatusKey } from '@/components/FreelanceChatFlow';
import type { ChatMessage as WsChatMessage } from 'lemmy-js-client';
import { TYPES_TO_STATUS } from '@/utils/chat/workflowTypes';

export interface UseWorkflowStatusParams {
  currentStatus: StatusKey;
  setWorkflowState: (s: StatusKey) => void;
  hasStarted: boolean;
  setHasStarted: (b: boolean) => void;
  ORDER: readonly StatusKey[];
  send: (evt: { type: 'NEXT' | 'BACK' }) => void;
  canGo: (key: StatusKey) => boolean;
}

export const useWorkflowStatus = ({
  currentStatus,
  setWorkflowState,
  hasStarted,
  setHasStarted,
  ORDER,
  send,
  canGo,
}: UseWorkflowStatusParams) => {
  const lastRealtimeStatusAtRef = useRef<number>(0);

  const extractStatusFromContent = useCallback((raw: unknown): StatusKey | undefined => {
    if (typeof raw !== 'string') return undefined;
    const s = raw.trim();
    if (!s.startsWith('{')) return undefined;
    try {
      const j = JSON.parse(s);
      const type = j?.type as string | undefined;
      return type ? (TYPES_TO_STATUS as any)[type] as StatusKey | undefined : undefined;
    } catch {
      return undefined;
    }
  }, []);

  const tryUpdateStatusFromItems = useCallback((items: WsChatMessage[]) => {
    for (const it of items) {
      const target = extractStatusFromContent((it as any)?.content);
      if (target) {
        goToStatus(target);
        lastRealtimeStatusAtRef.current = Date.now();
        return true;
      }
    }
    return false;
  }, [extractStatusFromContent]);

  const scanMessagesForStatus = useCallback((msgs: any[], windowSize = 20): StatusKey | undefined => {
    const len = Math.min(msgs.length, windowSize);
    for (let i = 0; i < len; i++) {
      const m = msgs[i];
      const target = extractStatusFromContent(m?.content);
      if (target) return target;
    }
    return undefined;
  }, [extractStatusFromContent]);

  const goToStatus = useCallback((target: StatusKey) => {
    try {
      setWorkflowState(target);
      if (!hasStarted) setHasStarted(true);
    } catch {
      const targetIdx = ORDER.indexOf(target);
      let curIdx = ORDER.indexOf(currentStatus);
      while (curIdx < targetIdx) {
        send({ type: 'NEXT' });
        curIdx++;
      }
      while (curIdx > targetIdx) {
        send({ type: 'BACK' });
        curIdx--;
      }
      if (!hasStarted) setHasStarted(true);
    }
  }, [ORDER, currentStatus, hasStarted, send, setHasStarted, setWorkflowState]);

  const handleChangeStatus = useCallback((key: StatusKey) => {
    if (!canGo(key)) return;
    const curIdx = ORDER.indexOf(currentStatus);
    const toIdx = ORDER.indexOf(key);
    if (toIdx === curIdx) return;
    if (Math.abs(toIdx - curIdx) === 1) {
      return toIdx > curIdx ? send({ type: 'NEXT' }) : send({ type: 'BACK' });
    }
  }, [ORDER, canGo, currentStatus, send]);

  return {
    lastRealtimeStatusAtRef,
    extractStatusFromContent,
    tryUpdateStatusFromItems,
    scanMessagesForStatus,
    goToStatus,
    handleChangeStatus,
  };
};
