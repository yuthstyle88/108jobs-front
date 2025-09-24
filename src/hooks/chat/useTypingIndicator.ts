import { useCallback, useEffect, useRef, useState } from 'react';

export const useTypingIndicator = (deps: { roomId: string }) => {
  const [isPartnerTyping, setIsPartnerTyping] = useState<boolean>(false);
  const partnerTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (partnerTypingTimeoutRef.current) {
        try { clearTimeout(partnerTypingTimeoutRef.current); } catch {}
        partnerTypingTimeoutRef.current = null;
      }
    };
  }, [deps.roomId]);

  const onRemoteTyping = useCallback((senderId: number, localUserId: number, typing: boolean) => {
    if (senderId === localUserId) return;
    setIsPartnerTyping(typing);
    if (partnerTypingTimeoutRef.current) {
      try { clearTimeout(partnerTypingTimeoutRef.current); } catch {}
      partnerTypingTimeoutRef.current = null;
    }
    if (typing) {
      partnerTypingTimeoutRef.current = setTimeout(() => setIsPartnerTyping(false), 5000);
    }
  }, []);

  return { isPartnerTyping, onRemoteTyping };
};
