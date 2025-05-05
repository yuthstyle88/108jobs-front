import { usePublicFetch } from "@/hooks/api-hooks";

export interface Category {
  id: string;
  name: string;
}

interface CategoriesResponse {
  categories: [string, string][];
}

export const useCategories = () => {
  const {
    data,
    isLoading,
    error
  } = usePublicFetch<CategoriesResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/job-board/categories`);

  // Transform the API response into a more usable format
  const categories = data?.categories 
    ? data.categories.map((category: [string, string]) => ({
        id: category[0],
        name: category[1],
      }))
    : [];

  return { categories, isLoading, error };
}; 