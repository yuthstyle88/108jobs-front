import { API_ROUTES } from "@/api/endpoints";
import { usePublicFetch } from "@/hooks/api-hooks";
import { JobPostsResponse } from "@/types/job-board";
import { useMemo } from "react";

interface UseJobPostsProps {
  categoryId?: string;
  jobType?: string;
  page?: number;
}

export const useJobPosts = ({ categoryId, jobType, page = 1 }: UseJobPostsProps = {}) => {
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    if (categoryId) {
      params.append('serviceCatalogId', categoryId);
    }

    if (jobType) {
      params.append('jobType', jobType);
    }

    params.append('page', page.toString());
    params.append('pageSize', '13');

    return `?${params.toString()}`;
  }, [categoryId, jobType, page]);

  const { data, isLoading, error, mutate } = usePublicFetch<JobPostsResponse>(
    `${API_ROUTES.job.getJobBoard}${queryParams}`
  );

  return {
    jobPosts: data?.items || [],
    pagination: data ? {
      page: data.page,
      pageSize: data.pageSize,
      totalItems: data.totalItems,
      totalPages: data.totalPages
    } : null,
    isLoading,
    error,
    mutate
  };
};
