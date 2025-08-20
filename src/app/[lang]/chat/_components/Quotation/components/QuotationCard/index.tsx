"use client";
import React from "react";
import { QuotationFormValues } from "../QuotationDialog";

export type QuotationModel = {
  id: string;
  card: {
    serviceTitle: string;
    amount: number;
    currency: string;
    paymentDueDate: string; // ISO
    createdAt: string;      // ISO
  };
  form: QuotationFormValues; 
};

function formatMoney(n: number, currency: string) {
  const map: Record<string, string> = { VND: "vi-VN", THB: "th-TH", USD: "en-US" };
  const locale = map[currency] ?? "en-US";
  const cur = currency === "VND" ? "VND" : currency;
  return new Intl.NumberFormat(locale, { style: "currency", currency: cur }).format(n);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

interface Props {
  data: QuotationModel["card"];
  onView: () => void;
  onDownload?: () => void;
}

const QuotationCard: React.FC<Props> = ({ data, onView, onDownload }) => {
  return (
    <div className="w-full max-w-sm bg-white border rounded-xl shadow-sm text-text-primary">
      <div className="p-4">
        <h3 className="text-lg font-semibold">Quote</h3>
        <p className="text-sm text-gray-600">{data.serviceTitle}</p>

        <div className="mt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Payment due date</span>
            <span className="text-gray-800">{formatDate(data.paymentDueDate)}</span>
          </div>
          <div className="mt-2 font-semibold">
            <span className="text-gray-800">Net payment</span>
            <div className="mt-1">{formatMoney(data.amount, data.currency)}</div>
          </div>
        </div>

        <hr className="my-3" />

        <div className="flex items-center justify-center gap-6">
          <button onClick={onView} className="text-blue-600 hover:underline">View</button>
          <span className="text-gray-300">|</span>
          <button
            onClick={onDownload}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            Download
            <span className="inline-block align-middle">⬇️</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationCard;
