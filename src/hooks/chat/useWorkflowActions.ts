import {useCallback} from 'react';
import {v4 as uuidv4} from 'uuid';
import {REQUEST_STATE, HttpService} from '@/services/HttpService';
import {resolveWorkflowId} from '@/utils/chat/workflow';
import {getLatestProposedQuotePayload, getLatestProposedQuoteSeq} from '@/utils/chat/message';
import type {ApproveQuotationForm, CreateInvoiceForm} from 'lemmy-js-client';
import type {WsMessageSender} from '@/utils/chat/types';
import type {StatusKey} from '@/components/FreelanceChatFlow';
import {dispatchPreview, sendStructuredMessage} from '@/utils/chat/structured';

// Helper to extract meaningful error messages from wrapped HttpService responses
function extractErr(res: any, fallback: string) {
    const msg = res?.err?.message
        || res?.data?.error?.message
        || res?.data?.message
        || res?.data?.error
        || (Array.isArray(res?.data?.errors) ? res?.data?.errors[0] : undefined)
        || res?.data?.detail
        || '';
    return typeof msg === 'string' && msg.trim().length > 0 ? String(msg) : fallback;
}

// Deps the hook requires. Keep it flexible and explicit.
export type UseWorkflowActionsDeps = {
    // data and state
    messages: any[];
    roomData: any;
    workflowIdState: number | null;
    localUser?: { id?: number | string } | null;
    roomId: string;
    selectedFile: { fileUrl: string; fileType: string; fileName: string } | null;

    // ui state setters and helpers
    setError: (msg: string | null) => void;
    t: (key: string) => string | undefined;
    addOwnMessage: (content: string, id?: string) => string | void;
    sendMessage: WsMessageSender;
    goToStatus?: (status: StatusKey) => void;
    setHasStarted: (v: boolean) => void;
    setWorkflowIdState: (v: number | null) => void;
    setShowQuotationModal: (v: boolean) => void;
    setSelectedFile: (v: any) => void;

    // permissions
    canSend: boolean;
    disabledReason?: string | null;

    // apis
    createInvoice: (form: CreateInvoiceForm) => Promise<any>;
    startWorkflow: (form: { postId: number; seqNumber: number; roomId: string }) => Promise<any>;
    approveQuotationApi: (form: ApproveQuotationForm) => Promise<any>;
    submitStartWorkApi: (form: any) => Promise<any>;
    approveWorkApi: (form: any) => Promise<any>;

    // misc
    postId?: number | string | null;

    // wallet
    walletId?: number | null;
};

export const useWorkflowActions = (deps: UseWorkflowActionsDeps) => {
    const {
        messages,
        roomData,
        workflowIdState,
        localUser,
        roomId,
        selectedFile,
        setError,
        t,
        addOwnMessage,
        sendMessage,
        goToStatus,
        setHasStarted,
        setWorkflowIdState,
        setShowQuotationModal,
        setSelectedFile,
        canSend,
        disabledReason,
        createInvoice,
        startWorkflow,
        approveQuotationApi,
        submitStartWorkApi,
        approveWorkApi,
        postId,
        walletId
    } = deps;

    const startWorkflowAction = useCallback(async () => {
        setError(null);
        try {
            const pid = (postId ?? (roomData?.room?.room?.postId ?? roomData?.room?.post?.id ?? roomData?.postId ?? roomData?.room?.postId)) as any;
            if (!pid) {
                setError(t('profileChat.missingPostIdForQuotation') || 'This chat is not linked to a post. You cannot create a quotation.');
                return false;
            }
            const seqNumber = 1;
            const res = await startWorkflow({postId: pid, seqNumber, roomId});
            if (res?.state === REQUEST_STATE.SUCCESS && res?.data?.success) {
                setHasStarted(true);
                const wfId = Number(res?.data?.workflowId);
                if (wfId) setWorkflowIdState(wfId);
                const readable =
                    t('profileChat.proposeQuoteMsg');
                const payload = { type: 'employer-started' } as any;
                const sentId = await sendStructuredMessage(sendMessage, roomId, payload, {
                    senderId: Number(localUser?.id) || 0,
                    previewText: readable
                });
                addOwnMessage(JSON.stringify(payload), sentId);
                goToStatus?.('QuotationPending');
                return true;
            } else {
                setError(
                    t('profileChat.startWorkflowFailed') || extractErr(res, 'Failed to start workflow. Please try again.')
                );
                return false;
            }
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(t('profileChat.startWorkflowFailed') || `Failed to start workflow: ${msg}`);
            return false;
        }
    }, [postId, roomData, startWorkflow, roomId, setHasStarted, setWorkflowIdState, goToStatus, t]);

    const quotationSubmit = useCallback(async (data: any) => {
        if (!canSend) {
            setError(disabledReason || null);
            setShowQuotationModal(false);
            return false;
        }
        setError(null);
        try {
            const form: CreateInvoiceForm = {
                employerId: data.partnerId,
                postId: data.postId,
                commentId: data.commentId,
                seqNumber: 1,
                amount: data.amount,
                proposal: data.proposal,
                projectName: data.projectName,
                status: 'QuotePendingReview',
                projectDetails: data.projectDetails,
                workingDays: data.workingDays,
                deliverables: data.deliverables,
                note: data.note ?? undefined,
                startingDay: data.startingDay,
                deliveryDay: data.deliveryDay,
            } as any;

            const res = await createInvoice(form as any);
            if (res?.state !== REQUEST_STATE.SUCCESS) {
                setError(t('profileChat.quotationError') || 'Failed to create invoice. Please try again.');
                return false;
            }

            const createdBillingId = res?.data?.billingId;

            const readable =
                t('profileChat.proposeQuoteMsg') || `Proposed quotation: ${data.projectName} - $${Number(data.amount).toFixed(2)}`;
            const payload = {type: 'proposed-quote', quote: data, billingId: createdBillingId} as any;

            const sentId = await sendStructuredMessage(sendMessage, roomId, payload, {
                senderId: Number(localUser?.id) || 0,
                previewText: readable
            });
            addOwnMessage(JSON.stringify(payload), sentId);

            goToStatus?.('QuotationPending');
            setShowQuotationModal(false);
            return true;
        } catch (err) {
            setError(t('profileChat.quotationError') || 'Failed to send quotation. Please try again.');
            return false;
        }
    }, [canSend, disabledReason, createInvoice, goToStatus, localUser?.id, roomId, setShowQuotationModal, t]);

    const approveQuotation = useCallback(async () => {
        try {
            setError(null);
            // Resolve billing id: try latest proposed-quote payload else fetch by comment id
            let billingId: number | undefined = getLatestProposedQuotePayload(messages as any)?.billingId;

            if (!billingId) {
                const latestPayload: any = getLatestProposedQuotePayload(messages as any);
                const commentIdFromPayload = Number(latestPayload?.quote?.commentId);
                const commentId = !Number.isNaN(commentIdFromPayload) && commentIdFromPayload
                    ? commentIdFromPayload
                    : Number(roomData?.room?.currentComment?.id ?? roomData?.currentCommentId ?? undefined);
                if (!commentId || Number.isNaN(commentId)) {
                    setError(t('profileChat.quotationError') || 'Missing billing information for approval.');
                    return false;
                }
                try {
                    const res = await HttpService.client.getBillingByComment({commentId});
                    if (res?.state === REQUEST_STATE.SUCCESS && (res as any)?.data) {
                        const billing = (res as any).data as any;
                        billingId = Number(billing?.id);
                    }
                } catch {
                    // fallthrough
                }
            }

            if (!billingId || Number.isNaN(billingId)) {
                setError(t('profileChat.quotationError') || 'Missing billing information for approval.');
                return false;
            }

            const workflowId = resolveWorkflowId(roomData as any, workflowIdState as any);
            if (!workflowId) {
                setError(t('profileChat.startWorkflowFailed') || 'Missing workflow. Start workflow before approval.');
                return false;
            }

            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const form: ApproveQuotationForm = {seqNumber, billingId, walletId: walletId, workflowId} as any;
            const res = await approveQuotationApi(form as any);
            if (res?.state === REQUEST_STATE.FAILED) {
                if ((res as any)?.err?.name === 'insufficientBalanceForTransfer') {
                    setError((res as any)?.err?.message);
                }
            }
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean(res?.data?.success);
            if (!ok) {
                setError(extractErr(res, 'Failed to approve quotation.'));
                return false;
            }

            const payload = {type: 'employer-assigned'} as any;
            const readable = t('profileChat.approveQuotation') || 'Approve quotation';
            const sentId = await sendStructuredMessage(sendMessage, roomId, payload, {
                senderId: Number(localUser?.id) || 0,
                previewText: readable
            });
            addOwnMessage(JSON.stringify(payload), sentId);

            goToStatus?.('OrderApproved');
            return true;
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [messages, roomData, workflowIdState, approveQuotationApi, localUser?.id, roomId, t]);

    const startWork = useCallback(async () => {
        try {
            setError(null);
            const workflowId = resolveWorkflowId(roomData as any, workflowIdState as any);
            if (!workflowId) {
                setError(t('profileChat.startWorkflowFailed') || 'Missing workflow. Start workflow before starting work.');
                return false;
            }
            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const form: any = {
                seqNumber,
                workflowId,
                workDescription: t('profileChat.startWorkMsg') || 'Freelancer started work.'
            };
            const res = await submitStartWorkApi(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean(res?.data?.success);
            if (!ok) {
                setError(extractErr(res, 'Failed to start work.'));
                return false;
            }
            const payload = {type: 'start-work'} as any;
            const readable = t('profileChat.startWork') || 'Start work';
            const id = uuidv4();
            addOwnMessage(JSON.stringify(payload), id);
            await sendMessage({id, message: JSON.stringify(payload)});
            dispatchPreview({roomId, content: readable, senderId: Number(localUser?.id) || 0});
            goToStatus?.('InProgress');
            return true;
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [messages, roomData, workflowIdState, submitStartWorkApi, t, roomId, localUser?.id]);

    const submitDelivery = useCallback(async () => {
        try {
            setError(null);
            if (!canSend) {
                setError(disabledReason || null);
                return false;
            }
            if (!selectedFile || !selectedFile.fileUrl) {
                setError(t('profileChat.attachFileFirst') || 'Please attach a file before submitting delivery.');
                return false;
            }
            const workflowId = resolveWorkflowId(roomData as any, workflowIdState as any);
            if (!workflowId) {
                setError(t('profileChat.startWorkflowFailed') || 'Missing workflow. Start workflow before submitting delivery.');
                return false;
            }
            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const form: any = {
                seqNumber,
                workflowId,
                workDescription: t('profileChat.submitDeliveryMsg') || 'Freelancer submitted a delivery.',
                deliverableUrl: selectedFile.fileUrl,
            };
            const res = await HttpService.client.submitWork(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean(res?.data?.success);
            if (!ok) {
                setError(extractErr(res, 'Failed to submit delivery.'));
                return false;
            }

            const payload: any = {
                type: 'submit-delivery',
                url: selectedFile.fileUrl,
                name: selectedFile.fileName,
                mime: selectedFile.fileType
            };
            const id = uuidv4();
            addOwnMessage(JSON.stringify(payload), id);
            await sendMessage({id, message: JSON.stringify(payload)});
            const preview = `[Delivery] ${selectedFile.fileName}`;
            dispatchPreview({roomId, content: preview, senderId: Number(localUser?.id) || 0});

            setSelectedFile(null);
            goToStatus?.('PendingEmployerReview');
            return true;
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [canSend, disabledReason, messages, roomData, workflowIdState, selectedFile, localUser?.id, roomId, t, setSelectedFile]);

    const requestRevision = useCallback(async () => {
        try {
            setError(null);
            if (!canSend) {
                setError(disabledReason || t('profileChat.cannotPerformAction') || 'You cannot perform this action right now.');
                return false;
            }
            const workflowId = resolveWorkflowId(roomData as any, workflowIdState as any);
            if (!workflowId) {
                setError(t('profileChat.startWorkflowFailed') || 'Missing workflow. Start workflow before requesting revision.');
                return false;
            }
            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const reason = t('profileChat.requestRevisionMsg') || 'Please revise and resubmit.';
            const form: any = {seqNumber, workflowId, reason};
            const res = await HttpService.client.requestRevision(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean(res?.data?.success);
            if (!ok) {
                setError(extractErr(res, 'Failed to request revision.'));
                return false;
            }
            const payload: any = {type: 'request-revision', reason};
            const id = uuidv4();
            addOwnMessage(JSON.stringify(payload), id);
            await sendMessage({id, message: JSON.stringify(payload)});
            dispatchPreview({roomId, content: reason, senderId: Number(localUser?.id) || 0});
            goToStatus?.('InProgress');
            return true;
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [canSend, disabledReason, messages, roomData, workflowIdState, t, roomId, localUser?.id]);

    const approveWork = useCallback(async () => {
        try {
            setError(null);
            if (!canSend) {
                setError(disabledReason || t('profileChat.cannotPerformAction') || 'You cannot perform this action right now.');
                return false;
            }
            const workflowId = resolveWorkflowId(roomData as any, workflowIdState as any);
            if (!workflowId) {
                setError(t('profileChat.startWorkflowFailed') || 'Missing workflow. Start workflow before approval.');
                return false;
            }
            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const commentId = Number(roomData?.room?.currentComment?.id ?? roomData?.currentCommentId ?? undefined);
            if (!commentId || Number.isNaN(commentId)) {
                setError('Missing delivery reference for approval.');
                return false;
            }
            const form: any = {seqNumber, workflowId, commentId};
            const res = await approveWorkApi(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean(res?.data?.success);
            if (!ok) {
                setError(extractErr(res, 'Failed to approve work.'));
                return false;
            }
            const id = uuidv4();
            const payload = {type: 'delivery-accepted'} as any;
            addOwnMessage(JSON.stringify(payload), id);
            await sendMessage({id, message: JSON.stringify(payload)});
            const content = t('profileChat.deliveryAccepted') || 'Delivery accepted. Proceed to payment.';
            dispatchPreview({roomId, content, senderId: Number(localUser?.id) || 0});
            goToStatus?.('Completed');
            return true;
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [canSend, disabledReason, messages, roomData, workflowIdState, approveWorkApi, t, roomId, localUser?.id]);

    const cancelJob = useCallback(async () => {
        try {
            if (!canSend) {
                setError(disabledReason || t('profileChat.cannotPerformAction') || 'You cannot perform this action right now.');
                return false;
            }
            const workflowId = resolveWorkflowId(roomData as any, workflowIdState as any);
            if (!workflowId) {
                setError(t('profileChat.startWorkflowFailed') || 'Missing workflow. Start workflow before cancelling.');
                return false;
            }
            const seqNumber = getLatestProposedQuoteSeq(messages as any, 1);
            const form: any = {seqNumber, workflowId};
            const res = await HttpService.client.cancelJob(form as any);
            const ok = res?.state === REQUEST_STATE.SUCCESS && Boolean(res?.data?.success);
            if (!ok) {
                setError(extractErr(res, 'Failed to cancel job.'));
                return false;
            }
            const id = uuidv4();
            const readable = t('profileChat.cancelledJobMsg') || 'The job has been cancelled.';
            addOwnMessage(readable, id);
            await sendMessage({id, message: JSON.stringify({type: 'cancel-job'})});
            dispatchPreview({roomId, content: readable, senderId: Number(localUser?.id) || 0});
            goToStatus?.('Cancelled');
            return true;
        } catch (e: any) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            setError(msg);
            return false;
        }
    }, [canSend, disabledReason, messages, roomData, workflowIdState, roomId, localUser?.id, t]);

    return {
        startWorkflowAction,
        quotationSubmit,
        approveQuotation,
        startWork,
        submitDelivery,
        requestRevision,
        approveWork,
        cancelJob,
    } as const;
};

export type UseWorkflowActionsReturn = ReturnType<typeof useWorkflowActions>;
