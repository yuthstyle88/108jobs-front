// Thin indirection layer around unread store to decouple consumers from store implementation
// Consumers should import from '@/chat' instead of '@/stores/unreadStore'

import { useUnreadStore as baseStore } from '@/stores/unreadStore';

export const useUnreadStore = baseStore;

export function useTotalUnread(): number {
  return baseStore((s) => s.total);
}

export function useUnreadActions() {
  return {
    inc: baseStore((s) => s.inc),
    reset: baseStore((s) => s.reset),
    clearAll: baseStore((s) => s.clearAll),
    markSeen: baseStore((s) => s.markSeen),
  };
}
