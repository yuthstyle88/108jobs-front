'use client';

import React from 'react';
import {useTranslation} from 'react-i18next';
import { useWorkflowStepper } from '@/hooks/useWorkflowMachine';
import type { UiFlowStatus } from '@/stores/stateMachineStore';

export type StatusKey = UiFlowStatus;

export type FlowActions = {
    onProposeQuote?: () => void;
    onConfirmAssign?: () => void;
    onAcceptJob?: () => void;
    onUploadAsset?: () => void;
    onSendMessage?: () => void;
    onSubmitDelivery?: () => void;
    onRequestRevision?: () => void;
    onReleasePayment?: () => void;
};

export type FreelanceChatFlowProps = {
    currentStatus?: StatusKey;
    onChangeStatus?: (key: StatusKey) => void;
    orientation?: 'vertical' | 'horizontal';
    compact?: boolean;
    className?: string;
} & FlowActions;

const STEPS: Array<{ key: StatusKey; title: string; sub: string }> = [
    { key: 'QuotationPending', title: 'รอเสนอ/ยืนยันราคา', sub: 'กำลังพิจารณาใบเสนอราคา' },
    { key: 'OrderApproved', title: 'นายจ้างอนุมัติ', sub: 'ตกลงร่วมงาน' },
    { key: 'InProgress', title: 'กำลังทำงาน', sub: 'แชทได้ตลอด (ไม่ใช่สถานะ)' },
    { key: 'PendingEmployerReview', title: 'รอตรวจงาน', sub: 'ส่งงาน / รอรีวิว' },
    { key: 'Completed', title: 'เสร็จสิ้น', sub: 'ปล่อยเงิน' },
];

const DOT_COLORS: Record<StatusKey, string> = {
    QuotationPending: 'bg-yellow-500 border-yellow-500',
    OrderApproved: 'bg-emerald-500 border-emerald-500',
    InProgress: 'bg-blue-600 border-blue-600',
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
                                                                 onProposeQuote,
                                                                 onConfirmAssign,
                                                                 onAcceptJob,
                                                                 onUploadAsset,
                                                                 onSendMessage,
                                                                 onSubmitDelivery,
                                                                 onRequestRevision,
                                                                 onReleasePayment,
                                                             }) => {
    const {t} = useTranslation();
    const stepper = useWorkflowStepper();
    const derivedStatus = stepper?.state?.name as StatusKey | undefined;
    const isControlled = controlledStatus != null && onChangeStatus != null;
    const currentStatus: StatusKey = (isControlled ? controlledStatus! : (derivedStatus || 'QuotationPending')) as StatusKey;
    const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === currentStatus));

    const ORDER: StatusKey[] = (stepper?.ORDER as StatusKey[]) || ['QuotationPending','OrderApproved','InProgress','PendingEmployerReview','Completed'];

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
                className={`w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    kind === 'primary'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                } ${!onClick ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={onClick}
                disabled={!onClick}
            >
                {label}
            </button>
        );

        switch (key) {
            case 'QuotationPending':
                return [
                    btn(t('profileChat.proposeQuote') || 'เสนอราคา', onProposeQuote),
                    btn(t('profileChat.sendBriefMessage') || 'ส่งข้อความหาไฟล์บรีฟ', onSendMessage, 'ghost'),
                ];
            case 'OrderApproved':
                return [
                    btn(t('profileChat.uploadDraft') || 'แนบไฟล์ต้นฉบับ', onUploadAsset),
                    btn(t('profileChat.sendMessage') || 'ส่งข้อความ', onSendMessage, 'ghost'),
                ];
            case 'InProgress':
                return [
                    btn(t('profileChat.uploadFileLink') || 'แนบไฟล์/ลิงก์', onUploadAsset),
                    btn(t('profileChat.submitDelivery') || 'ส่งงาน', onSubmitDelivery, 'ghost'),
                ];
            case 'PendingEmployerReview':
                return [
                    btn(t('profileChat.requestRevision') || 'ขอแก้ไขรอบใหม่', onRequestRevision),
                    btn(t('profileChat.releasePayment') || 'ปล่อยเงิน/ปิดงาน', onReleasePayment, 'ghost'),
                ];
            case 'Completed':
                return [];
            case 'Cancelled':
                return [];
            default:
                return [];
            }
    };

    return (
        <aside
            className={`flex w-full h-full bg-white ${
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
                    const isPast = index <= currentIndex;
                    const isFuture = index > currentIndex;

                    return (
                        <li
                            key={step.key}
                            className={`flex items-center text-gray-600 ${
                                orientation === 'horizontal' ? 'w-auto' : 'w-full'
                            } ${compact ? 'py-1' : 'py-2'} ${
                                isActive ? 'font-semibold text-blue-600' : isFuture ? 'opacity-50 pointer-events-none' : ''
                            } hover:bg-gray-50 cursor-pointer transition-colors`}
                            onClick={() => {
                                handleActivateStep(index, step.key);
                              }}
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
                                className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center text-xs font-medium text-white ${
                                    DOT_COLORS[step.key]
                                } ${isActive ? 'ring-2 ring-blue-200' : ''} mr-2`}
                            >
                                {index + 1}
                            </div>
                            <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {t(`profileChat.step${index + 1}`) || step.title}
                </span>
                                {!compact && (
                                    <span className="text-xs text-gray-500">
                    {t(`profileChat.step${index + 1}Sub`) || step.sub}
                  </span>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className={`flex flex-col gap-2 px-4 ${compact ? 'pb-2' : 'pb-4'}`}>
                {actionsForStep(currentStatus).map((action, idx) => (
                    <div key={idx} className="w-full">
                        {action}
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default FreelanceChatFlow;