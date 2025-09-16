"use client";

import {Pagination} from "@/components/Pagination";
import {Badge} from "@/components/ui/Badge";
import {ProfileImage} from "@/constants/images";
import {formatDateTime} from "@/utils";
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import {useState, useMemo} from "react";
import ConfirmDeleteOffer from "../_components/ConfirmDeleteOffer";
import JobBoardTab from "../_components/JobBoardTab";
import {useHttpGet} from "@/hooks/useHttpGet";
import type { CommentView } from "lemmy-js-client";

const Proposal = () => {
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);

  const route = useRouter();
  const searchParams = useSearchParams();
  const postIdParam = searchParams.get("postId");
  const postId = useMemo(() => (postIdParam ? Number(postIdParam) : undefined), [postIdParam]);

  const {
    data: proposals,
    pagination,
    isMutating: isLoading,
  } = useHttpGet("getComments", {
    pageCursor: currentCursor,
    ...(postId ? { postId } : {}),
  });

  const [selectedJob, setSelectedJob] = useState<{
    id: string;
  } | null>(null);

  const handleOpenModal = (jobId: string) => {
    setSelectedJob({id: jobId});
  };
  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleConfirmDelete = async() => {
    if (selectedJob) {
      setSelectedJob(null);
    }
  };

  const handlePageChange = (pageCursor: string | null) => {
    setCurrentCursor(pageCursor || undefined); // อัปเดต currentCursor
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
        <div className="border-1 border-border-primary bg-white p-4 rounded-lg">
          <div className="border-b mb-6">
            <JobBoardTab/>
          </div>
          <div className="overflow-x-auto border-1 border-border-primary rounded-lg">
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
                {proposals?.comments ? (
                  proposals.comments.length > 0 ? (
                    proposals.comments.map((cv: CommentView) => (
                      <tr
                        key={cv.comment.id}
                        onClick={() => route.push(`/job-board/${cv.comment.id}`)}
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
                            <div>{cv.comment.content}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                          {getStatusBadge("closed")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-text-primary visible">
                          {formatDateTime(cv.comment.publishedAt, "datetime")}
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
                  )
                ) : null}
              </tbody>
            </table>
          </div>

          {pagination && (
            <Pagination
              prevPage={pagination.prevPage}
              nextPage={pagination.nextPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        <div className="mt-12 h-[148px] bg-[#D0E1FB] rounded-lg overflow-hidden flex justify-center items-center">
          <Image
            src={ProfileImage.jobBoard}
            alt="Job Board"
            className="w-auto h-full object-contain"
          />
        </div>
      </div>
      <ConfirmDeleteOffer
        isDeleteLoading={false}
        isOpen={!!selectedJob}
        onClose={handleCloseModal}
        handleConfirmChange={handleConfirmDelete}
      />
    </div>
  );
};

export default Proposal;