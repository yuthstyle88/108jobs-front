"use client";
import Modal from "@/components/ui/Modal";
import { CircleCheck } from "lucide-react";


interface SuccessCreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleConfirmChange: () => void;
}

const SuccessCreateJobModal: React.FC<SuccessCreateJobModalProps> = ({
  isOpen,
  onClose,
  handleConfirmChange,
}) => {

  const handleCloseModal = () => {
    onClose();
    window.location.href = "/seller/my-service";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      className="max-w-md p-0 w-full"
      closeOnOutsideClick={false}
    >
      <section className="px-[12px] w-full flex flex-col gap-8 justify-center items-center">
        <CircleCheck className="w-[65px] h-[65px] text-[#1EB899]" />
        <article>
          <h1 className="text-[18px] font-medium text-text_primary text-center">
            Thông tin của bạn đang được xử lý và có thể mất 02 ngày làm việc.
          </h1>
          <p className="text-[14px] font-sans text-text_secondary text-center pt-3">
            Nộp thành công! Vui lòng đợi kết quả phê duyệt từ hệ thống.
          </p>
        </article>
      </section>
      <div className="flex flex-row gap-2 justify-end items-end pt-8 w-full">
        <button
          onClick={handleConfirmChange}
          className="px-10 py-3 cursor-pointer w-fit bg-blue-600 text-white font-normal rounded-md shadow-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Đã hiểu
        </button>
      </div>
    </Modal>
  );
};

export default SuccessCreateJobModal;
