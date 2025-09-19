'use client';

import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {z} from 'zod';
import {getTodayYMD, addDaysYMD, isBeforeToday} from '@/utils/helpers';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {CustomInput} from "@/components/ui/InputField";

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
    partnerId: number;
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
    onSubmit: (data: ProposedQuotePayload) => Promise<void>;
    postId?: number;
    commentId?: number;
    partnerId: number;
    projectName?: string;
}

const QuotationModal: React.FC<QuotationModalProps> = ({isOpen, onClose, onSubmit, postId, commentId, partnerId, projectName}) => {
    const {t} = useTranslation();

    const {ProposedQuoteSchema} = useMemo(() => {
        const WorkStepSchema = z.object({
            seq: z.number().int().min(1, t('profileChat.validation.workStepSeq') || 'Sequence must be at least 1'),
            description: z.string().min(1, t('profileChat.validation.workStepDescription') || 'Work step description is required'),
            amount: z.number().positive({message: t('profileChat.validation.workStepAmount') || 'Work step amount must be greater than 0'}),
            workingDays: z.number().int().positive({message: t('profileChat.validation.workStepWorkingDays') || 'Work step working days must be greater than 0'}),
            status: z.string(),
            startingDay: z.string().min(1, t('profileChat.validation.workStepDates') || 'Both starting and delivery days are required'),
            deliveryDay: z.string().min(1, t('profileChat.validation.workStepDates') || 'Both starting and delivery days are required'),
        }).superRefine((s, ctx) => {
            if (s.startingDay && isBeforeToday(s.startingDay)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('profileChat.validation.startDateNotPast') || 'Start date cannot be earlier than today',
                    path: ['startingDay']
                });
            }
            if (s.startingDay && s.workingDays > 0) {
                const expected = addDaysYMD(s.startingDay, s.workingDays);
                if (s.deliveryDay !== expected) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: t('profileChat.validation.invalidForm') || 'Delivery date must equal start date plus working days',
                        path: ['deliveryDay']
                    });
                }
            }
        });

        const ProposedQuoteSchema = z.object({
            partnerId: z.number().int().nonnegative(),
            postId: z.number().int().nonnegative(),
            commentId: z.number().int().nonnegative(),
            amount: z.number().positive({message: t('profileChat.validation.totalAmount') || 'Total amount must be greater than 0'}),
            proposal: z.string().min(1, t('profileChat.validation.invalidForm') || 'Proposal is required'),
            projectName: z.string().min(1, t('profileChat.validation.invalidForm') || 'Project name is required'),
            projectDetails: z.string().min(1, t('profileChat.validation.invalidForm') || 'Project details are required'),
            workSteps: z.array(WorkStepSchema).min(1, t('profileChat.validation.workSteps') || 'At least one work step is required'),
            workingDays: z.number().int().positive({message: t('profileChat.validation.workingDays') || 'Total working days must be greater than 0'}),
            deliverables: z.array(z.string().min(1, t('profileChat.validation.deliverable') || 'Deliverable description is required')).min(1, t('profileChat.validation.deliverables') || 'At least one deliverable is required'),
            note: z.string().optional(),
            startingDay: z.string().min(1, t('profileChat.validation.workStepDates') || 'Both starting and delivery days are required'),
            deliveryDay: z.string().min(1, t('profileChat.validation.workStepDates') || 'Both starting and delivery days are required'),
        }).superRefine((data, ctx) => {
            if (data.startingDay && isBeforeToday(data.startingDay)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('profileChat.validation.startDateNotPast') || 'Start date cannot be earlier than today',
                    path: ['startingDay']
                });
            }
            if (data.startingDay && data.workingDays > 0) {
                const expected = addDaysYMD(data.startingDay, data.workingDays);
                if (data.deliveryDay !== expected) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: t('profileChat.validation.invalidForm') || 'Delivery date must equal start date plus working days',
                        path: ['deliveryDay']
                    });
                }
            }
        });

        return {WorkStepSchema, ProposedQuoteSchema};
    }, [t]);

    const [form, setForm] = useState<ProposedQuotePayload>({
        partnerId,
        postId: postId ?? 0,
        commentId: commentId ?? 0,
        amount: 0,
        proposal: '',
        projectName: projectName || '',
        projectDetails: '',
        workSteps: [{
            seq: 1,
            description: '',
            amount: 0,
            workingDays: 1,
            status: 'QuotationPending',
            startingDay: '',
            deliveryDay: '',
        }],
        workingDays: 0,
        deliverables: [''],
        note: '',
        startingDay: '',
        deliveryDay: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    React.useEffect(() => {
        setForm((prev) => ({...prev, postId: postId ?? 0}));
    }, [postId]);

    React.useEffect(() => {
        setForm((prev) => ({...prev, commentId: commentId ?? 0}));
    }, [commentId]);

    const updateField = <K extends keyof ProposedQuotePayload>(key: K, value: ProposedQuotePayload[K]) => {
        setForm((prev) => {
            const updatedForm = {...prev, [key]: value};
            if (key === 'startingDay' || key === 'workingDays') {
                const startingDay = key === 'startingDay' ? value as string : prev.startingDay;
                const workingDays = key === 'workingDays' ? value as number : prev.workingDays;
                if (startingDay && workingDays > 0) {
                    updatedForm.deliveryDay = addDaysYMD(startingDay, workingDays);
                }
            }
            return updatedForm;
        });
        validateField(key, value);
    };

    const updateWorkStep = (index: number, key: keyof WorkStep, value: any) => {
        setForm((prev) => {
            const copy = [...prev.workSteps];
            const current = copy[index] as WorkStep;
            const next: WorkStep = {...current, [key]: value};

            if (key === 'startingDay' || key === 'workingDays') {
                const start = key === 'startingDay' ? value as string : next.startingDay;
                const days = key === 'workingDays' ? value as number : next.workingDays;
                if (start && days > 0) {
                    next.deliveryDay = addDaysYMD(start, days);
                }
            }
            copy[index] = next;
            return {...prev, workSteps: copy};
        });
        validateWorkStep(index);
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
        if (index === 0) return; // Prevent removing the first work step
        setForm((prev) => {
            const copy = prev.workSteps.filter((_, i) => i !== index).map((w, i) => ({...w, seq: i + 1}));
            return {...prev, workSteps: copy};
        });
        validateWorkStep(index);
    };

    const updateDeliverable = (index: number, value: string) => {
        setForm((prev) => {
            const copy = [...prev.deliverables];
            copy[index] = value;
            return {...prev, deliverables: copy};
        });
        validateDeliverable(index);
    };

    const addDeliverable = () => {
        setForm((prev) => ({...prev, deliverables: [...prev.deliverables, '']}));
    };

    const removeDeliverable = (index: number) => {
        if (form.deliverables.length <= 1) return; // Prevent removing the last deliverable
        setForm((prev) => ({...prev, deliverables: prev.deliverables.filter((_, i) => i !== index)}));
        validateDeliverable(index);
    };

    const validateField = async <K extends keyof ProposedQuotePayload>(key: K, value: ProposedQuotePayload[K]) => {
        const tempForm = {...form, [key]: value};
        const result = await ProposedQuoteSchema.safeParseAsync(tempForm);
        if (!result.success) {
            const error = result.error.issues.find((issue) => issue.path[0] === key);
            setErrors((prev) => ({...prev, [key]: error?.message || ''}));
        } else {
            setErrors((prev) => ({...prev, [key]: ''}));
        }
    };

    const validateWorkStep = async (index: number) => {
        const result = await ProposedQuoteSchema.safeParseAsync(form);
        if (!result.success) {
            const errorsForStep = result.error.issues.filter((issue) => issue.path.join('.').startsWith(`workSteps[${index}]`));
            const newErrors: Record<string, string> = {};
            errorsForStep.forEach((issue) => {
                const field = issue.path[issue.path.length - 1];
                newErrors[`workSteps[${index}].${field}`] = issue.message;
            });
            setErrors((prev) => ({...prev, ...newErrors}));
        } else {
            setErrors((prev) => {
                const newErrors = {...prev};
                Object.keys(prev).forEach((key) => {
                    if (key.startsWith(`workSteps[${index}]`)) {
                        delete newErrors[key];
                    }
                });
                return newErrors;
            });
        }
    };

    const validateDeliverable = async (index: number) => {
        const result = await ProposedQuoteSchema.safeParseAsync(form);
        if (!result.success) {
            const error = result.error.issues.find((issue) => issue.path.join('.') === `deliverables[${index}]`);
            setErrors((prev) => ({...prev, [`deliverables[${index}]`]: error?.message || ''}));
        } else {
            setErrors((prev) => ({...prev, [`deliverables[${index}]`]: ''}));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = await ProposedQuoteSchema.safeParseAsync(form);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path.join('.');
                newErrors[path] = issue.message;
            });
            setErrors(newErrors);
            return;
        }

        try {
            await onSubmit(result.data);
            onClose();
        } catch (e: any) {
            setErrors({form: e?.message || t('profileChat.validation.invalidForm') || 'Invalid form data'});
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 pt-10 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-[95%] sm:w-[90%] max-w-3xl shadow-lg">
                <h3 className="text-primary sm:text-lg font-semibold mb-2">{t('profileChat.quotationTitle') || 'Create Quotation'}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">{t('profileChat.quotationDesc') || 'Fill in the quotation details below.'}</p>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-5 max-h-[80vh] overflow-y-auto pr-1 text-gray-700"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                        {/* Project Name field set to display-only */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">
                                {t('profileChat.projectName') || 'Project Name'}
                            </label>
                            <div className="mt-2 text-sm text-gray-900 bg-gray-100 p-2.5 rounded-md border border-gray-300">
                                {form.projectName || 'N/A'}
                            </div>
                            {errors['projectName'] && (
                                <p className="mt-1 text-xs text-red-600">{errors['projectName']}</p>
                            )}
                        </div>
                        <CustomInput
                            label={t('profileChat.amount') || 'Amount (Total)'}
                            name="amount"
                            type="number"
                            value={form.amount === 0 ? '' : form.amount.toString()}
                            onChange={(e) => updateField('amount', Number(e.target.value))}
                            error={errors['amount']}
                            placeholder="0"
                            required
                        />
                    </div>

                    <CustomInput
                        label={t('profileChat.proposal') || 'Proposal'}
                        name="proposal"
                        type="textarea"
                        value={form.proposal}
                        onChange={(e) => updateField('proposal', e.target.value)}
                        error={errors['proposal']}
                        placeholder={t('profileChat.proposal') || 'Enter proposal details'}
                        required
                    />

                    <CustomInput
                        label={t('profileChat.projectDetails') || 'Project Details'}
                        name="projectDetails"
                        type="textarea"
                        value={form.projectDetails}
                        onChange={(e) => updateField('projectDetails', e.target.value)}
                        error={errors['projectDetails']}
                        placeholder={t('profileChat.projectDetails') || 'Enter project details'}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
                        <CustomInput
                            label={t('profileChat.workingDays') || 'Working Days (Total)'}
                            name="workingDays"
                            type="number"
                            value={form.workingDays === 0 ? '' : form.workingDays.toString()}
                            onChange={(e) => updateField('workingDays', Number(e.target.value))}
                            error={errors['workingDays']}
                            placeholder="0"
                            required
                        />
                        <CustomInput
                            label={t('profileChat.startingDay') || 'Starting Day'}
                            name="startingDay"
                            type="date"
                            value={form.startingDay}
                            onChange={(e) => updateField('startingDay', e.target.value)}
                            error={errors['startingDay']}
                            required
                        />
                        <CustomInput
                            label={t('profileChat.deliveryDay') || 'Delivery Day'}
                            name="deliveryDay"
                            type="date"
                            value={form.deliveryDay}
                            error={errors['deliveryDay']}
                            readonly
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">
                            {t('profileChat.deliverables') || 'Deliverables'}{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            {form.deliverables.map((d, idx) => (
                                <div key={idx} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <CustomInput
                                            name={`deliverables[${idx}]`}
                                            value={d}
                                            onChange={(e) => updateDeliverable(idx, e.target.value)}
                                            error={errors[`deliverables[${idx}]`]}
                                            placeholder={t('profileChat.exampleDeliverable') || 'Enter deliverable'}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeDeliverable(idx)}
                                        disabled={form.deliverables.length <= 1}
                                        className={`px-2 py-2 sm:py-2 text-xs sm:text-sm rounded-md border border-gray-300 text-red-500 hover:bg-gray-100 ${
                                            form.deliverables.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        aria-label={t('profileChat.remove') || 'Remove deliverable'}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
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
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">
                            {t('profileChat.workSteps') || 'Work Steps'}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2 sm:space-y-3">
                            {form.workSteps.map((ws, idx) => (
                                <div key={idx} className="border rounded-md p-2 sm:p-3 space-y-2 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <CustomInput
                                            label={t('profileChat.seq') || 'Seq'}
                                            name={`workSteps[${idx}].seq`}
                                            type="number"
                                            value={ws.seq.toString()}
                                            onChange={(e) => updateWorkStep(idx, 'seq', Number(e.target.value))}
                                            error={errors[`workSteps[${idx}].seq`]}
                                            readonly
                                        />
                                        <CustomInput
                                            label={t('profileChat.description') || 'Description'}
                                            name={`workSteps[${idx}].description`}
                                            value={ws.description}
                                            onChange={(e) => updateWorkStep(idx, 'description', e.target.value)}
                                            error={errors[`workSteps[${idx}].description`]}
                                            placeholder={t('profileChat.exampleWorkStep') || 'Enter work step description'}
                                            required
                                        />
                                        <CustomInput
                                            label={t('profileChat.amount') || 'Amount'}
                                            name={`workSteps[${idx}].amount`}
                                            type="number"
                                            value={ws.amount === 0 ? '' : ws.amount.toString()}
                                            onChange={(e) => updateWorkStep(idx, 'amount', Number(e.target.value))}
                                            error={errors[`workSteps[${idx}].amount`]}
                                            placeholder="0"
                                            required
                                        />
                                        <CustomInput
                                            label={t('profileChat.workingDays') || 'Working Days'}
                                            name={`workSteps[${idx}].workingDays`}
                                            type="number"
                                            value={ws.workingDays === 0 ? '' : ws.workingDays.toString()}
                                            onChange={(e) => updateWorkStep(idx, 'workingDays', Number(e.target.value))}
                                            error={errors[`workSteps[${idx}].workingDays`]}
                                            placeholder="0"
                                            required
                                        />
                                        <CustomInput
                                            label={t('profileChat.status') || 'Status'}
                                            name={`workSteps[${idx}].status`}
                                            value={ws.status}
                                            onChange={(e) => updateWorkStep(idx, 'status', e.target.value)}
                                            error={errors[`workSteps[${idx}].status`]}
                                            readonly
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <CustomInput
                                            label={t('profileChat.startingDay') || 'Starting Day'}
                                            name={`workSteps[${idx}].startingDay`}
                                            type="date"
                                            value={ws.startingDay}
                                            onChange={(e) => updateWorkStep(idx, 'startingDay', e.target.value)}
                                            error={errors[`workSteps[${idx}].startingDay`]}
                                            required
                                        />
                                        <CustomInput
                                            label={t('profileChat.deliveryDay') || 'Delivery Day'}
                                            name={`workSteps[${idx}].deliveryDay`}
                                            type="date"
                                            value={ws.deliveryDay}
                                            error={errors[`workSteps[${idx}].deliveryDay`]}
                                            readonly
                                            required
                                        />
                                    </div>
                                    {idx !== 0 && (
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => removeWorkStep(idx)}
                                                className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-500 rounded-md border border-gray-300 hover:bg-gray-100"
                                                aria-label={t('profileChat.removeStep') || 'Remove work step'}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    )}
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

                    <CustomInput
                        label={t('profileChat.note') || 'Note (optional)'}
                        name="note"
                        type="textarea"
                        value={form.note || ''}
                        onChange={(e) => updateField('note', e.target.value)}
                        error={errors['note']}
                        placeholder={t('profileChat.note') || 'Enter additional notes'}
                    />

                    {errors['form'] && (
                        <p className="text-xs sm:text-sm text-red-600" id="form-error">
                            {errors['form']}
                        </p>
                    )}

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