import { WorkFlowStatus } from "@/types/workflow"; 
import { Check, Clock, AlertCircle, X } from "lucide-react";

interface WorkflowStepperProps {
  status: WorkFlowStatus;
}

interface Step {
  id: number;
  name: string;
  status: "completed" | "current" | "pending" | "cancelled";
}

export const WorkflowStepper = ({ status }: WorkflowStepperProps) => {
  const getSteps = (currentStatus: WorkFlowStatus): Step[] => {
    const steps: Step[] = [
      { id: 1, name: "Quotation", status: "pending" },
      { id: 2, name: "Work in Progress", status: "pending" },
      { id: 3, name: "Review", status: "pending" },
      { id: 4, name: "Completed", status: "pending" },
    ];

    if (currentStatus === WorkFlowStatus.Cancelled) {
      return steps.map(step => ({ ...step, status: "cancelled" as const }));
    }

    // Update step statuses based on current workflow status
    switch (currentStatus) {
      case WorkFlowStatus.QuotationPending:
        steps[0].status = "current";
        break;
      case WorkFlowStatus.OrderApproved:
        steps[0].status = "completed";
        steps[1].status = "current";
        break;
      case WorkFlowStatus.InProgress:
        steps[0].status = "completed";
        steps[1].status = "current";
        break;
      case WorkFlowStatus.PendingEmployerReview:
        steps[0].status = "completed";
        steps[1].status = "completed";
        steps[2].status = "current";
        break;
      case WorkFlowStatus.Completed:
        steps.forEach(step => (step.status = "completed"));
        break;
    }

    return steps;
  };

  const steps = getSteps(status);

  const getStepIcon = (step: Step) => {
    switch (step.status) {
      case "completed":
        return <Check className="w-4 h-4 text-white" />;
      case "current":
        return <Clock className="w-4 h-4 text-white" />;
      case "cancelled":
        return <X className="w-4 h-4 text-white" />;
      default:
        return <div className="w-2 h-2 bg-white rounded-full" />;
    }
  };

  const getStepColor = (step: Step) => {
    switch (step.status) {
      case "completed":
        return "bg-[#16a249]";
      case "current":
        return "bg-[#0066ff]";
      case "cancelled":
        return "bg-[##ef4343]";
      default:
        return "bg-text-secondary";
    }
  };

  if (status === WorkFlowStatus.Cancelled) {
    return (
      <div className="mb-4">
        <div className="flex items-center justify-center p-3 bg-[##ef4343] border border-[##ef4343] rounded-lg">
          <AlertCircle className="w-5 h-5 text-[##ef4343] mr-2" />
          <span className="text-sm font-medium text-[##ef4343]">Project Cancelled</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 bg-white px-4 py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepColor(
                  step
                )} transition-colors`}
              >
                {getStepIcon(step)}
              </div>
              <span className="text-xs text-text-primary mt-1 text-center">
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-border-primary mx-2 mt-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};