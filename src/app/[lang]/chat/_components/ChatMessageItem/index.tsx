"use client";

import Image, {StaticImageData} from "next/image";
import type {ChatMessage} from "lemmy-js-client";
import {MessageImage} from "@/constants/images";
import {useTranslation} from "react-i18next";
import { useChatStore } from "@/core/chat/store/chatStore";
import { useChatServices } from "@/core/chat/contexts/PhoenixChatBridgeProvider";
import React, { useMemo } from "react";
import {toLocalTime} from "@/utils/date";
import MessageReceipt from "@/components/MessageReceipt";

interface ChatMessageItemProps {
    message: ChatMessage;
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
    const {t, i18n} = useTranslation();
    const { resend } = useChatServices();

    // Subscribe to latest message from store so UI auto-updates (ACK/resend/status/content patches)
    const liveMessage = useChatStore((s) => {
        const mid = message?.id;
        if (!mid) return undefined;
        // Prefer committed messages; fallback to pending queue by id
        return s.messages.find((m) => m.id === mid) || s.pendingMessages.find((m) => m.id === mid);
    });
    const viewMsg = liveMessage || message;

    const isIncoming = !viewMsg.isOwner;

    const time = toLocalTime(viewMsg.createdAt as any, i18n?.language || "th-TH");
    // Delivery status (server type: "pending" | "sent" | "failed")
    const msgStatus = (viewMsg.status || "pending") as "pending" | "sent" | "failed";

    // unread may be absent when pending; treat undefined as "unknown"
    const hasUnreadField = typeof (viewMsg as any).unread === "boolean";
    const unreadVal = (viewMsg as any).unread === true;
    const readByPeer = viewMsg.isOwner && hasUnreadField && (viewMsg as any).unread === false;
    const deliveredButUnread = viewMsg.isOwner && hasUnreadField && unreadVal;

    // Show receipt only for outbound messages (isOwner) after send
    const showReceipt = viewMsg.isOwner && msgStatus === "sent";

    // Parse content as JSON only when it changes (auto re-render on updates from store)
    const parsed = useMemo<ProposedQuoteMessage | null>(() => {
        const c = viewMsg?.content;
        if (c && c.trim().startsWith("{")) {
            try { return JSON.parse(c) as ProposedQuoteMessage; } catch {}
        }
        return null;
    }, [viewMsg?.content]);
    const isEmployerStarted = parsed && parsed.type === "employer-started";
    const isProposedQuote = parsed && parsed.type === "proposed-quote" && parsed.quote;
    const isEmployerAssigned = parsed && (parsed as any).type === "employer-assigned";
    const isStartWork = parsed && (parsed as any).type === "start-work";
    const isCancelJob = parsed && (parsed as any).type === "cancel-job";
    const isSubmitDelivery = parsed && (parsed as any).type === "submit-delivery";
    const isRequestRevision = parsed && (parsed as any).type === "request-revision";
    const isDeliveryAccepted = parsed && (parsed as any).type === "delivery-accepted";
    const isFileMsg = parsed && (parsed as any).type === "file";

    // Build a public URL for assets using NEXT_PUBLIC_API_HOST_NAME when href is relative
    const buildPublicUrl = (u?: string) => {
        if (!u) return "";
        if (/^https?:\/\//i.test(u)) return u;
        const host = process.env.NEXT_PUBLIC_API_HOST_NAME || "192.168.1.70:8532";
        const base = host.startsWith("http") ? host : `http://${host}`;
        const sep = u.startsWith("/") ? "" : "/";
        return `${base}${sep}${u}`;
    };

    return (
        <div
            data-testid="chat-message"
            data-status={msgStatus}
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
            <div className={`flex flex-col gap-1 ${isIncoming ? "items-start" : "items-end"}`}>
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    {time}
                    <MessageReceipt
                      isOwner={viewMsg.isOwner}
                      unread={(viewMsg as any).unread}
                      msgStatus={msgStatus}
                      showReceipt={showReceipt}
                      readByPeer={readByPeer}
                      deliveredButUnread={deliveredButUnread}
                      t={t}
                      onRetry={viewMsg.isOwner ? () => {
                        const rid = String((viewMsg as any)?.roomId ?? "");
                        if (rid) {
                          try { resend?.flushActive(rid); } catch {}
                        }
                      } : undefined}
                    />
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
                                    {parsed!.quote!.amount.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
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
                                    <summary className="cursor-pointer select-none text-gray-600">Project details
                                    </summary>
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
                                            <div key={i}
                                                 className="text-xs text-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 bg-gray-50 rounded p-2">
                                                <div
                                                    className="font-medium text-gray-800">#{ws.seq} {ws.description}</div>
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
                    <div
                        className="max-w-[90vw] sm:max-w-md w-full rounded-xl shadow-sm ring-1 ring-green-200 bg-green-50 px-4 py-3">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20"
                                 fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293A1 1 0 106.293 10.707l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"/>
                            </svg>
                            <div>
                                <div className="text-sm font-medium text-green-800">
                                    {t('profileChat.confirmAssignMsg') || 'Assignment confirmed. Waiting for freelancer to accept.'}
                                </div>
                                <div className="mt-0.5 text-xs text-green-700">
                                    {t('profileChat.orderApprovedMessage')}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : isStartWork ? (
                    <div
                        className="max-w-[90vw] sm:max-w-md w-full rounded-xl shadow-sm ring-1 ring-blue-200 bg-blue-50 px-4 py-3">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20"
                                 fill="currentColor" aria-hidden="true">
                                <path d="M6 4l10 6-10 6V4z"/>
                            </svg>
                            <div>
                                <div className="text-sm font-medium text-blue-800">
                                    {t('profileChat.startWorkMsg') || 'Freelancer started work.'}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : isCancelJob ? (
                    <div
                        className="max-w-[90vw] sm:max-w-md w-full rounded-xl shadow-sm ring-1 ring-red-200 bg-red-50 px-4 py-3">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20"
                                 fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3-9a1 1 0 00-1-1H8a1 1 0 100 2h4a1 1 0 001-1z"
                                      clipRule="evenodd"/>
                            </svg>
                            <div>
                                <div className="text-sm font-medium text-red-800">
                                    {t('profileChat.cancelledJobMsg') || 'The job has been cancelled.'}
                                </div>
                                <div className="mt-0.5 text-xs text-red-700">
                                    {t('profileChat.cancelledJobHint') || 'All ongoing actions are stopped. You can start a new chat to discuss again.'}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : isRequestRevision ? (
                    <div
                        className={`max-w-[90vw] sm:max-w-md w-full rounded-xl shadow-sm ring-1 ${isIncoming ? 'ring-amber-200 bg-amber-50' : 'ring-amber-200 bg-amber-50'} px-4 py-3`}>
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24"
                                 fill="currentColor" aria-hidden="true">
                                <path
                                    d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5a1 1 0 10-2 0v6a1 1 0 001 1h4a1 1 0 100-2h-3V7z"/>
                            </svg>
                            <div className="min-w-0">
                                <div className={`text-sm font-semibold text-amber-800`}>
                                    {t('profileChat.requestRevision') || 'Request revision'}
                                </div>
                                <div className="mt-1 text-xs text-amber-900 whitespace-pre-line break-words">
                                    {((parsed as any)?.reason && String((parsed as any).reason)) || t('profileChat.requestRevisionMsg') || 'Please revise and resubmit.'}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : isSubmitDelivery ? (
                    <div
                        className={`max-w-[90vw] sm:max-w-md w-full rounded-xl shadow-sm ring-1 ${isIncoming ? 'ring-amber-200 bg-amber-50' : 'ring-blue-200 bg-blue-50'} px-4 py-3`}>
                        <div className="flex items-start gap-3">
                            <svg
                                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isIncoming ? 'text-amber-600' : 'text-blue-600'}`}
                                viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M3 7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
                            </svg>
                            <div className="min-w-0">
                                <div
                                    className={`text-sm font-medium ${isIncoming ? 'text-amber-800' : 'text-blue-800'}`}>
                                    {t('profileChat.submitDeliveryMsg') || 'Freelancer submitted a delivery.'}
                                </div>
                                <div className="mt-1 text-xs text-gray-700 break-words">
                                    {(parsed as any)?.name || (parsed as any)?.url || ''}
                                </div>
                                {(parsed as any)?.url && (
                                    <div className="mt-2">
                                        <a
                                            href={buildPublicUrl((parsed as any).url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors ${isIncoming ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-primary hover:bg-[#063a68] text-white'}`}
                                        >
                                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"
                                                 aria-hidden="true">
                                                <path
                                                    d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414L9.414 16H5v-4.414l8.293-8.293z"/>
                                            </svg>
                                            <span>{t("global.open")}</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : isDeliveryAccepted ? (
                    <div
                        className="max-w-[90vw] sm:max-w-md w-full rounded-xl shadow-sm ring-1 ring-emerald-200 bg-emerald-50 px-4 py-3">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20"
                                 fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293A1 1 0 106.293 10.707l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"/>
                            </svg>
                            <div>
                                <div className="text-sm font-medium text-emerald-800">
                                    {t('profileChat.deliveryAccepted') || 'Delivery accepted. Proceed to payment.'}
                                </div>
                                <div className="mt-0.5 text-xs text-emerald-700">
                                    {t('profileChat.deliveryAcceptedHint') || 'Payment will be released to the freelancer.'}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : isFileMsg ? (
                    // File attachment bubble
                    <div
                        className={`max-w-[90vw] sm:max-w-md w-full rounded-xl shadow-sm ring-1 overflow-hidden ${isIncoming ? 'bg-white ring-gray-200' : 'bg-blue-50 ring-blue-200'}`}>
                        <div className={`px-4 py-3 ${isIncoming ? 'bg-gray-50' : 'bg-blue-100'}`}>
                            <div className="flex items-start gap-3">
                                {/* Icon/Thumbnail */}
                                {String((parsed as any)?.mime || '').startsWith('image/') && (parsed as any)?.url ? (
                                    <a href={buildPublicUrl((parsed as any).url)} target="_blank"
                                       rel="noopener noreferrer" className="block flex-shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={buildPublicUrl((parsed as any).url)}
                                             alt={(parsed as any)?.name || 'image'}
                                             className="w-16 h-16 object-cover rounded-md ring-1 ring-black/5"/>
                                    </a>
                                ) : (
                                    <div
                                        className={`w-12 h-12 rounded-md flex items-center justify-center ${isIncoming ? 'bg-white' : 'bg-white'} ring-1 ring-black/5 text-gray-600`}
                                        aria-hidden>
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM8 18h8v2H8v-2zm0-4h8v2H8v-2zm6-7v5h5"/>
                                        </svg>
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <a href={buildPublicUrl((parsed as any).url)} target="_blank"
                                           rel="noopener noreferrer"
                                           className="text-sm font-medium text-gray-900 truncate max-w-[220px] sm:max-w-[280px]">
                                            {(parsed as any)?.name || (parsed as any)?.url || 'file'}
                                        </a>
                                        {(parsed as any)?.mime && (
                                            <span
                                                className="text-[10px] px-1.5 py-0.5 rounded bg-white text-gray-700 ring-1 ring-black/5">
                        {String((parsed as any).mime).split('/').pop()}
                      </span>
                                        )}
                                    </div>
                                    {(parsed as any)?.caption && (
                                        <div
                                            className="mt-1 text-xs text-gray-700 whitespace-pre-line break-words">{String((parsed as any).caption)}</div>
                                    )}
                                    {(parsed as any)?.url && (
                                        <div className="mt-2">
                                            <a href={buildPublicUrl((parsed as any).url)} target="_blank"
                                               rel="noopener noreferrer"
                                               className={`inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors ${isIncoming ? 'bg-gray-900 hover:bg-black text-white' : 'bg-primary hover:bg-[#063a68] text-white'}`}>
                                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        d="M12.293 2.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414L9.414 16H5v-4.414l8.293-8.293z"/>
                                                </svg>
                                                <span>{t("global.open")}</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : isEmployerStarted ? (
                    <div
                        className="max-w-[90vw] sm:max-w-md w-full rounded-xl shadow-sm ring-1 ring-blue-200 bg-blue-50 px-4 py-3">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20"
                                 fill="currentColor" aria-hidden="true">
                                <path d="M6 4l10 6-10 6V4z"/>
                            </svg>
                            <div>
                                <div className="text-sm font-medium text-blue-800">
                                    {t('profileChat.startHiring') || 'Employer started hiring.'}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Default text message bubble
                    viewMsg.content?.trim() && (
                        <div
                            className={`max-w-[80vw] sm:max-w-xs px-3 py-2 rounded-2xl text-[15px] leading-relaxed font-sans break-words whitespace-pre-line shadow-sm ${
                                isIncoming
                                    ? "bg-white text-gray-800 rounded-bl-sm ring-1 ring-gray-200"
                                    : "bg-primary text-white rounded-br-sm"
                            }`}
                        >
                            {viewMsg.content}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ChatMessageItem;
