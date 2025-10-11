import React from "react";

interface Props {
    isOwner: boolean | undefined;
    msgStatus: "pending" | "sent" | "failed";
    unread?: boolean;
    showReceipt: boolean | undefined;
    readByPeer: boolean | undefined;
    readTime: string | null
    deliveredButUnread: boolean | undefined;
    t: any;
    onRetry?: () => void; // <- allow parent to wire resend.flushActive(roomId)
}

const SentIcon = () => (
    <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M2 12l9 7 11-14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ReadIcon = () => (
    <svg className="w-4 h-4 inline-block text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M1 13l4-4 6 6 11-11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const DeliveredIcon = () => (
    <svg className="w-4 h-4 inline-block text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M2 12l9 7 11-14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const PendingSpinner = () => (
    <svg className="animate-spin w-4 h-4 inline-block text-gray-400" viewBox="0 0 24 24">
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="60"
            strokeDashoffset="0"
            fill="none"
        />
    </svg>
);

const FailedIcon = () => (
    <svg className="w-4 h-4 inline-block text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 9v4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 17h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const MessageReceipt: React.FC<Props> = ({
                                             isOwner,
                                             msgStatus,
                                             unread,
                                             showReceipt,
                                             readByPeer,
                                             readTime,
                                             deliveredButUnread,
                                             t,
                                             onRetry,
                                         }) => {
    // Incoming messages
    if (!isOwner) {
        if (unread === true) {
            return (
                <span className="ml-1 inline-flex items-center gap-1 text-primary">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500"/>
                    {t("profileChat.unread")}
        </span>
            );
        }
        return null;
    }

    // Outgoing messages
    if (msgStatus === "pending") {
        return (
            <span className="ml-2 inline-flex items-center gap-1 text-gray-500">
        <PendingSpinner/>
        <span className="text-xs">{t("profileChat.sending") || "Sending"}</span>
      </span>
        );
    }

    if (msgStatus === "failed") {
        return (
            <span className="ml-2 inline-flex items-center gap-2 text-red-500">
                <FailedIcon/>
                <span className="text-xs">{t("profileChat.failed") || "Failed"}</span>
                {/** optional retry from parent (will call resend.flushActive(roomId)) */}
                {typeof onRetry === 'function' && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="text-xs px-2 py-0.5 rounded border border-red-400 text-red-600 hover:bg-red-50"
                    >
                        {t("profileChat.retry") || "Retry"}
                    </button>
                )}
            </span>
        );
    }

    // msgStatus === "sent"
    if (showReceipt) {
        if (readByPeer) {
            return (
                <span className="ml-1 inline-flex items-center gap-1 text-green-600 text-xs">
                    <ReadIcon/>
                    <span>{t("profileChat.read") || "Read"}</span>
                    <span className="opacity-70">{readTime}</span>
                </span>
            );
        }
        if (deliveredButUnread) {
            return (
                <span className="ml-1 inline-flex items-center gap-1 text-blue-600">
                    <DeliveredIcon/>
                    <span className="text-xs">{t("profileChat.unread") || "Delivered"}</span>
                </span>
            );
        }
        return (
            <span className="ml-1 inline-flex items-center gap-1 text-gray-500">
                <SentIcon/>
                <span className="text-xs">{t("profileChat.sent") || "Sent"}</span>
            </span>
        );
    }

    return null;
};

export default MessageReceipt;
