"use client";
import Modal from "@/components/ui/Modal";

interface RejectJobCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleConfirmChange: () => void;
}

const RejectJobCreateModal: React.FC<RejectJobCreateModalProps> = ({
  isOpen,
  onClose,
  handleConfirmChange,
}) => {
  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      className="max-w-lg p-0 w-full"
      closeOnOutsideClick={false}
      title="Chi tiết về công việc không được phê duyệt"
    >
      <section className="px-[12px] w-full flex flex-col">
        <article>
          <h1 className="text-[14px] font-medium text-text-primary">
            Thông tin dịch vụ
          </h1>
          <ul className="list-disc pl-4 text-text-secondary">
            <li>
              <p className="text-[14px] font-sans text-text-secondary">
                Nộp thành công! Vui lòng đợi kết quả phê duyệt từ hệ thống.
              </p>
            </li>
            <li>
              <p className="text-[14px] font-sans text-text-secondary">
                Vui lòng mô tả trực quan công việc của bạn, bao gồm các dịch vụ
                bạn cung cấp như thiết kế, dịch thuật, in ấn, tư vấn, v.v....
                Nếu có sẵn mẫu sản phẩm, bạn có thể giải thích và đính kèm hình
                ảnh vào hồ sơ dịch vụ. Tuy nhiên, việc sử dụng hình ảnh làm chủ
                đề công việc hoặc mô tả dịch vụ có thể khiến người thuê hiểu
                rằng bạn chỉ nhận duy nhất công việc đó.
              </p>
            </li>
          </ul>
        </article>
        <article>
          <h1 className="text-[14px] font-medium text-text-primary pt-2">
            Tải lên hình ảnh dịch vụ
          </h1>
          <ul className="list-disc pl-4 text-text-secondary">
            <li>
              <p className="text-[14px] font-sans text-text-secondary">
                Vui lòng tải lên ít nhất 3 hình ảnh sản phẩm liên quan đến danh
                mục công việc của bạn, đảm bảo không trùng lặp. Điều này giúp hồ
                sơ của bạn thể hiện được sự đa dạng.
              </p>
            </li>
          </ul>
        </article>
      </section>
      <div className="flex flex-row gap-2 pt-4 w-full border-t mt-4">
        <button
          onClick={handleConfirmChange}
          className="px-10 py-2 cursor-pointer w-full bg-primary text-white font-normal rounded-md shadow-lg hover:bg-[#063a68] transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Đã hiểu
        </button>
      </div>
    </Modal>
  );
};

export default RejectJobCreateModal;
