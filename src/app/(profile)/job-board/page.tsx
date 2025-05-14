"use client";
import Loading from "@/components/Loading";
import { ProfileImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useCategories } from "./hooks/useCategories";
import { useJobPosts } from "./hooks/useJobPosts";

const JobBoard = () => {
  const [activeTab, setActiveTab] = useState<"myPosts" | "closedPosts">("myPosts");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const { categories } = useCategories();
  const { 
    jobPosts, 
    pagination, 
    isLoading: isJobsLoading 
  } = useJobPosts({
    categoryId: selectedCategory
  });

  const {
    data: jobBoardLanguageData,
    isLoading: isLanguageLoading,
    error: languageError,
  } = useGlobalTranslate(LanguageFile.JOB_BOARD);

  if (isLanguageLoading) return <Loading />;
  if (languageError) return <div>Error loading language data</div>;

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "-") return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
            <div className="flex -mb-px">
              <button
                className={`mr-6 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "myPosts"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("myPosts")}
              >
                {jobBoardLanguageData?.tab_all_jobs}
              </button>
              <button
                className={`py-2 text-sm font-medium border-b-2 ${
                  activeTab === "closedPosts"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("closedPosts")}
              >
                {jobBoardLanguageData?.tab_saved_jobs}
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="w-full sm:w-48">
                <div className="relative">
                  <select 
                    className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">{jobBoardLanguageData?.dropdown_search_category}</option>
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
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-48">
                <div className="relative">
                  {/* <select 
                    className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                  >
                    <option value="">{jobBoardLanguageData?.dropdown_search_type}</option>
                    {jobTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select> */}
                  {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
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
                      ></path>
                    </svg>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <Link href="/start-selling" className="text-blue-600 text-sm hover:underline">
                อยากรับงานบนบอร์ดประกาศงาน ?
              </Link>
              <Link 
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
                <Loading />
              </div>
            ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {jobBoardLanguageData?.table_header_title}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {jobBoardLanguageData?.table_header_category}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {jobBoardLanguageData?.table_header_job_type}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {jobBoardLanguageData?.table_header_budget}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] visible"
                  >
                    {jobBoardLanguageData?.table_header_post_date || "Posted Date"}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] visible"
                  >
                    {jobBoardLanguageData?.table_header_deadline || "Deadline"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobPosts.length > 0 ? (
                  jobPosts.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <div className="mr-2 mt-1">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
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
                              href="#"
                              className=" hover:text-blue-600 font-medium text-[14px] text-text_primary font-sans"
                            >
                              {job.job_title}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.working_from}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {parseFloat(job.budget).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 visible">
                        {formatDate(job.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 visible">
                        {formatDate(job.deadline) || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No job posts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>

          {pagination && pagination.totalPages > 0 && (
            <div className="flex items-center justify-center mt-8">
              <nav className="flex items-center">
                <Link
                  href="#"
                  className="px-2 py-2 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">First</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M7.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L3.414 10l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="mx-1 px-2 py-2 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <span className="mx-3 text-gray-700">
                  <span className="font-medium text-blue-600">{pagination.page}</span> จาก{" "}
                  <span>{pagination.totalPages}</span>
                </span>
                <Link
                  href="#"
                  className="mx-1 px-2 py-2 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="px-2 py-2 rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Last</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 6.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M12.293 15.707a1 1 0 010-1.414L16.586 10l-4.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </nav>
            </div>
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
