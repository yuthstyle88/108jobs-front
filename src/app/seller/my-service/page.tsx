"use client";
import { API_ROUTES_SELLER } from "@/api/endpoints";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import { SellerImage } from "@/constants/images";
import { usePrivateDelete, usePrivateFetch } from "@/hooks/api-hooks";
import { JobListResponse } from "@/types/job";
import { Eye, Info, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import JobCreatedStatus from "./_components/JobCreatedStatus";
import { useState } from "react";
import ConfirmDeleteModal from "./_components/ConfirmDeleteModal";

const MyServices = () => {
  const {
    data: jobsData,
    isLoading,
    mutate,
  } = usePrivateFetch<JobListResponse>(API_ROUTES_SELLER.job.get_job);

  const [selectedJob, setSelectedJob] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { isMutating, trigger: deleteJob } = usePrivateDelete(
    API_ROUTES_SELLER.job.get_job + "/" + selectedJob?.id
  );

  const handleOpenModal = (jobId: string, jobName: string) => {
    setSelectedJob({ id: jobId, name: jobName });
  };
  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedJob) {
      await deleteJob();
      setSelectedJob(null);
      mutate();
    }
  };

  return (
    <div className="">
      <div className="my-service-gradient rounded-lg shadow-sm p-6 mb-8 flex justify-between items-center hover:shadow-jobCard duration-300">
        <div className="flex-1">
          <h2 className="text-lg font-medium mb-2 text-text_primary">
            Tính phí dịch vụ
          </h2>
          <p className="text-gray-600 text-sm">
            Phí dịch vụ được tính 15% trên giá trị mà freelancer nhận được
          </p>
          <Link href="/content/commission">
            <button className="mt-4 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded">
              Nhập để tính toán
            </button>
          </Link>
        </div>
        <div>
          <Image
            src={SellerImage.calculation}
            alt="SellerImage"
            className="max-h-[165px] max-w-[160px] object-cover"
          />
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-medium text-text_primary">
          Dịch vụ của tôi ({jobsData?.jobs.length || 0}/5)
        </h2>
        <Link target="_blank" href="/manage-product/create">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" />
            Thêm dịch vụ mới
          </button>
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start">
        <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <span className="text-gray-700">
            Đối với hồ sơ dịch vụ đang ở trạng thái{" "}
          </span>
          <span className="text-yellow-600 font-medium">Đang chờ duyệt</span>
          <span className="text-gray-700">
            , chúng tôi sẽ xem xét trong vòng 2 ngày làm việc (sau khi tài khoản
            người dùng được phê duyệt)
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 border-b border-gray-200 bg-gray-50">
          <div className="p-4 font-medium text-sm text-gray-700">Dịch vụ</div>
          <div className="p-4 font-medium text-sm text-gray-700">
            Phí dịch vụ (%)
          </div>
          <div className="p-4 font-medium text-sm text-gray-700">
            Trạng thái dịch vụ
          </div>
          <div className="p-4 font-medium text-sm text-gray-700">
            Hiển thị dịch vụ
          </div>
          <div className="p-4 font-medium text-sm text-gray-700">Quản lý</div>
        </div>

        {isLoading ? (
          <div className="w-full flex justify-center items-center h-32">
            <LoadingMultiCircle />
          </div>
        ) : jobsData?.jobs?.length ? (
          jobsData.jobs.map((job) => (
            <div
              key={job.id}
              className="grid grid-cols-5 border-b border-gray-200"
            >
              <div className="p-4 flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3 flex-shrink-0">
                  <Image
                    src={job.user.avatar_url || SellerImage.calculation}
                    alt={job.title}
                    className="w-full h-full object-cover"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="font-medium text-text_primary">{job.title}</div>
              </div>
              <div className="p-4 flex items-center text-text_primary">15%</div>
              <div className="p-4 flex items-center">
                <JobCreatedStatus status={job.status} />
              </div>
              <div className="p-4 flex items-center">
                <Eye
                  className={`w-5 h-5 ${
                    job.show ? "text-gray-700" : "text-gray-400"
                  }`}
                />
              </div>
              <div className="p-4 flex items-center space-x-2">
                <Link target="_blank" href={`/manage-product/${job.id}`}>
                  <button className="p-1 text-gray-500 hover:text-gray-700">
                    <Pencil className="w-4 h-4" />
                  </button>
                </Link>
                <button
                  onClick={() => handleOpenModal(job.id, job.title)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            Chưa có dịch vụ nào
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isDeleteLoading={isMutating}
        isOpen={!!selectedJob}
        jobName={selectedJob?.name || ""}
        onClose={handleCloseModal}
        handleConfirmChange={handleConfirmDelete}
      />
    </div>
  );
};

export default MyServices;
