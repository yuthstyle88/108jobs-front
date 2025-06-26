import { usePublicFetch } from "@/hooks/api-hooks";
import { useMemo } from "react";

export interface JobPost {
  id: string;
  job_title: string;
  category: string;
  working_from: string;
  intended_use: string;
  budget: string;
  created_at: string;
  deadline: string;
}

export interface JobPostsResponse {
  items: JobPost[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

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
    params.append('page_size', '5'); // Page size có thể thay đổi theo nhu cầu

    return `?${params.toString()}`;
  }, [categoryId, jobType, page]);

  const { data, isLoading, error, mutate } = usePublicFetch<JobPostsResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/job-board/posts${queryParams}`
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
