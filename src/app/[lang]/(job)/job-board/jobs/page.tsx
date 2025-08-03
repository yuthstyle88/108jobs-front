"use client";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import {Pagination} from "@/components/Pagination";
import {Badge} from "@/components/ui/Badge";
import {ProfileImage} from "@/constants/images";
import {formatDateTime} from "@/utils/formatDate";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import ConfirmCloseJob from "../_components/ConfirmCloseJobs";
import JobBoardTab from "../_components/JobBoardTab";
import {useHttpGet} from "@/hooks/useHttpGet";
import {useTranslation} from "react-i18next";

const MyJobs = () => {
  const {t} = useTranslation();
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined); // ตัวจัดการ cursor

  const route = useRouter();

  const {
    data: jobPosts,
    pagination,
    isMutating: isJobsLoading,
  } = useHttpGet("listPersonRead", {
    pageCursor: currentCursor, // ส่ง cursor ไปยัง API
  });

  const [selectedJob, setSelectedJob] = useState<{ id: string } | null>(null);

  const handleOpenModal = (jobId: string) => {
    setSelectedJob({ id: jobId });
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedJob) {
      setSelectedJob(null);
    }
  };

  const handlePageChange = (pageCursor: string | null) => {
    setCurrentCursor(pageCursor || undefined);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "opening":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Open
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Closed
          </Badge>
        );
    }
  };

  return (
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="border-b border-gray-200 pb-4 mb-8">
              <JobBoardTab />
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              {isJobsLoading ? (
                  <div className="py-16 text-center">
                    <LoadingMultiCircle />
                  </div>
              ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        {t("profileJob.tableHeaderTitle")}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        {t("profileJob.tableHeaderBudget")}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        {t("profileJob.tableHeaderStatus")}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        {t("profileJob.tableHeaderPostDate")}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                        {t("profileJob.tableHeaderDeadline")}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        {t("profileJob.tableHeaderActions")}
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {jobPosts?.read ? (
                        jobPosts.read.length > 0 ? (
                            jobPosts.read.map((job) => (
                                <tr
                                    key={job.post.id}
                                    onClick={() => route.push(`/job-board/${job.post.id}`)}
                                    className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-start">
                                      <div className="mr-3 mt-1">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                          <path
                                              d="M9 12h6m-3-3v6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                          />
                                        </svg>
                                      </div>
                                      <div>
                                        <Link
                                            prefetch={false}
                                            href={`/job-board/${job.post.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-base transition-colors duration-200 max-w-[300px] line-clamp-1"
                                        >
                                          {job.post.name}
                                        </Link>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 font-medium">
                                    {job.post.budget.toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {getStatusBadge("closed")}
                          </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">
                                    {formatDateTime(job.post.publishedAt, "datetime")}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">
                                    {formatDateTime(job.post.deadline || "", "date")}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-base">
                                    <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          route.push(`/job-board/edit/${job.post.id}`);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors duration-200"
                                    >
                                      {t("profileJob.tableHeaderActionEdit")}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenModal(job.post.id.toString());
                                        }}
                                        className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                                    >
                                      {t("profileJob.tableHeaderActionCloseJob")}
                                    </button>
                                  </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                              <td
                                  colSpan={6}
                                  className="px-6 py-12 text-center text-gray-500 text-lg"
                              >
                                No job posts found
                              </td>
                            </tr>
                        )
                    ) : (
                        <tr>
                          <td
                              colSpan={6}
                              className="px-6 py-12 text-center text-gray-500 text-lg"
                          >
                            No job posts found
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
              )}
            </div>

            {pagination && (
                <div className="mt-8">
                  <Pagination
                      prevPage={pagination.prevPage}
                      nextPage={pagination.nextPage}
                      onPageChange={handlePageChange}
                  />
                </div>
            )}
          </div>

          <div className="mt-12 h-40 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl overflow-hidden flex justify-center items-center shadow-md">
            <Image
                src={ProfileImage.jobBoard}
                alt="Job Board"
                className="w-auto h-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
        <ConfirmCloseJob
            isDeleteLoading={false}
            isOpen={!!selectedJob}
            onClose={handleCloseModal}
            handleConfirmChange={handleConfirmDelete}
        />
      </div>
  );
};

export default MyJobs;