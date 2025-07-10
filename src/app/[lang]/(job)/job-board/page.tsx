"use client";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import { Pagination } from "@/components/Pagination";
import { ProfileImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import JobBoardTab from "./_components/JobBoardTab";
import { useCategories } from "./hooks/useCategories";
import { useJobPosts } from "./hooks/useJobPosts";

const JobBoard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const route = useRouter();

  const { categories } = useCategories();

  const {
    jobPosts,
    pagination,
    isLoading: isJobsLoading,
  } = useJobPosts({
    categoryId: selectedCategory,
    page: currentPage,
  });

  const {
    data: jobBoardLanguageData,
    isLoading: isLanguageLoading,
    error: languageError,
  } = useGlobalTranslate(LanguageFile.JOB_BOARD);

  if (isLanguageLoading) return <Loading />;
  if (languageError) return <Error />;

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "-") return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH-u-ca-gregory", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || (pagination && page > pagination.totalPages)) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-[#F6F9FE] min-h-screen">
      <div className="max-w-[1280px] mx-auto py-8 px-4 md:px-6 lg:px-8 rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-1">
            {jobBoardLanguageData?.section_job_board}
          </h2>
          <p className="text-gray-600">
            {jobBoardLanguageData?.subtitle_job_board}
          </p>
        </div>

        <div className="border-1 border-border_primary bg-white p-4 rounded-lg">
          <div className="border-b mb-6">
            <JobBoardTab />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="w-full sm:w-48">
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">
                      {jobBoardLanguageData?.dropdown_search_category}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <Link prefetch={false}
                href="/job-board/create-job"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {jobBoardLanguageData?.button_post_job || "Post a Job"} (0/3)
              </Link>
            </div>
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
                      {jobBoardLanguageData?.table_header_title}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {jobBoardLanguageData?.table_header_category}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {jobBoardLanguageData?.table_header_job_type}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {jobBoardLanguageData?.table_header_budget}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[120px] visible">
                      {jobBoardLanguageData?.table_header_post_date ||
                        "Posted Date"}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[120px] visible">
                      {jobBoardLanguageData?.table_header_deadline ||
                        "Deadline"}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[120px] visible">
                     
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
                                prefetch={false}
                                href={`/job-board/${job.id}`}
                                className="hover:text-blue-600 font-medium text-base text-text_primary font-sans max-w-[300px] line-clamp-1 truncate"
                              >
                                {job.job_title}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                          {job.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                          {job.working_from}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 font-medium">
                          {parseFloat(job.budget).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-text_primary visible">
                          {formatDate(job.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-text_primary visible">
                          {formatDate(job.deadline) || "-"}
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
    </div>
  );
};

export default JobBoard;
