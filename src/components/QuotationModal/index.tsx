'use client';

import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

export interface WorkStep {
    seq: number;
    description: string;
    amount: number;
    workingDays: number;
    status: string;
    startingDay: string;
    deliveryDay: string;
}

export interface ProposedQuotePayload {
    employerId: number;
    postId: number;
    commentId: number;
    amount: number;
    proposal: string;
    projectName: string;
    projectDetails: string;
    workSteps: WorkStep[];
    workingDays: number;
    deliverables: string[];
    note?: string;
    startingDay: string;
    deliveryDay: string;
}

interface QuotationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ProposedQuotePayload) => Promise<void>; // Updated to return Promise for async error handling
    postId?: number; // derive from chat room instead of hardcoding
}

const QuotationModal: React.FC<QuotationModalProps> = ({ isOpen, onClose, onSubmit, postId }) => {
    const { t } = useTranslation();

    // Initialize without hardcoded demo content; postId comes from props
    const [form, setForm] = useState<ProposedQuotePayload>({
        employerId: 0,
        postId: postId ?? 0,
        commentId: 0,
        amount: 0,
        proposal: '',
        projectName: '',
        projectDetails: '',
        workSteps: [],
        workingDays: 0,
        deliverables: [''],
        note: '',
        startingDay: '',
        deliveryDay: '',
    });

    const [error, setError] = useState<string | null>(null);

    // Keep postId in sync with prop changes (room data is async)
    React.useEffect(() => {
        setForm((prev) => ({ ...prev, postId: postId ?? 0 }));
    }, [postId]);

    const updateField = <K extends keyof ProposedQuotePayload>(key: K, value: ProposedQuotePayload[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const updateWorkStep = (index: number, key: keyof WorkStep, value: any) => {
        setForm((prev) => {
            const copy = [...prev.workSteps];
            copy[index] = { ...copy[index], [key]: value } as WorkStep;
            return { ...prev, workSteps: copy };
        });
    };

    const addWorkStep = () => {
        setForm((prev) => ({
            ...prev,
            workSteps: [
                ...prev.workSteps,
                {
                    seq: prev.workSteps.length + 1,
                    description: '',
                    amount: 0,
                    workingDays: 1,
                    status: 'QuotationPending',
                    startingDay: '',
                    deliveryDay: '',
                },
            ],
        }));
    };

    const removeWorkStep = (index: number) => {
        setForm((prev) => {
            const copy = prev.workSteps.filter((_, i) => i !== index).map((w, i) => ({ ...w, seq: i + 1 }));
            return { ...prev, workSteps: copy };
        });
    };

    const updateDeliverable = (index: number, value: string) => {
        setForm((prev) => {
            const copy = [...prev.deliverables];
            copy[index] = value;
            return { ...prev, deliverables: copy };
        });
    };

    const addDeliverable = () => {
        setForm((prev) => ({ ...prev, deliverables: [...prev.deliverables, ''] }));
    };

    const removeDeliverable = (index: number) => {
        setForm((prev) => ({ ...prev, deliverables: prev.deliverables.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            // Validate required fields
            const required: Array<keyof ProposedQuotePayload> = [
                'employerId',
                'postId',
                'commentId',
                'amount',
                'proposal',
                'projectName',
                'projectDetails',
                'workSteps',
                'workingDays',
                'deliverables',
                'startingDay',
                'deliveryDay',
            ];
            for (const key of required) {
                const val = (form as any)[key];
                if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
                    throw new Error(t(`profileChat.validation.${key}`) || `Please provide a valid ${key}`);
                }
            }
            if (!Array.isArray(form.workSteps) || form.workSteps.length === 0) {
                throw new Error(t('profileChat.validation.workSteps') || 'At least one work step is required');
            }
            if (!Array.isArray(form.deliverables) || form.deliverables.length === 0) {
                throw new Error(t('profileChat.validation.deliverables') || 'At least one deliverable is required');
            }

            // Validate work steps
            for (const [index, step] of form.workSteps.entries()) {
                if (!step.description.trim()) {
                    throw new Error(t('profileChat.validation.workStepDescription') || `Work step ${index + 1}: Description is required`);
                }
                if (step.amount <= 0) {
                    throw new Error(t('profileChat.validation.workStepAmount') || `Work step ${index + 1}: Amount must be greater than 0`);
                }
                if (step.workingDays <= 0) {
                    throw new Error(t('profileChat.validation.workStepWorkingDays') || `Work step ${index + 1}: Working days must be greater than 0`);
                }
                if (!step.startingDay || !step.deliveryDay) {
                    throw new Error(t('profileChat.validation.workStepDates') || `Work step ${index + 1}: Both start and delivery dates are required`);
                }
            }

            // Validate deliverables
            for (const [index, deliverable] of form.deliverables.entries()) {
                if (!deliverable.trim()) {
                    throw new Error(t('profileChat.validation.deliverable') || `Deliverable ${index + 1}: Description is required`);
                }
            }

            // Validate total amount against work steps
            const totalWorkStepAmount = form.workSteps.reduce((sum, step) => sum + step.amount, 0);
            if (totalWorkStepAmount !== form.amount) {
                throw new Error(t('profileChat.validation.totalAmount') || 'Total amount must match the sum of work step amounts');
            }

            // Submit form and await API response
            await onSubmit(form);
            onClose();
        } catch (e: any) {
            setError(e?.message || t('profileChat.validation.invalidForm') || 'Invalid form data');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-[95%] sm:w-[90%] max-w-3xl shadow-lg">
                <h3 className="text-base sm:text-lg font-semibold mb-2">{t('profileChat.quotationTitle') || 'Create Quotation'}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">{t('profileChat.quotationDesc') || 'Fill in the quotation details below.'}</p>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 max-h-[80vh] overflow-y-auto pr-1 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">{t('profileChat.projectName') || 'Project Name'}</label>
                            <input
                                type="text"
                                value={form.projectName}
                                onChange={(e) => updateField('projectName', e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                                required
                                aria-describedby="projectName-error"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">{t('profileChat.amount') || 'Amount (Total)'}</label>
                            <input
                                type="number"
                                step="0.01"
                                value={form.amount}
                                onChange={(e) => updateField('amount', Number(e.target.value))}
                                className="mt-1 w-full rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                                required
                                aria-describedby="amount-error"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">{t('profileChat.proposal') || 'Proposal'}</label>
                        <textarea
                            value={form.proposal}
                            onChange={(e) => updateField('proposal', e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                            rows={3}
                            required
                            aria-describedby="proposal-error"
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">{t('profileChat.projectDetails') || 'Project Details'}</label>
                        <textarea
                            value={form.projectDetails}
                            onChange={(e) => updateField('projectDetails', e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                            rows={4}
                            required
                            aria-describedby="projectDetails-error"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">{t('profileChat.workingDays') || 'Working Days (Total)'}</label>
                            <input
                                type="number"
                                value={form.workingDays}
                                onChange={(e) => updateField('workingDays', Number(e.target.value))}
                                className="mt-1 w-full rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                                required
                                aria-describedby="workingDays-error"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">{t('profileChat.startingDay') || 'Starting Day'}</label>
                            <input
                                type="date"
                                value={form.startingDay}
                                onChange={(e) => updateField('startingDay', e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                                required
                                aria-describedby="startingDay-error"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">{t('profileChat.deliveryDay') || 'Delivery Day'}</label>
                            <input
                                type="date"
                                value={form.deliveryDay}
                                onChange={(e) => updateField('deliveryDay', e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                                required
                                aria-describedby="deliveryDay-error"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">{t('profileChat.deliverables') || 'Deliverables'}</label>
                        <div className="space-y-2">
                            {form.deliverables.map((d, idx) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={d}
                                        onChange={(e) => updateDeliverable(idx, e.target.value)}
                                        className="flex-1 rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                                        placeholder={t('profileChat.exampleDeliverable') || ''}
                                        required
                                        aria-describedby={`deliverable-${idx}-error`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeDeliverable(idx)}
                                        className="px-2 py-1 sm:py-2 text-xs sm:text-sm rounded-md border border-gray-300 text-red-500 hover:bg-gray-100"
                                    >
                                        {t('profileChat.remove') || 'Remove'}
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addDeliverable}
                                className="mt-1 px-2 sm:px-3 py-1 sm:py-2 rounded-md bg-primary text-xs sm:text-sm hover:bg-[#063a68] text-white"
                            >
                                {t('profileChat.addDeliverable') || '+ Add deliverable'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">{t('profileChat.workSteps') || 'Work Steps'}</label>
                        <div className="space-y-2 sm:space-y-3">
                            {form.workSteps.map((ws, idx) => (
                                <div key={idx} className="border rounded-md p-2 sm:p-3 space-y-2 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-600">{t('profileChat.seq') || 'Seq'}</label>
                                            <input
                                                type="number"
                                                value={ws.seq}
                                                onChange={(e) => updateWorkStep(idx, 'seq', Number(e.target.value))}
                                                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs sm:text-sm"
                                                aria-describedby={`workStep-${idx}-seq-error`}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs text-gray-600">{t('profileChat.description') || 'Description'}</label>
                                            <input
                                                type="text"
                                                value={ws.description}
                                                onChange={(e) => updateWorkStep(idx, 'description', e.target.value)}
                                                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs sm:text-sm"
                                                placeholder={t('profileChat.exampleWorkStep') || ''}
                                                aria-describedby={`workStep-${idx}-description-error`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600">{t('profileChat.amount') || 'Amount'}</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={ws.amount}
                                                onChange={(e) => updateWorkStep(idx, 'amount', Number(e.target.value))}
                                                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs sm:text-sm"
                                                aria-describedby={`workStep-${idx}-amount-error`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600">{t('profileChat.workingDays') || 'Working Days'}</label>
                                            <input
                                                type="number"
                                                value={ws.workingDays}
                                                onChange={(e) => updateWorkStep(idx, 'workingDays', Number(e.target.value))}
                                                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs sm:text-sm"
                                                aria-describedby={`workStep-${idx}-workingDays-error`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600">{t('profileChat.status') || 'Status'}</label>
                                            <input
                                                type="text"
                                                value={ws.status}
                                                onChange={(e) => updateWorkStep(idx, 'status', e.target.value)}
                                                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs sm:text-sm"
                                                aria-describedby={`workStep-${idx}-status-error`}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-600">{t('profileChat.startingDay') || 'Starting Day'}</label>
                                            <input
                                                type="date"
                                                value={ws.startingDay}
                                                onChange={(e) => updateWorkStep(idx, 'startingDay', e.target.value)}
                                                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs sm:text-sm"
                                                aria-describedby={`workStep-${idx}-startingDay-error`}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600">{t('profileChat.deliveryDay') || 'Delivery Day'}</label>
                                            <input
                                                type="date"
                                                value={ws.deliveryDay}
                                                onChange={(e) => updateWorkStep(idx, 'deliveryDay', e.target.value)}
                                                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs sm:text-sm"
                                                aria-describedby={`workStep-${idx}-deliveryDay-error`}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeWorkStep(idx)}
                                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-500 rounded-md border border-gray-300 hover:bg-gray-100"
                                        >
                                            {t('profileChat.removeStep') || 'Remove Step'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addWorkStep}
                                className="mt-1 px-2 sm:px-3 py-1 sm:py-2 rounded-md bg-primary text-xs sm:text-sm hover:bg-[#063a68] text-white"
                            >
                                {t('profileChat.addWorkStep') || '+ Add work step'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">{t('profileChat.note') || 'Note (optional)'}</label>
                        <textarea
                            value={form.note || ''}
                            onChange={(e) => updateField('note', e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                            rows={2}
                            aria-describedby="note-error"
                        />
                    </div>

                    {error && <p className="text-xs sm:text-sm text-red-600" id="form-error">{error}</p>}

                    <div className="flex justify-end gap-2 sm:gap-3 sticky bottom-0 bg-white pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {t('profileChat.cancel') || 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-primary px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-white hover:bg-[#063a68]"
                        >
                            {t('profileChat.sendQuotation') || 'Send Quotation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuotationModal;