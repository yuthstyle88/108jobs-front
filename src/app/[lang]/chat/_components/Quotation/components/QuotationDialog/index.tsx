"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

const MAX_TOTAL_SIZE = 10 * 1024 * 1024;

const schema = z.object({
  serviceTitle: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Please add more details"),
  amount: z.coerce.number().positive("Amount must be > 0"),
  currency: z.string().min(1),
  estimatedDays: z.coerce.number().int().min(1, ">= 1 day"),
  startDate: z.string().optional(),
  notes: z.string().optional(),
  milestones: z
    .array(
      z.object({
        title: z.string().min(1),
        amount: z.coerce.number().min(0),
        dueDate: z.string().optional(),
      }),
    )
    .optional(),
    attachments: z
    .any()
    .optional()
    .refine(
      (val) => !val || (typeof FileList !== "undefined" && val instanceof FileList),
      "Invalid file list",
    )
    .refine(
      (val) =>
        !val ||
        Array.from(val as FileList).every((f) => ACCEPTED_TYPES.includes(f.type)),
      "Only PDF, DOC/DOCX, PNG, JPG are allowed",
    )
    .refine(
      (val) =>
        !val ||
        Array.from(val as FileList).reduce((s, f) => s + f.size, 0) <= MAX_TOTAL_SIZE,
      "Total size must be ≤ 10MB",
    ),
});

export type QuotationFormValues = z.infer<typeof schema>;

interface QuotationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuotationFormValues) => void;
  isSubmitting?: boolean;
  title?: string;
  defaultValues?: Partial<QuotationFormValues>;
  currencyOptions?: string[];
}

const QuotationDialog: React.FC<QuotationDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  title = "Submit Quotation",
  defaultValues,
  currencyOptions = ["VND", "USD", "THB"],
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<QuotationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceTitle: "",
      description: "",
      amount: 0,
      currency: currencyOptions[0] ?? "VND",
      estimatedDays: 7,
      startDate: "",
      notes: "",
      milestones: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "milestones" });
  const hasMilestones = (watch("milestones")?.length || 0) > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} closeOnOutsideClick={false} className="min-w-[650px]">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 text-text-primary"
                aria-label="Quotation form "
            >
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-primary">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Service Title<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register("serviceTitle", { required: "Title is required" })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholder="e.g., Landing page design"
                        />
                        {errors.serviceTitle && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.serviceTitle.message}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Description / Work Scope<span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register("description", {
                                required: "Description is required",
                                minLength: { value: 10, message: "Please add more details" },
                            })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 h-28"
                            placeholder="What will be delivered, acceptance criteria, exclusions..."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Amount<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min={0}
                            {...register("amount", {
                                required: "Amount is required",
                                valueAsNumber: true,
                                min: { value: 0, message: "Amount must be >= 0" },
                            })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholder="e.g., 500"
                        />
                        {errors.amount && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Currency</label>
                        <select
                            {...register("currency")}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            {currencyOptions.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Estimated Days<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min={1}
                            {...register("estimatedDays", {
                                required: "Estimated days is required",
                                valueAsNumber: true,
                                min: { value: 1, message: "Must be at least 1 day" },
                            })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholder="e.g., 7"
                        />
                        {errors.estimatedDays && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.estimatedDays.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Start Date</label>
                        <input
                            type="date"
                            {...register("startDate")}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <input
                            type="text"
                            {...register("notes")}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholder="Optional note to employer"
                        />
                    </div>
                </div>

                {/* Attachments */}
                <div>
                    <label className="block text-sm font-medium mb-1">Attachments</label>
                    <input
                        type="file"
                        multiple
                        {...register("attachments")}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Accepted: PDF, DOCX, PNG, JPG… (optional)
                    </p>
                </div>

                {/* Milestones */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Milestones (optional)</span>
                        <button
                            type="button"
                            onClick={() =>
                                append({ title: "", amount: 0, dueDate: "" })
                            }
                            className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                            + Add milestone
                        </button>
                    </div>

                    {hasMilestones && (
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-3 md:items-end"
                                >
                                    {/* Title */}
                                    <div className="md:col-span-3">
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            {...register(`milestones.${index}.title` as const, { required: "Required" })}
                                            className="w-full h-10 rounded-md border border-gray-300 px-3"
                                            placeholder="Design phase"
                                        />
                                    </div>

                                    {/* Amount */}
                                    <div className="md:col-span-3">
                                        <label className="block text-sm font-medium mb-1">Amount</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min={0}
                                            {...register(`milestones.${index}.amount` as const, {
                                                required: "Required",
                                                valueAsNumber: true,
                                                min: { value: 0, message: ">= 0" },
                                            })}
                                            className="w-full h-10 rounded-md border border-gray-300 px-3"
                                            placeholder="200"
                                        />
                                    </div>

                                    {/* Due Date */}
                                    <div className="md:col-span-3">
                                        <label className="block text-sm font-medium mb-1">Due Date</label>
                                        <input
                                            type="date"
                                            {...register(`milestones.${index}.dueDate` as const)}
                                            className="w-full h-10 rounded-md border border-gray-300 px-3 min-w-[160px]"
                                        />
                                    </div>

                                    {/* Remove */}
                                    <div className="md:col-span-3 flex md:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="bg-red-50 px-3 h-10 rounded-md border border-red-300 hover:bg-red-50 whitespace-nowrap shrink-0"
                                            aria-label={`Remove milestone ${index + 1}`}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-60"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Quotation"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default QuotationDialog;
