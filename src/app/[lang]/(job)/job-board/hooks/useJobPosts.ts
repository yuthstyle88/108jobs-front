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
      params.append('service_catalog_id', categoryId);
    }

    if (jobType) {
      params.append('job_type', jobType);
    }

    params.append('page', page.toString());
    params.append('page_size', '13');

    return `?${params.toString()}`;
  }, [categoryId, jobType, page]);

  const { data, isLoading, error, mutate } = usePublicFetch<JobPostsResponse>(
    `${API_ROUTES.job.get_job_board}${queryParams}`
  );

  return {
    jobPosts: data?.items || [],
    pagination: data ? {
      page: data.page,
      pageSize: data.page_size,
      totalItems: data.total_items,
      totalPages: data.total_pages
    } : null,
    isLoading,
    error,
    mutate
  };
};
