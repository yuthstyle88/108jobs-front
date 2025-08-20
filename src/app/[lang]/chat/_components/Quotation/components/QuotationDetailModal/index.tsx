// components/quotation/QuotationDetailModal.tsx
"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { QuotationFormValues } from "../QuotationDialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data?: QuotationFormValues | null;
}

function fmtMoney(n: number, currency: string) {
  const locale =
    currency === "VND" ? "vi-VN" : currency === "THB" ? "th-TH" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(n);
}
function fmtDate(iso?: string) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return iso;
  }
}
function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const QuotationDetailModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  const files =
    data.attachments && typeof FileList !== "undefined"
      ? Array.from(data.attachments as FileList)
      : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quotation">
      <div className="space-y-6 text-text-primary">
        {/* Header (serviceTitle) */}
        <section>
          <div className="text-sm text-text-secondary">Quote</div>
          <div className="text-lg font-semibold">{data.serviceTitle}</div>
        </section>

        {/* Description */}
        {data.description && (
          <section>
            <div className="text-sm text-text-secondary mb-1">Description</div>
            <div className="whitespace-pre-wrap">{data.description}</div>
          </section>
        )}

        {/* Basic numbers */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoItem
            label="Amount"
            value={fmtMoney(data.amount, data.currency)}
          />
          <InfoItem label="Currency" value={data.currency} />
          <InfoItem label="Estimated days" value={data.estimatedDays} />
        </section>

        {/* Start date + notes */}
        {(data.startDate || data.notes) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Start date" value={fmtDate(data.startDate)} />
            {data.notes && <InfoItem label="Notes" value={data.notes} />}
          </section>
        )}

        {/* Milestones */}
        {data.milestones && data.milestones.length > 0 && (
          <section>
            <div className="text-sm font-medium mb-2">Milestones</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-text-secondary">
                    <th className="py-2 pr-4 text-left">Title</th>
                    <th className="py-2 pr-4 text-left">Amount</th>
                    <th className="py-2 pr-4 text-left">Due date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.milestones.map((m, idx) => (
                    <tr key={idx} className="border-t border-border-primary">
                      <td className="py-2 pr-4">{m.title}</td>
                      <td className="py-2 pr-4">
                        {fmtMoney(m.amount, data.currency)}
                      </td>
                      <td className="py-2 pr-4">{fmtDate(m.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Attachments (FileList) */}
        {files.length > 0 && (
          <section>
            <div className="text-sm font-medium mb-2">Attachments</div>
            <ul className="space-y-2 text-sm">
              {files.map((f) => (
                <li key={f.name} className="flex items-center justify-between">
                  <span className="truncate">{f.name}</span>
                  <span className="text-text-secondary ml-3">
                    {fmtSize(f.size)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-border-primary hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

const InfoItem: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="border border-border-primary rounded-lg p-3">
    <div className="text-xs text-text-secondary">{label}</div>
    <div className="text-sm font-medium">{value ?? "-"}</div>
  </div>
);

export default QuotationDetailModal;
