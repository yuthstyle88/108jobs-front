// WorkflowActionPanel.tsx
import React from "react";
import { ActionButton } from "@/components/ui/ActionButton";
import { WorkFlowAction } from "@/types/workflow";

interface WorkflowActionPanelProps {
    actions: WorkFlowAction[];
    loading?: string | boolean;
    onAction: (action: WorkFlowAction, payload?: any) => void;
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

// Prompt field mapping สำหรับบาง action ที่ต้องใส่ข้อมูลเพิ่ม
const PROMPT_FIELDS: Record<WorkFlowAction, { key: string; label: string; defaultValue?: string }[]> = {
  submitQuotation: [
    { key: "price", label: "Quotation price (THB):", defaultValue: "5000" },
    { key: "days", label: "Duration (days):", defaultValue: "7" },
  ],
  approveOrder: [],
  startWork: [],
  submitDelivery: [],
  requestRevision: [
    { key: "note", label: "Revision note:", defaultValue: "" },
  ],
  releasePayment: [],
  cancel: [],
  restart: [],
};

export const WorkflowActionPanel: React.FC<WorkflowActionPanelProps> = ({
    actions,
    loading,
    onAction,
}) => {
    const handleClick = (action: WorkFlowAction) => {
        const prompts = PROMPT_FIELDS[action];
        let payload: Record<string, any> | undefined;

        if (prompts?.length) {
            payload = {};
            for (const field of prompts) {
                const val = prompt(field.label, field.defaultValue ?? "");
                if (val == null) return; // user cancelled
                payload[field.key] = isNaN(Number(val)) ? val : Number(val);
            }
        }

        onAction(action, payload);
    };

    return (
      <div className="w-full p-3 bg-white/90 backdrop-blur rounded-xl shadow-md border border-gray-200 flex flex-col gap-3">
          {actions.length === 0 ? (
            <div className="text-xs text-gray-500 text-center py-3">
                No actions available.
            </div>
          ) : (
            actions.map((a) => (
              <div key={a} className="w-full transition-transform hover:translate-y-[-1px]">
                <ActionButton
                  action={a}
                  label={ACTION_LABELS[a] || a}
                  loading={loading === true || loading === a}
                  variant={a === "cancel" ? "destructive" : "default"}
                  className={
                    a === "cancel"
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-100 disabled:brightness-110 disabled:saturate-125"
                      : undefined
                  }
                  onClick={() => handleClick(a)}
                />
              </div>
            ))
          )}
      </div>
    );
};

export default WorkflowActionPanel;