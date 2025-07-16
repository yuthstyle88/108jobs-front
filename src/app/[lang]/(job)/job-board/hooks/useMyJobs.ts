import { API_ROUTES } from "@/api/endpoints";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { JobPostsResponse } from "@/types/job-board";
import { useMemo } from "react";

interface UseJobPostsProps {
  page?: number;
}

export const useMyJobs = ({ page = 1 }: UseJobPostsProps = {}) => {
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("pageSize", "13");

    return `?${params.toString()}`;
  }, [page]);

  const { data, isLoading, error, mutate } =
    usePrivateFetchParams<JobPostsResponse>(
      `${API_ROUTES.job.getMyJobBoard}${queryParams}`
    );

  return {
    jobPosts: data?.items || [],
    pagination: data
      ? {
          page: data.page,
          pageSize: data.pageSize,
          totalItems: data.totalItems,
          totalPages: data.totalPages,
        }
      : null,
    isLoading,
    error,
    mutate,
  };
};
