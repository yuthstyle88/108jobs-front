'use client';

/**
 * FreelanceChatFlow
 * -----------------------------------------------------------------------------
 * A compact, role-aware stepper for job workflow in chat rooms.
 * - Renders the current workflow step and context actions.
 * - Controlled via `currentStatus` or derives status from internal stepper.
 * - Shows employer / freelancer actions based on role & flags.
 *
 * NOTE: Keep behavior unchanged; this pass only improves structure and clarity.
 */

// =============================================================================
// Imports
// =============================================================================

import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import ConfirmActionModal from '@/components/Common/Modal/ConfirmActionModal';
import {useWorkflowStepper} from '@/hooks/useWorkflowMachine';
import type {UiFlowStatus} from '@/store/stateMachineStore';
import Link from 'next/link';
import FileUploadModal from '@/components/Common/Modal/FileUploadModal';
import {UploadedFile} from '@/hooks/chat/useFileUpload';


// =============================================================================
// Types & Props
// =============================================================================

export type StatusKey = UiFlowStatus;

/** UI-only status that can precede QuotationPending when no quotation exists yet */
type ViewStatus = StatusKey | 'WaitForFreelancerQuotation';

export type FlowActions = {
    /** Freelancer: open quotation composer / send quotation */
    onProposeQuote?: () => void;
    /** Employer: approve the received quotation */
    onApproveQuotation?: () => void;
    /** Freelancer: start work after order approved */
    onStartWork?: () => void;
    /** (Optional) Open upload asset flow */
    onUploadAsset?: () => void;
    /** (Optional) Fire a plain message to chat area */
    onSendMessage?: () => void;
    /** Freelancer: submit delivery */
    onSubmitDelivery?: () => void;
    /** Employer: request revision during review */
    onRequestRevision?: () => void;
    /** Employer: release escrow & close job */
    onReleasePayment?: () => void;
    /** Cancel the current job/workflow; receives previous status for audit */
    onCancel?: (prevStatus?: StatusKey) => void; // Updated to accept prevStatus
    /** File upload handler from modal */
    onFileUpload?: (e: Event) => void;
    /** Remove the selected file from modal */
    onFileRemove?: () => Promise<void>;
};

export type FreelanceChatFlowProps = {
    // ---- Control ----
    /** Controlled status; if provided, component becomes controlled */
    currentStatus?: StatusKey;
    /** Notify parent when user clicks a step (optional in controlled mode) */
    onChangeStatus?: (key: StatusKey, prevStatus?: StatusKey) => void; // Updated to accept prevStatus

    // ---- Appearance ----
    orientation?: 'vertical' | 'horizontal';
    compact?: boolean;
    className?: string;

    // ---- Lifecycle ----
    /** Whether the workflow has started (affects Start button) */
    started?: boolean;
    onStart?: () => void;

    // ---- Permissions / Capabilities ----
    /** Freelancer can show Send quotation button */
    canProposeQuote?: boolean;
    /** Employer can show Approve quotation button */
    canApproveQuotation?: boolean;
    /** Employer lacks enough balance to approve */
    insufficientForApprove?: boolean;
    /** Viewer role flag */
    isEmployer?: boolean;
    /** Freelancer can submit a delivery (upload modal) */
    canSubmitDelivery?: boolean;

    // ---- File modal state ----
    selectedFile: UploadedFile;
    isDeletingFile: boolean;

    // ---- Cancellation helper ----
    statusBeforeCancel?: StatusKey;
} & FlowActions;

// =============================================================================
// Constants
// =============================================================================

const STEPS: Array<{ key: ViewStatus; title: string; sub: string }> = [
    {
        key: 'WaitForFreelancerQuotation',
        title: 'Waiting for Quotation',
        sub: 'No quotation has been sent yet. Waiting for the freelancer to send one.',
    },
    {
        key: 'QuotationPending',
        title: 'Quotation Pending',
        sub: 'Quotation created by freelancer, waiting for employer review',
    },
    {
        key: 'OrderApproved',
        title: 'Order Approved',
        sub: 'Employer approved quotation, became an order, ready for invoice payment',
    },
    {
        key: 'InProgress',
        title: 'In Progress',
        sub: 'Employer paid invoice, money in escrow, waiting for work submission',
    },
    {
        key: 'PendingEmployerReview',
        title: 'Pending Employer Review',
        sub: 'Work submitted to employer; pending employer review before payment release',
    },
    {key: 'Completed', title: 'Completed', sub: 'Employer approved work, money released to freelancer'},
    {key: 'Cancelled', title: 'Cancelled', sub: 'Quotation/order cancelled before payment'},
];

// =============================================================================
// Component
// =============================================================================

const FreelanceChatFlow: React.FC<FreelanceChatFlowProps> = ({
                                                                 currentStatus: controlledStatus,
                                                                 onChangeStatus,
                                                                 orientation = 'vertical',
                                                                 compact = false,
                                                                 className = '',
                                                                 started = true,
                                                                 onStart,
                                                                 canProposeQuote = true,
                                                                 canApproveQuotation = true,
                                                                 insufficientForApprove = true,
                                                                 isEmployer = false,
                                                                 canSubmitDelivery = false,
                                                                 selectedFile,
                                                                 isDeletingFile,
                                                                 onProposeQuote,
                                                                 onApproveQuotation,
                                                                 onStartWork,
                                                                 onUploadAsset,
                                                                 onSendMessage,
                                                                 onSubmitDelivery,
                                                                 onRequestRevision,
                                                                 onReleasePayment,
                                                                 onCancel,
                                                                 onFileUpload,
                                                                 onFileRemove,
                                                                 statusBeforeCancel,
                                                             }) => {
    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showRevisionConfirm, setShowRevisionConfirm] = useState(false);
    const [showReleaseConfirm, setShowReleaseConfirm] = useState(false);
    const {t} = useTranslation();
    const stepper = useWorkflowStepper();
    const derivedStatus = stepper?.state?.name as StatusKey | undefined;
    const isControlled = controlledStatus != null;
    const currentStatus: StatusKey = (isControlled ? controlledStatus! : derivedStatus || 'QuotationPending') as StatusKey;
    const derivedStatusBeforeCancel = stepper?.statusBeforeCancel;
    const currentStatusBeforeCancel = isControlled ? statusBeforeCancel : derivedStatusBeforeCancel;

    // Derive a UI-only "waiting for quotation" state purely from permissions + role
    // If current server status is QuotationPending:
    //  - Freelancer who canProposeQuote => hasn't sent a quote yet
    //  - Employer who cannot approve yet => no quote to approve
    const viewStatus: ViewStatus =
        currentStatus === 'QuotationPending' &&
        (
            (!isEmployer && Boolean(canProposeQuote)) ||
            (isEmployer && !Boolean(canApproveQuotation))
        )
            ? 'WaitForFreelancerQuotation'
            : currentStatus;

    const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === viewStatus));

    // Consolidate final-state logic to avoid overlap
    const isFinal = currentStatus === 'Completed' || currentStatus === 'Cancelled';
    const showMessageHiring = isFinal && isEmployer;
    const startedEffective = isFinal ? false : started;
    const showStartButton = Boolean(isEmployer && !startedEffective);
    const canStartWorkflow = showStartButton;
    const [showStartConfirm, setShowStartConfirm] = useState(false);

    const ORDER: ViewStatus[] = (stepper?.ORDER as StatusKey[]) as ViewStatus[] || [
        'WaitForFreelancerQuotation',
        'QuotationPending',
        'OrderApproved',
        'InProgress',
        'PendingEmployerReview',
        'Completed',
        'Cancelled',
    ];

    const roleLabel = isEmployer === undefined ? 'N/A' : isEmployer ? t('profileChat.roleEmployer') || 'ผู้ว่าจ้าง' : t('profileChat.roleFreelancer') || 'ฟรีแลนซ์';

    // Log component render
    useEffect(() => {
    }, [currentStatus, currentStatusBeforeCancel]);

    // -- Step visualization helpers -----------------------------------------------------
    // Determine dot colors based on currentStatus and statusBeforeCancel
    const getDotColor = (stepKey: ViewStatus, index: number) => {
        if (currentStatus === 'Cancelled' && currentStatusBeforeCancel) {
            const beforeCancelIndex = STEPS.findIndex((s) => s.key === currentStatusBeforeCancel);
            if (stepKey === 'Cancelled') {
                return 'bg-red-500 border-red-500 text-white';
            }
            if (index < beforeCancelIndex) {
                return 'bg-green-500 border-green-500 text-white';
            }
            return 'bg-gray-500 border-gray-500 text-white';
        }
        // Default behavior for non-cancelled states
        const isFuture = index > currentIndex;
        return isFuture
            ? 'bg-gray-500 border-gray-500 text-white'
            : stepKey === 'Cancelled'
                ? 'bg-red-500 border-red-500 text-white'
                : 'bg-green-500 border-green-500 text-white';
    };

    // -- Navigation handler (step-click) ------------------------------------------------
    const handleActivateStep = (toIndex: number, targetKey: ViewStatus) => {
        const curIdx = currentIndex;
        const canAdjacent = toIndex === curIdx || Math.abs(toIndex - curIdx) === 1;
        if (canAdjacent) {
            if (isControlled) {
                onChangeStatus?.(targetKey as StatusKey);
            } else if (stepper && stepper.canGo(targetKey as StatusKey)) {
                const fromOrderIdx = ORDER.indexOf(viewStatus);
                const toOrderIdx = ORDER.indexOf(targetKey);
                if (toOrderIdx > fromOrderIdx) stepper.send({type: 'NEXT'});
                if (toOrderIdx < fromOrderIdx) stepper.send({type: 'BACK'});
            }
        }
    };

    // -- Action rendering per step ------------------------------------------------------
    // Action buttons for each step
    const actionsForStep = (key: ViewStatus) => {
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

        const cancelBtn =
            stepper?.canCancel && key !== 'Completed' && key !== 'Cancelled'
                ? btn(t('profileChat.cancelJob') || 'ยกเลิกงาน', () => setShowCancelConfirm(true), 'ghost')
                : null;

        switch (key) {
            case 'WaitForFreelancerQuotation': {
                const actions: React.ReactElement[] = [];
                if (!isEmployer) {
                    // Freelancer: prompt to send a quotation
                    actions.push(btn(t('profileChat.proposeQuote') || 'Send quotation', onProposeQuote));
                } else {
                    // Employer: purely informational (no Approve button until quotation exists)
                    actions.push(
                        <div
                            key="wait-freelancer-quotation"
                            className="w-full text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2"
                        >
                            {t('profileChat.waitForFreelancerQuotation') || 'Waiting for freelancer to send a quotation.'}
                        </div>
                    );
                    if (cancelBtn) actions.push(cancelBtn);
                }
                if (cancelBtn && actions.length && isEmployer) return actions;
                if (cancelBtn) actions.push(cancelBtn);
                return actions;
            }
            case 'QuotationPending': {
                const actions: React.ReactElement[] = [];

                if (!isEmployer) {
                    // Freelancer
                    actions.push(
                        <div
                            key="wait-approval"
                            className="w-full text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2"
                        >
                            {t('profileChat.waitEmployerApproval') || 'Waiting for employer to approve your quotation'}
                        </div>
                    );
                } else {
                    // Employer
                    if (insufficientForApprove) {
                        actions.push(
                            <div
                                key="insufficient"
                                className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm"
                            >
                                <div
                                    className="font-medium">{t('profileChat.insufficientBalanceTitle') || 'Insufficient balance'}</div>
                                <div className="mt-1">
                                    {(t('profileChat.insufficientBalanceWarning') || 'Insufficient balance to approve the quotation.')}
                                    {' '}
                                    <Link href="/coin" className="underline font-medium">
                                        {t('profileChat.topUpNow') || 'Top up now'}
                                    </Link>
                                </div>
                            </div>
                        );
                    }
                    if (canApproveQuotation && !insufficientForApprove) {
                        actions.push(btn(t('profileChat.approveQuotation') || 'Approve quotation', () => setShowApproveConfirm(true)));
                    }
                    if (cancelBtn) actions.push(cancelBtn);
                    return actions;
                }

                if (cancelBtn) actions.push(cancelBtn);
                return actions;
            }

            case 'OrderApproved': {
                const actions: React.ReactElement[] = [];
                // Start work เฉพาะฝั่งฟรีแลนซ์
                if (!isEmployer && onStartWork) actions.push(btn(t('profileChat.startWork') || 'Start work', onStartWork));
                if (cancelBtn) actions.push(cancelBtn);
                return actions;
            }

            case 'InProgress': {
                if (isEmployer) {
                    return [
                        <div
                            key="wait-freelancer"
                            className="w-full text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-md px-3 py-2"
                        >
                            {t('profileChat.waitForFreelancerSubmit') || 'Waiting for the freelancer to submit their work.'}
                        </div>,
                        ...(cancelBtn ? [cancelBtn] : []),
                    ];
                }
                const actions: React.ReactElement[] = [];
                actions.push(btn(t('profileChat.submitDelivery') || 'ส่งงาน', () => setShowUploadModal(true), 'ghost'));
                if (cancelBtn) actions.push(cancelBtn);
                return actions.filter(Boolean) as React.ReactElement[];
            }

            case 'PendingEmployerReview': {
                if (isEmployer) {
                    return [
                        btn(t('profileChat.requestRevision') || 'ขอแก้ไขรอบใหม่', () => setShowRevisionConfirm(true)),
                        btn(t('profileChat.releasePayment') || 'ปล่อยเงิน/ปิดงาน', () => setShowReleaseConfirm(true), 'ghost'),
                        ...(cancelBtn ? [cancelBtn] : []),
                    ];
                }
                return [
                    <div
                        key="wait-employer"
                        className="w-full text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2"
                    >
                        {t('profileChat.waitForEmployerReview') || 'Your delivery was submitted. Waiting for employer review.'}
                    </div>,
                    ...(cancelBtn ? [cancelBtn] : []),
                ];
            }

            case 'Completed':
            case 'Cancelled':
            default:
                return [];
        }
    };

    // =============================================================================
    // Render
    // =============================================================================
    return (
        <aside
            className={`flex w-full h-full bg-white shadow-sm rounded-lg overflow-auto ${
                orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'
            } ${compact ? 'space-y-2' : 'space-y-4'} ${className}`}
            aria-label="สถานะปัจจุบัน"
        >
            {roleLabel && (
                <div className="w-full px-4 pt-4">
                    <div
                        className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1">
                        {roleLabel}
                    </div>
                </div>
            )}
            {showMessageHiring && (
                <div className="w-full px-4">
                    <div
                        className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1">
                        {t('profileChat.messageHiringAgain')}
                    </div>
                </div>
            )}
            {showStartButton && (
                <div className="w-full px-4">
                    <button
                        className={`rounded-md px-4 py-2 text-sm font-medium ${
                            canStartWorkflow ? 'bg-primary text-white hover:bg-[#063a68]' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        }`}
                        onClick={canStartWorkflow ? () => setShowStartConfirm(true) : undefined}
                        aria-disabled={!canStartWorkflow}
                        disabled={!canStartWorkflow}
                    >
                        {t('profileChat.startWorkflow') || 'Start a new job'}
                    </button>
                </div>
            )}
            {startedEffective && (
                <>
                    <ul className={`flex ${orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col'} px-4 ${compact ? 'py-2' : 'py-4'}`}>
                        {STEPS.map((step, index) => {
                            const isActive = step.key === viewStatus;
                            const dotColor = getDotColor(step.key, index);

                            return (
                                <li
                                    key={step.key}
                                    className={`flex items-center text-gray-600 ${
                                        orientation === 'horizontal' ? 'min-w-[200px] max-w-[250px]' : 'w-full'
                                    } ${compact ? 'py-1' : 'py-2'} ${
                                        isActive ? 'font-semibold text-primary' : index > currentIndex ? 'opacity-50 pointer-events-none' : ''
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
                                        className={`min-w-[24px] max-w-[24px] w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${dotColor} ${
                                            isActive ? 'ring-2 ring-blue-200' : ''
                                        } mr-3 shrink-0`}
                                    >
                                        {index + 1}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span
                                            className="text-sm font-medium truncate">{t(`profileChat.step${index + 1}`) || step.title}</span>
                                        {!compact && (
                                            <span
                                                className="text-xs text-gray-500 line-clamp-2">{t(`profileChat.step${index + 1}Sub`) || step.sub}</span>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <div className={`flex flex-col gap-2 px-4 ${compact ? 'pb-2' : 'pb-4'}`}>
                        {actionsForStep(viewStatus).map((action, idx) => (
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
                            onApproveQuotation?.();
                        }}
                        title={t('profileChat.confirmApproveQuotationTitle') || 'Approve quotation?'}
                        message={t('profileChat.confirmApproveQuotationMessage') || "This will approve the freelancer's quotation and convert it into an order."}
                        confirmText={t('profileChat.approveQuotation') || 'Approve quotation'}
                    />
                    <ConfirmActionModal
                        isOpen={showRevisionConfirm}
                        onClose={() => setShowRevisionConfirm(false)}
                        onConfirm={async () => {
                            setShowRevisionConfirm(false);
                            onRequestRevision?.();
                        }}
                        title={t('profileChat.confirmRequestRevisionTitle') || 'Request a revision?'}
                        message={t('profileChat.confirmRequestRevisionMessage') || 'This will move the job back to In Progress and notify the freelancer to revise and resubmit.'}
                        confirmText={t('profileChat.requestRevision') || 'Request revision'}
                    />
                    <ConfirmActionModal
                        isOpen={showCancelConfirm}
                        onClose={() => setShowCancelConfirm(false)}
                        onConfirm={async () => {
                            setShowCancelConfirm(false);
                            console.log('FreelanceChatFlow onCancel:', {currentStatus, currentStatusBeforeCancel});
                            if (isControlled) {
                                onChangeStatus?.('Cancelled', currentStatus);
                                onCancel?.(currentStatus);
                            } else {
                                stepper?.cancel();
                            }
                        }}
                        title={t('profileChat.confirmCancelJobTitle') || 'Cancel this job?'}
                        message={t('profileChat.confirmCancelJobMessage') || 'This will cancel the current workflow. This action cannot be undone.'}
                        confirmText={t('profileChat.cancelJob') || 'Cancel job'}
                    />
                    <ConfirmActionModal
                        isOpen={showReleaseConfirm}
                        onClose={() => setShowReleaseConfirm(false)}
                        onConfirm={async () => {
                            setShowReleaseConfirm(false);
                            onReleasePayment?.();
                        }}
                        title={t('profileChat.confirmReleasePaymentTitle') || 'Release payment and close job?'}
                        message={t('profileChat.confirmReleasePaymentMessage') || 'This will approve the submitted work, release funds to the freelancer, and close the job.'}
                        confirmText={t('profileChat.releasePayment') || 'Release payment / Close job'}
                    />
                    <FileUploadModal
                        isOpen={showUploadModal}
                        onClose={() => {
                            setShowUploadModal(false);
                        }}
                        onSubmit={async () => {
                            setShowUploadModal(false);
                            onSubmitDelivery?.();
                        }}
                        selectedFile={selectedFile}
                        onFileUpload={onFileUpload}
                        isDeletingFile={isDeletingFile}
                        onFileRemove={onFileRemove}
                    />
                </>
            )}
            <ConfirmActionModal
                isOpen={showStartConfirm}
                onClose={() => setShowStartConfirm(false)}
                onConfirm={() => {
                    setShowStartConfirm(false);
                    onStart?.();
                }}
                title={t('profileChat.confirmStartWorkflowTitle') || 'ต้องการจ้างงาน?'}
                message={t('profileChat.confirmStartWorkflowMessage') || 'ระบบจะเริ่มขั้นตอนงานสำหรับการสนทนานี้'}
            />
        </aside>
    );
};

export default FreelanceChatFlow;