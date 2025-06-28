import { API_ROUTES } from "@/api/endpoints";
import { usePublicFetch } from "@/hooks/api-hooks";

export interface Category {
  id: string;
  name: string;
}

interface CategoriesResponse {
  service_catalogs: { id: string; name: string; slug: string }[]; // Thêm slug nếu cần filter
}

export const useCategories = () => {
  const {
    data,
    isLoading,
    error
  } = usePublicFetch<CategoriesResponse>(API_ROUTES.catalog.get_all_catalog);

  const categories = data?.service_catalogs
    ? data.service_catalogs
        .filter((catalog) => catalog.slug !== "popular-service") 
        .map((catalog) => ({
          id: catalog.id,
          name: catalog.name,
        }))
    : [];

  return { categories, isLoading, error };
};
