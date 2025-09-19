'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmActionModal from '@/components/ConfirmActionModal';
import { useWorkflowStepper } from '@/hooks/useWorkflowMachine';
import type { UiFlowStatus } from '@/stores/stateMachineStore';

export type StatusKey = UiFlowStatus;

export type FlowActions = {
    onProposeQuote?: () => void;
    onApproveQuotation?: () => void;
    onStartWork?: () => void;
    onUploadAsset?: () => void;
    onSendMessage?: () => void;
    onSubmitDelivery?: () => void;
    onRequestRevision?: () => void;
    onReleasePayment?: () => void;
    onCancel?: () => void;
};

export type FreelanceChatFlowProps = {
    currentStatus?: StatusKey;
    onChangeStatus?: (key: StatusKey) => void;
    orientation?: 'vertical' | 'horizontal';
    compact?: boolean;
    className?: string;
    started?: boolean;
    onStart?: () => void;
    canStartWorkflow?: boolean;
    canProposeQuote?: boolean;
    canApproveQuotation?: boolean;
    showStartButton?: boolean;
    isEmployer?: boolean;
} & FlowActions;

const STEPS: Array<{ key: StatusKey; title: string; sub: string }> = [
    { key: 'QuotationPending', title: 'Quotation Pending', sub: 'Quotation created by freelancer, waiting for employer review' },
    { key: 'OrderApproved', title: 'Order Approved', sub: 'Employer approved quotation, became an order, ready for invoice payment' },
    { key: 'InProgress', title: 'In Progress', sub: 'Employer paid invoice, money in escrow, waiting for work submission' },
    { key: 'PendingEmployerReview', title: 'Pending Employer Review', sub: 'Work submitted to employer; pending employer review before payment release' },
    { key: 'Completed', title: 'Completed', sub: 'Employer approved work, money released to freelancer' },
    { key: 'Cancelled', title: 'Cancelled', sub: 'Quotation/order cancelled before payment' },
];

const DOT_COLORS: Record<StatusKey, string> = {
    QuotationPending: 'bg-yellow-500 border-yellow-500',
    OrderApproved: 'bg-emerald-500 border-emerald-500',
    InProgress: 'bg-primary border-primary',
    PendingEmployerReview: 'bg-pink-500 border-pink-500',
    Completed: 'bg-green-600 border-green-600',
    Cancelled: 'bg-gray-400 border-gray-400',
};

const FreelanceChatFlow: React.FC<FreelanceChatFlowProps> = ({
                                                                 currentStatus: controlledStatus,
                                                                 onChangeStatus,
                                                                 orientation = 'vertical',
                                                                 compact = false,
                                                                 className = '',
                                                                 started = true,
                                                                 onStart,
                                                                 canStartWorkflow = true,
                                                                 canProposeQuote = true,
                                                                 canApproveQuotation = true,
                                                                 showStartButton = true,
                                                                 isEmployer = false,
                                                                 onProposeQuote,
                                                                 onApproveQuotation,
                                                                 onStartWork,
                                                                 onUploadAsset,
                                                                 onSendMessage,
                                                                 onSubmitDelivery,
                                                                 onRequestRevision,
                                                                 onReleasePayment,
                                                                 onCancel,
                                                             }) => {
    const [showStartConfirm, setShowStartConfirm] = useState(false);
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const { t } = useTranslation();
    const stepper = useWorkflowStepper();
    const derivedStatus = stepper?.state?.name as StatusKey | undefined;
    const isControlled = controlledStatus != null && onChangeStatus != null;
    const currentStatus: StatusKey = (isControlled ? controlledStatus! : (derivedStatus || 'QuotationPending')) as StatusKey;
    const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === currentStatus));

    const ORDER: StatusKey[] = (stepper?.ORDER as StatusKey[]) || ['QuotationPending', 'OrderApproved', 'InProgress', 'PendingEmployerReview', 'Completed', 'Cancelled'];

    const handleActivateStep = (toIndex: number, targetKey: StatusKey) => {
        const curIdx = currentIndex;
        const canAdjacent = toIndex === curIdx || Math.abs(toIndex - curIdx) === 1;
        if (canAdjacent) {
            if (isControlled) {
                onChangeStatus?.(targetKey);
            } else if (stepper && stepper.canGo(targetKey)) {
                const fromOrderIdx = ORDER.indexOf(currentStatus);
                const toOrderIdx = ORDER.indexOf(targetKey);
                if (toOrderIdx > fromOrderIdx) stepper.send({ type: 'NEXT' });
                if (toOrderIdx < fromOrderIdx) stepper.send({ type: 'BACK' });
            }
        }
    };

    // Action buttons for each step
    const actionsForStep = (key: StatusKey) => {
        const btn = (label: string, onClick?: () => void, kind: 'primary' | 'ghost' = 'primary') => (
            <button
                key={label}
                className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    kind === 'primary'
                        ? 'bg-primary text-white hover:bg-[#063a68] focus:ring-2 focus:ring-primary/50'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200'
                } ${!onClick ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
                onClick={onClick}
                disabled={!onClick}
            >
                {label}
            </button>
        );

        const cancelBtn = stepper?.canCancel && key !== 'Completed' && key !== 'Cancelled'
            ? btn(t('profileChat.cancelJob') || 'ยกเลิกงาน', () => setShowCancelConfirm(true), 'ghost')
            : null;

        switch (key) {
            case 'QuotationPending':
                const actionsQP: React.ReactElement[] = [];
                if (canProposeQuote) {
                    actionsQP.push(btn(t('profileChat.proposeQuote') || 'Send quotation', onProposeQuote));
                }
                if (canApproveQuotation) {
                    actionsQP.push(btn(t('profileChat.approveQuotation') || 'Approve quotation', () => setShowApproveConfirm(true)));
                }
                if (!canProposeQuote && !canApproveQuotation) {
                    actionsQP.push(
                        <div key="wait-approval" className="w-full text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2">
                            {t('profileChat.waitEmployerApproval') || 'Waiting for employer to approve your quotation'}
                        </div>
                    );
                }
                if (cancelBtn) actionsQP.push(cancelBtn);
                return actionsQP;
            case 'OrderApproved':
                return [
                    onStartWork ? btn(t('profileChat.startWork') || 'Start work', onStartWork) : null,
                    btn(t('profileChat.uploadDraft') || 'แนบไฟล์ต้นฉบับ', onUploadAsset),
                    ...(cancelBtn ? [cancelBtn] : []),
                ].filter(Boolean) as React.ReactElement[];
            case 'InProgress':
                if (isEmployer) {
                    return [
                        <div key="wait-freelancer" className="w-full text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
                            {t('profileChat.waitForFreelancerSubmit') || 'Waiting for the freelancer to submit their work.'}
                        </div>,
                        ...(cancelBtn ? [cancelBtn] : []),
                    ];
                }
                return [
                    btn(t('profileChat.uploadFileLink') || 'แนบไฟล์/ลิงก์', onUploadAsset),
                    btn(t('profileChat.submitDelivery') || 'ส่งงาน', onSubmitDelivery, 'ghost'),
                    ...(cancelBtn ? [cancelBtn] : []),
                ];
            case 'PendingEmployerReview':
                if (isEmployer) {
                    return [
                        btn(t('profileChat.requestRevision') || 'ขอแก้ไขรอบใหม่', onRequestRevision),
                        btn(t('profileChat.releasePayment') || 'ปล่อยเงิน/ปิดงาน', onReleasePayment, 'ghost'),
                        ...(cancelBtn ? [cancelBtn] : []),
                    ];
                }
                return [
                    <div key="wait-employer" className="w-full text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2">
                        {t('profileChat.waitForEmployerReview') || 'Your delivery was submitted. Waiting for employer review.'}
                    </div>,
                    ...(cancelBtn ? [cancelBtn] : []),
                ];
            case 'Completed':
                return [];
            case 'Cancelled':
                return [];
            default:
                return [];
        }
    };

    if (!started) {
        return (
            <aside className={`flex w-full h-full bg-white shadow-sm rounded-lg overflow-auto ${className}`}>
                <div className="flex-1 p-4 flex flex-col gap-3">
                    <p className="text-sm text-gray-600">
                        {t('profileChat.startWorkflowHint') || 'The workflow will be shown after the employer starts it.'}
                    </p>
                    {showStartButton && (
                        <button
                            className={`rounded-md px-4 py-2 text-sm font-medium ${canStartWorkflow ? 'bg-primary text-white hover:bg-[#063a68]' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                            onClick={canStartWorkflow ? (() => setShowStartConfirm(true)) : undefined}
                            aria-disabled={!canStartWorkflow}
                            disabled={!canStartWorkflow}
                            title={!canStartWorkflow ? (t('profileChat.missingPostIdForQuotation') || 'Link a job to start the workflow') : undefined}
                        >
                            {t('profileChat.startWorkflow') || 'Start workflow'}
                        </button>
                    )}
                </div>
                <ConfirmActionModal
                  isOpen={showStartConfirm}
                  onClose={() => setShowStartConfirm(false)}
                  onConfirm={() => {
                    setShowStartConfirm(false);
                    (onStart || onApproveQuotation)?.();
                  }}
                  title={t('profileChat.confirmStartWorkflowTitle') || 'Start workflow?'}
                  message={t('profileChat.confirmStartWorkflowMessage') || 'This will initialize the job flow for this chat.'}
                />
            </aside>
        );
    }

    return (
        <aside
            className={`flex w-full h-full bg-white shadow-sm rounded-lg overflow-auto ${
                orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'
            } ${compact ? 'space-y-2' : 'space-y-4'} ${className}`}
            aria-label="สถานะปัจจุบัน"
        >
            <ul
                className={`flex ${
                    orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col'
                } px-4 ${compact ? 'py-2' : 'py-4'}`}
            >
                {STEPS.map((step, index) => {
                    const isActive = step.key === currentStatus;
                    const isFuture = index > currentIndex;

                    return (
                        <li
                            key={step.key}
                            className={`flex items-center text-gray-600 ${
                                orientation === 'horizontal' ? 'min-w-[200px] max-w-[250px]' : 'w-full'
                            } ${compact ? 'py-1' : 'py-2'} ${
                                isActive ? 'font-semibold text-primary' : isFuture ? 'opacity-50 pointer-events-none' : ''
                            } hover:bg-gray-50 cursor-pointer transition-colors rounded-md px-2`}
                            onClick={() => handleActivateStep(index, step.key)}
                            role="button"
                            aria-current={isActive ? 'step' : undefined}
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleActivateStep(index, step.key);
                                }
                            }}
                        >
                            <div
                                className={`min-w-[24px] max-w-[24px] w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium text-white ${
                                    DOT_COLORS[step.key]
                                } ${isActive ? 'ring-2 ring-blue-200' : ''} mr-3 shrink-0`}
                            >
                                {index + 1}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium truncate">
                                    {t(`profileChat.step${index + 1}`) || step.title}
                                </span>
                                {!compact && (
                                    <span className="text-xs text-gray-500 line-clamp-2">
                                        {t(`profileChat.step${index + 1}Sub`) || step.sub}
                                    </span>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
            {currentStatus === 'QuotationPending' && isEmployer && !canProposeQuote && !canApproveQuotation && (
                <div className="mx-4 -mt-2 mb-2 p-2 sm:p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs sm:text-sm">
                    {t('profileChat.waitForFreelancerQuotation') || 'Waiting for freelancer to send a quotation.'}
                </div>
            )}
            <div className={`flex flex-col gap-2 px-4 ${compact ? 'pb-2' : 'pb-4'}`}>
                {actionsForStep(currentStatus).map((action, idx) => (
                    <div key={idx} className="w-full">
                        {action}
                    </div>
                ))}
            </div>
            <ConfirmActionModal
              isOpen={showApproveConfirm}
              onClose={() => setShowApproveConfirm(false)}
              onConfirm={async () => {
                setShowApproveConfirm(false);
                await onApproveQuotation?.();
              }}
              title={t('profileChat.confirmApproveQuotationTitle') || 'Approve quotation?'}
              message={t('profileChat.confirmApproveQuotationMessage') || 'This will approve the freelancer\'s quotation and convert it into an order.'}
              confirmText={t('profileChat.approveQuotation') || 'Approve quotation'}
            />
            <ConfirmActionModal
              isOpen={showCancelConfirm}
              onClose={() => setShowCancelConfirm(false)}
              onConfirm={async () => {
                setShowCancelConfirm(false);
                if (onCancel) {
                  await onCancel();
                } else if (stepper?.cancel) {
                  stepper.cancel();
                }
              }}
              title={t('profileChat.confirmCancelJobTitle') || 'Cancel this job?'}
              message={t('profileChat.confirmCancelJobMessage') || 'This will cancel the current workflow. This action cannot be undone.'}
              confirmText={t('profileChat.cancelJob') || 'Cancel job'}
            />
        </aside>
    );
};

export default FreelanceChatFlow;