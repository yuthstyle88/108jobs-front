"use client";
import {Info} from "lucide-react";
import {useState} from "react";
import RejectJobCreateModal from "../RejectJobCreateModal";

type Props = {
  status: number;
  languageMap: Record<string, string>; // อัปเดตชนิดของ languageMap
};


const statusType: Record<
  number,
  {bgColor: string; textColor: string; key: string}
> = {
  0: {
    bgColor: "bg-[#e8eaee]",
    textColor: "text-[#728197]",
    key: "statusDraft",
  },
  1: {
    bgColor: "bg-[#f9edc8]",
    textColor: "text-[#8e6f10]",
    key: "statusPending",
  },
  2: {
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    key: "statusApproved",
  },
  3: {
    bgColor: "bg-[#fde5e3]",
    textColor: "text-[#b82214]",
    key: "statusRejected",
  },
};

const JobCreatedStatus = ({status, languageMap}: Props) => {
  const statusInfo = statusType[status] || {
    bgColor: "bg-gray-200",
    textColor: "text-gray-500",
    key: "statusDraft",
  };

  const text = languageMap?.[statusInfo.key] ?? "Unknown status";

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showReasonReject = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <div className="flex items-center">
      <span
        className={`${statusInfo.bgColor} ${statusInfo.textColor} px-[0.625rem] py-1 rounded-[0.375rem] inline-flex items-center justify-center font-semibold text-[13px] font-sans`}
      >
        {text}
      </span>
      {status === 3 && (
        <div
          onClick={showReasonReject}
          className="w-8 h-full flex justify-center cursor-pointer"
        >
          <Info className="w-[13px] text-third"/>
        </div>
      )}
      <RejectJobCreateModal
        isOpen={isModalOpen}
        onClose={handleClose}
        handleConfirmChange={handleClose}
      />
    </div>
  );
};

export default JobCreatedStatus;
