"use client";
import { Info } from "lucide-react";
import React, { useState } from "react";
import RejectJobCreateModal from "../RejectJobCreateModal";

type StatusInfo = {
  bgColor: string;
  textColor: string;
  statusText: string;
};

type Props = {
  status: number;
};

const statusType: Record<number, StatusInfo> = {
  0: {
    bgColor: "bg-[#e8eaee]",
    textColor: "text-[#728197]",
    statusText: "Draft",
  },
  1: {
    bgColor: "bg-[#f9edc8]",
    textColor: "text-[#8e6f10]",
    statusText: "Pending approval",
  },
  2: {
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    statusText: "Approved",
  },
  3: {
    bgColor: "bg-[#fde5e3]",
    textColor: "text-[#b82214]",
    statusText: "Rejected",
  },
};

const JobCreatedStatus = ({ status }: Props) => {
  const statusInfo = statusType[status] || {
    bgColor: "bg-gray-200",
    textColor: "text-gray-500",
    statusText: "Unknown status",
  };
 const [isModalOpen, setIsModalOpen] = useState(false);

  const showReasonReject = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center">
      <span
        className={`${statusInfo.bgColor} ${statusInfo.textColor} px-[0.625rem] py-1 rounded-[0.375rem] inline-flex items-center justify-center font-semibold text-[13px] font-sans`}
      >
        {statusInfo.statusText}
      </span>
      {status === 3 && (
        <div
          onClick={() => showReasonReject()}
          className="w-8 h-full flex justify-center cursor-pointer"
        >
          <Info className="w-[13px] text-third" />
        </div>
      )}
      <RejectJobCreateModal
      isOpen={isModalOpen}
      onClose={handleClose}
      handleConfirmChange={() => {
        setIsModalOpen(false);
      }}
      />
    </div>
  );
};

export default JobCreatedStatus;
