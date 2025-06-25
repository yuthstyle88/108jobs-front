"use client";

import { API_ROUTES } from "@/api/endpoints";
import Error from "@/app/error";
import { usePublicFetch } from "@/hooks/api-hooks";
import { JobPostDetail } from "@/types/jobBoard";
import { formatDateToLong } from "@/utils/formatDateToLong";
import Loading from "../Loading";
import { Badge } from "../ui/Badge";

type Props = {
  jobId: string;
};

const JobBoardDetail = ({ jobId }: Props) => {
  const {
    data: jobDetailData,
    isLoading,
    error,
  } = usePublicFetch<JobPostDetail>(
    API_ROUTES.job.job_board_detail + "/" + jobId
  );
  console.log("jobDetailData", jobDetailData);

  const calculateDaysUntil = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-lg">
      <div className="flex space-x-8 mb-6 border-b">
        <button className="pb-3 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
          Job Board
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                Open
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-1">
                {jobDetailData?.category_name}
              </Badge>
              {jobDetailData?.job_post.is_english_required && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  English Required
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-bold text-blue-600 mb-4">
              {jobDetailData?.job_post.job_title}
            </h1>
            <div className="flex items-center text-gray-600 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={jobDetailData?.creator.avatar_url}
                alt={jobDetailData?.creator.display_name}
                className="w-6 h-6 rounded-full mr-2"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIgZmlsbD0iIzZCNzI4MCIvPgo8cGF0aCBkPSJtNCA0IDUgNWgtMTBhMTEuOTYzIDExLjk2MyAwIDAgMCA0LjUxNCA5LjY1OGM0LjczMiA5Ljc1NCA5LjUyNiA5LjI1OCAxMi0yLjMzNGMzLjMzNCA0LjM0NiA2IDYuNjY2IDEwIDEwaCIvPgo8L3N2Zz4K";
                }}
              />
              <span className="font-medium">
                {jobDetailData?.creator.display_name}
              </span>
              {!jobDetailData?.job_post.is_anonymous_post && (
                <span className="text-sm ml-2">
                  (@{jobDetailData?.creator.username})
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              <span>
                Posted: {formatDateToLong(jobDetailData?.job_post?.created_at)}
              </span>
              {jobDetailData?.job_post.updated_at !==
                jobDetailData?.job_post.created_at && (
                <span className="ml-4">
                  Updated:{" "}
                  {formatDateToLong(jobDetailData?.job_post.updated_at)}
                </span>
              )}
            </div>
          </div>

          <div className="bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Job Details
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>{jobDetailData?.job_post.description}</p>
              {jobDetailData?.job_post.example_url && (
                <div className="mt-4">
                  <span className="font-medium">Reference URL: </span>
                  <a
                    href={jobDetailData?.job_post.example_url}
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {jobDetailData?.job_post.example_url}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-gray-900 mb-3">
                Additional Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Intended Use:</span>
                  <span className="ml-2 font-medium text-text_primary">
                    {jobDetailData?.job_post.intended_use}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 flex flex-col justify-center p-6 rounded-lg text-text_primary">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Project Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Deadline</span>
              <span className="font-medium">
                {formatDateToLong(jobDetailData?.job_post.deadline)}
                <span className="text-green-600 ml-1">
                  (
                  {calculateDaysUntil(jobDetailData?.job_post?.deadline || "2")}
                  days left)
                </span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Budget</span>
              <span className="font-medium">
                ${jobDetailData?.job_post.budget}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Work Type</span>
              <span className="font-medium">
                {jobDetailData?.job_post.working_from}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category</span>
              <span className="font-medium">
                {jobDetailData?.category_name}
              </span>
            </div>
            {jobDetailData?.job_post.is_english_required && (
              <div className="flex justify-between">
                <span className="text-gray-600">Special Requirements</span>
                <span className="font-medium text-blue-600">English</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBoardDetail;
