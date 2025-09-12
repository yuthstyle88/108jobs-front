import { FlowActions, StatusKey } from '@/components/FreelanceChatFlow';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage as WsChatMessage } from 'lemmy-js-client';

export type CreateFlowActionsDeps = {
  t: (k: string) => string | undefined;
  goToStatus: (key: StatusKey) => void;
  setShowQuotationModal: (v: boolean) => void;
  setShowReviewModal: (v: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<WsChatMessage[]>>;
  sendMessage: (data: { message: string; id: string }) => void;
  handleFileUpload: (e: Event) => void;
  scrollContainerRef: React.RefObject<any>;
  currentRoom?: { roomId?: string | number } | null;
  roomId: string;
  localUser?: { id?: string | number | null } | null;
  setError: (msg: string) => void;
};

export function createFlowActions(deps: CreateFlowActionsDeps): FlowActions {
  const {
    t,
    goToStatus,
    setShowQuotationModal,
    setShowReviewModal,
    setMessages,
    sendMessage,
    handleFileUpload,
    scrollContainerRef,
    currentRoom,
    roomId,
    localUser,
  } = deps;

  return {
    onProposeQuote: () => {
      setShowQuotationModal(true);
    },
    onConfirmAssign: () => {
      const messageId = uuidv4();
      const readable = t('profileChat.confirmAssignMsg') || 'Assignment confirmed. Waiting for freelancer to accept.';
      const payload = { type: 'employer-assigned' } as any;

      setMessages((prev) => [
        {
          id: messageId,
          roomId: (currentRoom?.roomId as any) || roomId,
          content: readable,
          createdAt: new Date().toISOString(),
          senderId: Number((localUser as any)?.id) || 0,
          receiverId: roomId.includes(':') ? Number(roomId.split(':')[1]) || 0 : 0,
          status: 1,
          isOwner: true,
        } as unknown as WsChatMessage,
        ...prev,
      ]);

      sendMessage({ message: JSON.stringify(payload), id: messageId });

      try {
        const tsIso = new Date().toISOString();
        window.dispatchEvent(
          new CustomEvent('chat:new-message', {
            detail: { roomId, content: readable, senderId: Number((localUser as any)?.id) || 0, timestamp: tsIso },
          })
        );
      } catch {}

      goToStatus('OrderApproved');
    },
    onAcceptJob: () => {
      goToStatus('OrderApproved');
      const content = t('profileChat.acceptJobMsg') || 'I have accepted the job.';
      sendMessage({ message: content, id: uuidv4() });
      try {
        const tsIso = new Date().toISOString();
        window.dispatchEvent(
          new CustomEvent('chat:new-message', {
            detail: { roomId, content, senderId: Number((localUser as any)?.id) || 0, timestamp: tsIso },
          })
        );
      } catch {}
    },
    onUploadAsset: () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = (e) => handleFileUpload(e as any);
      input.click();
    },
    onSendMessage: () => {
      const input = (scrollContainerRef.current as any)?.querySelector('input');
      if (input) input.focus();
    },
    onSubmitDelivery: () => {
      goToStatus('PendingEmployerReview');
      setShowReviewModal(true);
    },
    onRequestRevision: () => {
      goToStatus('InProgress');
    },
    onReleasePayment: () => {
      goToStatus('Completed');
    },
    onCancel: () => {
      goToStatus('Cancelled');
    },
  };
}
