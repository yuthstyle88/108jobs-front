import { useEffect } from 'react';
import { onReadReceipt } from '@/modules/chat/events/chatEvents';
import { useReadLastIdStore } from '@/modules/chat/store/readLastIdStore';

/**
 * Hook to listen for read receipt events and update the readLastIdStore
 * This fixes the missing connection between WebSocket read receipts and the store
 */
export function useReadReceiptListener() {
    const { setPeerLastReadAt } = useReadLastIdStore();

    useEffect(() => {
        // Set up the read receipt event listener
        const unsubscribe = onReadReceipt((detail) => {
            const { roomId, lastMessageId, readerId } = detail;
            
            try {
                // Update the peer's last read timestamp
                // Use current timestamp since we know they read up to lastMessageId at this moment
                const currentTimestamp = new Date().toISOString();
                setPeerLastReadAt(roomId, readerId, currentTimestamp);
                
                // Optional: Add debug logging
                if (localStorage.getItem('chat_debug') === '1') {
                    console.log('[useReadReceiptListener] Updated peer read status:', {
                        roomId,
                        readerId,
                        lastMessageId
                    });
                }
            } catch (error) {
                console.warn('[useReadReceiptListener] Failed to update peer read status:', error);
            }
        });

        // Cleanup listener on unmount
        return unsubscribe;
    }, [setPeerLastReadAt]);
}