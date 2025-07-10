"use client";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import { Pagination } from "@/components/Pagination";
import { Badge } from "@/components/ui/Badge";
import { ProfileImage } from "@/constants/images";
import { formatDateTime } from "@/utils/formatDate";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmCloseJob from "../_components/ConfirmCloseJobs";
import JobBoardTab from "../_components/JobBoardTab";
import { useMyJobs } from "../hooks/useMyJobs";

const MyJobs = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const route = useRouter();

  const {
    jobPosts,
    pagination,
    isLoading: isJobsLoading,
  } = useMyJobs({
    page: currentPage,
  });

  const [selectedJob, setSelectedJob] = useState<{
    id: string;
  } | null>(null);

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

  const handlePageChange = (page: number) => {
    if (page < 1 || (pagination && page > pagination.totalPages)) return;
    setCurrentPage(page);
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
    <div className="bg-[#F6F9FE] min-h-screen">
      <div className="max-w-[1280px] mx-auto py-8 px-4 md:px-6 lg:px-8 rounded-lg shadow-sm">
        <div className="border-1 border-border_primary bg-white p-4 rounded-lg">
          <div className="border-b mb-6">
            <JobBoardTab />
          </div>
          <div className="overflow-x-auto border-1 border-border_primary rounded-lg">
            {isJobsLoading ? (
              <div className="py-12 text-center">
                <LoadingMultiCircle />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Budget (BATH)
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Posted on
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[120px] visible">
                      Delivery deadline
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobPosts.length > 0 ? (
                    jobPosts.map((job) => (
                      <tr
                        key={job.id}
                        onClick={() => route.push(`/job-board/${job.id}`)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-start">
                            <div className="mr-2 mt-1">
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
                              <Link prefetch={false}
                                href={`/job-board/${job.id}`}
                                className="hover:text-blue-600 font-medium text-base text-text_primary font-sans max-w-[300px] line-clamp-1 truncate"
                              >
                                {job.job_title}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 font-medium">
                          {parseFloat(job.budget).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                          {getStatusBadge("closed")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-text_primary visible">
                          {formatDateTime(job.created_at, "datetime")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-text_primary visible">
                          {formatDateTime(job.deadline, "date")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-text_primary visible">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              route.push(`/job-board/edit/${job.id}`)
                            }}
                            className="text-text_primary underline mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(job.id);
                            }}
                            className="text-red-400 underline"
                          >
                            Close Job
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No job posts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              totalPages={pagination.totalPages}
              currentPage={pagination.page}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        <div className="mt-12 h-[148px] bg-[#D0E1FB] rounded-lg overflow-hidden flex justify-center items-center">
          <Image
            src={ProfileImage.job_board}
            alt="Job Board"
            className="w-auto h-full object-contain"
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
