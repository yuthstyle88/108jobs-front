// components/Quotation.tsx
"use client";

import { Pen } from "lucide-react";
import React, { useState } from "react";
import QuotationDialog, { QuotationFormValues } from "./components/QuotationDialog";
import { QuotationModel } from "./components/QuotationCard";

interface Props {
  onCreated?: (q: QuotationModel) => void;
}

const Quotation: React.FC<Props> = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

    const handleSubmit = async (data: QuotationFormValues) => {
    setSubmitting(true);
    try {
      const base = data.startDate ? new Date(data.startDate) : new Date();
      const due = new Date(base);
      due.setDate(base.getDate() + data.estimatedDays);

      const item: QuotationModel = {
        id: crypto.randomUUID(),
        card: {
          serviceTitle: data.serviceTitle,
          amount: data.amount,
          currency: data.currency,
          paymentDueDate: due.toISOString(),
          createdAt: new Date().toISOString(),
        },
        form: {
          ...data,
          milestones: data.milestones ?? [],
        },
      };

      onCreated?.(item);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2">
        <button
          onClick={() => setOpen(true)}
          className="text-third shadow-recipe-shadow rounded-2xl px-6 py-2 cursor-pointer border bg-white"
        >
          <div className="flex items-center gap-2">
            <Pen className="w-4 h-4" />
            <p>Create a quotation</p>
          </div>
        </button>
      </div>

      <QuotationDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        title="Submit Quotation"
      />
    </>
  );
};

export default Quotation;
