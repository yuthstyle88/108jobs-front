"use client";
import LoadingCircle from "@/components/LoadingCircle";
import Modal from "@/components/ui/Modal";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobName: string;
  handleConfirmChange: () => void;
  isDeleteLoading: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isDeleteLoading,
  isOpen,
  jobName,
  onClose,
  handleConfirmChange,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-0 w-full"
      closeOnOutsideClick={false}
    >
      <section className="px-[12px] w-full flex flex-col gap-8 justify-center items-center">
        <Trash2 className="w-[65px] h-[65px] text-[#EA6357]" />
        <article className="text-center">
          <h1 className="text-[18px] font-medium text-text_primary">
            Xác nhận xóa dịch vụ
          </h1>
          <h1 className="text-[16px] font-medium text-text_primary">
            {`"${jobName}"`}
          </h1>
          <p className="text-[14px] font-sans text-text_secondary pt-3">
            Sau khi xác nhận xóa dịch vụ, bạn sẽ không thể khôi phục lại dữ
            liệu.
          </p>
        </article>
      </section>
      <div className="flex flex-row gap-2 pt-8 w-full">
        <button
          onClick={onClose}
          className="px-10 py-3 w-full text-text_secondary font-normal rounded-md shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Hủy
        </button>
        <button
          onClick={handleConfirmChange}
          className="px-10 py-3 w-full bg-[#EA6357] text-white font-normal rounded-md shadow-lg hover:bg-[#DE5E53] transition duration-300"
        >
          {isDeleteLoading ? <LoadingCircle/> : "Xác nhận"}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
