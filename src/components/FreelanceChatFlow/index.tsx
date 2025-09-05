'use client';

import React from 'react';
import {useTranslation} from 'react-i18next';
import { useWorkflowStepper } from '@/hooks/useWorkflowMachine';

export type StatusKey = 'new' | 'queue' | 'assign' | 'accept' | 'chat' | 'review' | 'pay';

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
    {key: 'new', title: 'ลูกค้าทัก', sub: 'เริ่มแชท / ฟอร์มบรีฟ'},
    {key: 'queue', title: 'เข้า Queue', sub: 'รอคนรับงาน / เสนอราคา'},
    {key: 'assign', title: 'ขั้นที่ 4 (ฟรีแลนซ์)', sub: 'ไปยังขั้นตอนของฟรีแลนซ์'},
    {key: 'accept', title: 'นายจ้างตัดสินใจ', sub: 'ยอมรับ/ปฏิเสธ (ถ้ายอมรับไปขั้นที่ 5)'},
    {key: 'chat', title: 'คุยงาน (ขั้นที่ 5)', sub: 'เริ่มคุยงานหลังยอมรับ'},
    {key: 'review', title: 'ส่งงาน & รีวิว', sub: 'อัปโหลดไฟล์ส่งงาน'},
    {key: 'pay', title: 'จ่ายเงิน', sub: 'Escrow → ปล่อยเงิน'},
];

const DOT_COLORS: Record<StatusKey, string> = {
    new: 'bg-blue-600 border-blue-600',
    queue: 'bg-yellow-500 border-yellow-500',
    assign: 'bg-blue-500 border-blue-500',
    accept: 'bg-emerald-500 border-emerald-500',
    chat: 'bg-purple-500 border-purple-500',
    review: 'bg-pink-500 border-pink-500',
    pay: 'bg-green-500 border-green-500',
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
    const currentStatus: StatusKey = (isControlled ? controlledStatus! : (derivedStatus || 'new')) as StatusKey;
    const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === currentStatus));

    const ORDER: StatusKey[] = ['new','queue','assign','accept','chat','review','pay'];

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
            case 'new':
                return [
                    btn(t('profileChat.proposeQuote') || 'เสนอราคา', onProposeQuote),
                    btn(t('profileChat.sendBriefMessage') || 'ส่งข้อความหาไฟล์บรีฟ', onSendMessage, 'ghost'),
                ];
            case 'queue':
                return [
                    btn(t('profileChat.proposeQuote') || 'เสนอราคา', onProposeQuote),
                    btn(t('profileChat.uploadReference') || 'แนบไฟล์อ้างอิง', onUploadAsset, 'ghost'),
                ];
            case 'assign':
                return [
                    btn(t('profileChat.confirmAssign') || 'ยืนยันมอบหมาย (นายจ้าง)', onConfirmAssign),
                    btn(t('profileChat.askDetails') || 'ถามรายละเอียด', onSendMessage, 'ghost'),
                ];
            case 'accept':
                return [
                    btn(t('profileChat.startChat') || 'เริ่มคุยงาน', onSendMessage),
                    btn(t('profileChat.uploadDraft') || 'แนบไฟล์ต้นฉบับ', onUploadAsset, 'ghost'),
                ];
            case 'chat':
                return [
                    btn(t('profileChat.uploadFileLink') || 'แนบไฟล์/ลิงก์', onUploadAsset),
                    btn(t('profileChat.sendMessage') || 'ส่งข้อความ', onSendMessage, 'ghost'),
                ];
            case 'review':
                return [
                    btn(t('profileChat.submitDelivery') || 'ส่งงาน', onSubmitDelivery),
                    btn(t('profileChat.requestRevision') || 'ขอแก้ไขรอบใหม่', onRequestRevision, 'ghost'),
                ];
            case 'pay':
                return [btn(t('profileChat.releasePayment') || 'ปล่อยเงิน/ปิดงาน', onReleasePayment)];
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