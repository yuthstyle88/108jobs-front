"use client";
import {API_ROUTES} from "@/api/endpoints";
import CategoryList from "@/components/CategoryDetail/components/CategoryList";
import {usePublicFetch} from "@/hooks/api-hooks";
import {ServiceCatalogData} from "@/types/catalog";
import Link from "next/link";

const PopularType = () => {
  const {
    data: catalogData,
    isLoading,
    error,
  } = usePublicFetch<ServiceCatalogData>(API_ROUTES.catalog.getAllCatalog);

  if (isLoading || error) return null;

  const popularService = catalogData?.serviceCatalogs.find(
    (catalog) => catalog.name.toLowerCase() === "popular service"
  );

  if (!popularService) return null;

  return (
    <div
      className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <Link prefetch={false}
            href={`/categories/${popularService.slug}`}
            className="px-2 text-[#485261] whitespace-nowrap sm:whitespace-normal"
      >
        {popularService.name}
      </Link>
      <div
        className="absolute left-0 w-[250px] right-0 opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-sub-menu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-50 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third  group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        <div className="min-w-[rem] max-w-[12rem] ">
          {popularService.sections.map((section) => (
            <CategoryList
              key={section.sectionTitle}
              title={section.sectionTitle}
              items={section.categories.map((cat) => ({
                title: cat.name,
                slug: cat.slug,
              }))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularType;
