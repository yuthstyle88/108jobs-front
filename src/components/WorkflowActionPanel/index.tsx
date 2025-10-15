// WorkflowActionPanel.tsx
import React from "react";
import {ActionButton} from "@/modules/chat/components/ActionButton";
import {WorkFlowAction} from "@/modules/chat/types/workflow";

interface WorkflowActionPanelProps {
    actions: WorkFlowAction[];
    loading?: string | boolean;
    onAction: (action: WorkFlowAction, payload?: any) => void;
    /** Available wallet balance (THB) */
    availableBalance?: number;
    /** Required amount to approve (THB) */
    requiredAmount?: number;
}

// Label map (สามารถต่อกับ i18n ได้)
const ACTION_LABELS: Record<WorkFlowAction, string> = {
    submitQuotation: "Submit Quotation",
    approveOrder: "Approve Order",
    startWork: "Start Work",
    submitDelivery: "Submit Delivery",
    requestRevision: "Request Revision",
    releasePayment: "Release Payment",
    cancel: "Cancel Job",
    restart: "Restart",
};

export const WorkflowActionPanel: React.FC<WorkflowActionPanelProps> = ({
    actions,
    loading,
    onAction,
    availableBalance,
    requiredAmount,
}) => {
    const canApprove =
      typeof availableBalance === 'number' && typeof requiredAmount === 'number'
        ? availableBalance >= requiredAmount
        : true; // default allow when numbers are not provided

    const hadApproveAction = actions?.includes('approveOrder');
    const approveHidden = hadApproveAction && !canApprove;

    const handleClick = (action: WorkFlowAction) => {
        if (action === 'approveOrder' && approveHidden) {
            alert('Insufficient balance to approve this order.');
            return;
        }
        onAction(action);
    };

    const displayActions = actions.filter((a) => a !== 'approveOrder' || canApprove);

    return (
      <div className="w-full p-3 bg-white/90 backdrop-blur rounded-xl shadow-md border border-gray-200 flex flex-col gap-3">
        {displayActions.length === 0 ? null : (
          <>
            {displayActions.map((a) => (
              <div key={a} className="w-full transition-transform hover:translate-y-[-1px]">
                <ActionButton
                  action={a}
                  label={ACTION_LABELS[a] || a}
                  loading={loading === true || loading === a}
                  variant={a === 'cancel' ? 'destructive' : 'default'}
                  className={
                    a === 'cancel'
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-100 disabled:brightness-110 disabled:saturate-125'
                      : undefined
                  }
                  onClick={() => handleClick(a)}
                />
              </div>
            ))}

            {approveHidden && (
              <div className="text-xs text-center mt-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-md py-2 px-3">
                ยอดเงินคงเหลือไม่เพียงพอ โปรดเติมเงินหรือปรับจำนวนเงินก่อนอนุมัติ
              </div>
            )}
          </>
        )}
      </div>
    );
};

export default WorkflowActionPanel;