import {API_ROUTES} from "@/api/endpoints";
import {usePublicFetch} from "@/hooks/api-hooks";

export interface Category {
  id: string;
  name: string;
}

interface CategoriesResponse {
  serviceCatalogs: {id: string; name: string; slug: string}[]; // Thêm slug nếu cần filter
}

export const useCategories = () => {
  const {
    data,
    isLoading,
    error
  } = usePublicFetch<CategoriesResponse>(API_ROUTES.catalog.getAllCatalog);

  const categories = data?.serviceCatalogs
    ? data.serviceCatalogs
    .filter((catalog) => catalog.slug !== "popular-service")
    .map((catalog) => ({
      id: catalog.id,
      name: catalog.name,
    }))
    : [];

  return {categories, isLoading, error};
};
