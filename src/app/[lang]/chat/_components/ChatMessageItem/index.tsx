"use client";

import Image, {StaticImageData} from "next/image";
import type { ChatMessage } from "lemmy-js-client";
import {MessageImage} from "@/constants/images";
import { useTranslation } from "react-i18next";

type UIChatMessage = ChatMessage & { isOwner?: boolean };

interface ChatMessageItemProps {
  message: UIChatMessage;
  partnerAvatar?: string | StaticImageData;
}

// Light-weight type for proposed quote payload contained in message.content
interface ProposedQuoteMessage {
  type: string;
  quote?: {
    employerId: number;
    postId: number;
    commentId: number;
    amount: number;
    proposal: string;
    projectName: string;
    projectDetails: string;
    workSteps?: Array<{
      seq: number;
      description: string;
      amount: number;
      workingDays: number;
      status: string;
      startingDay: string;
      deliveryDay: string;
    }>;
    workingDays: number;
    deliverables?: string[];
    note?: string;
    startingDay: string;
    deliveryDay: string;
  };
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  partnerAvatar,
}) => {
  const { t } = useTranslation();
  const isIncoming = !message.isOwner;

  const toLocalTime = (iso: string, locale: string) => {
    const format = (d: Date) => d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
    let d = new Date(iso);
    if (!isNaN(d.getTime())) return format(d);
    // Attempt to normalize fractional seconds to 3 digits (e.g., 2025-09-03T03:38:35.079201Z -> .079Z)
    if (iso && iso.includes(".")) {
      try {
        const [head, rest] = iso.split(".");
        // find timezone part
        let tz = "";
        let frac = rest;
        const tzMarkers = ["Z", "+", "-"] as const;
        let idx = -1;
        for (const m of tzMarkers) {
          const i = rest.indexOf(m);
          if (i > 0) { idx = i; break; }
        }
        if (idx >= 0) {
          tz = rest.slice(idx);
          frac = rest.slice(0, idx);
        }
        const frac3 = (frac + "000").slice(0, 3);
        const norm = `${head}.${frac3}${tz || "Z"}`;
        d = new Date(norm);
        if (!isNaN(d.getTime())) return format(d);
      } catch {/* ignore */}
    }
    return "";
  };

  const time = toLocalTime(message.createdAt, "th-TH");

  // Try to parse message.content as JSON for special rendering
  let parsed: ProposedQuoteMessage | null = null;
  if (message.content && message.content.trim().startsWith("{")) {
    try {
      parsed = JSON.parse(message.content) as ProposedQuoteMessage;
    } catch {}
  }
  const isProposedQuote = parsed && parsed.type === "proposed-quote" && parsed.quote;
  const isEmployerAssigned = parsed && (parsed as any).type === "employer-assigned";

  return (
    <div
      data-testid="chat-message"
      className={`flex ${isIncoming ? "justify-start" : "justify-end"}`}
    >
      {isIncoming && (
        <Image
          src={partnerAvatar || MessageImage.chatAvt}
          alt="avatar"
          width={24}
          height={24}
          className="w-6 h-6 rounded-full mr-2 self-end"
        />
      )}
      <div
        className={`flex flex-col gap-1 ${
          isIncoming ? "items-start" : "items-end"
        }`}
      >
        <p className="text-[11px] text-gray-400 flex items-center gap-1">
          {time}
          {!isIncoming && (
            message.status === 0 ? (
              <span className="ml-1 inline-flex items-center gap-1 text-primary">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                Unread
              </span>
            ) : (
              <span className="ml-1 inline-flex items-center gap-1 text-green-600">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                Read
              </span>
            )
          )}
        </p>

        {/* Render quotation card if detected */}
        {isProposedQuote ? (
          <div
            className={`max-w-[90vw] sm:max-w-md rounded-xl shadow-sm ring-1 ${
              isIncoming ? "bg-white ring-gray-200" : "bg-blue-50 ring-blue-200"
            } overflow-hidden`}
          >
            <div className={`px-4 py-3 ${isIncoming ? "bg-gray-50" : "bg-blue-100"}`}>
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {parsed!.quote!.projectName}
                </h4>
                <div className="text-sm font-bold text-blue-700">
                  {parsed!.quote!.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="mt-1 text-xs text-gray-600 flex flex-wrap gap-x-3 gap-y-1">
                <span>Start: {parsed!.quote!.startingDay}</span>
                <span>Due: {parsed!.quote!.deliveryDay}</span>
                <span>Days: {parsed!.quote!.workingDays}</span>
              </div>
            </div>
            <div className="px-4 py-3 space-y-2">
              <p className="text-sm text-gray-800 whitespace-pre-line">
                {parsed!.quote!.proposal}
              </p>
              {parsed!.quote!.projectDetails && (
                <details className="text-xs text-gray-700">
                  <summary className="cursor-pointer select-none text-gray-600">Project details</summary>
                  <div className="mt-1 whitespace-pre-line">{parsed!.quote!.projectDetails}</div>
                </details>
              )}
              {parsed!.quote!.deliverables && parsed!.quote!.deliverables.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-1">Deliverables</div>
                  <ul className="list-disc list-inside text-sm text-gray-800 space-y-0.5">
                    {parsed!.quote!.deliverables.map((d, i) => (
                      <li key={i} className="break-words">{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              {parsed!.quote!.workSteps && parsed!.quote!.workSteps.length > 0 && (
                <div className="border-t pt-2">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Work steps</div>
                  <div className="space-y-1">
                    {parsed!.quote!.workSteps.map((ws, i) => (
                      <div key={i} className="text-xs text-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 bg-gray-50 rounded p-2">
                        <div className="font-medium text-gray-800">#{ws.seq} {ws.description}</div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <span>{ws.amount.toLocaleString()}</span>
                          <span>{ws.workingDays} days</span>
                          <span>{ws.status}</span>
                          <span>{ws.startingDay} → {ws.deliveryDay}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {parsed!.quote!.note && (
                <div className="border-t pt-2 text-xs text-gray-600">
                  <span className="font-semibold text-gray-700">Note: </span>
                  {parsed!.quote!.note}
                </div>
              )}
            </div>
          </div>
        ) : isEmployerAssigned ? (
          <div className="max-w-[90vw] sm:max-w-md w-full rounded-xl shadow-sm ring-1 ring-green-200 bg-green-50 px-4 py-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293A1 1 0 106.293 10.707l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="text-sm font-medium text-green-800">
                  {t('profileChat.confirmAssignMsg') || 'Assignment confirmed. Waiting for freelancer to accept.'}
                </div>
                <div className="mt-0.5 text-xs text-green-700">
                  The order has been approved. You can proceed to payment when invoice is ready.
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Default text message bubble
          message.content?.trim() && (
            <div
              className={`max-w-[80vw] sm:max-w-xs px-3 py-2 rounded-2xl text-[15px] leading-relaxed font-sans break-words whitespace-pre-line shadow-sm ${
                isIncoming
                  ? "bg-white text-gray-800 rounded-bl-sm ring-1 ring-gray-200"
                  : "bg-primary text-white rounded-br-sm"
              }`}
            >
              {message.content}
            </div>
          )
        )}

        {/*{message.fileUrl && (*/}
        {/*  <div className="mt-1 max-w-[80vw] sm:max-w-xs">*/}
        {/*    <FilePreview*/}
        {/*      fileUrl={message.fileUrl}*/}
        {/*      fileType={message.fileType || "application/octet-stream"}*/}
        {/*      fileName={message?.fileName || "Attach file"}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    </div>
  );
};

export default ChatMessageItem;
