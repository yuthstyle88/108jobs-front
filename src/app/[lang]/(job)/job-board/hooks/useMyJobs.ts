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
    params.append("page_size", "13");

    return `?${params.toString()}`;
  }, [page]);

  const { data, isLoading, error, mutate } =
    usePrivateFetchParams<JobPostsResponse>(
      `${API_ROUTES.job.get_my_job_board}${queryParams}`
    );

  return {
    jobPosts: data?.items || [],
    pagination: data
      ? {
          page: data.page,
          pageSize: data.page_size,
          totalItems: data.total_items,
          totalPages: data.total_pages,
        }
      : null,
    isLoading,
    error,
    mutate,
  };
};
