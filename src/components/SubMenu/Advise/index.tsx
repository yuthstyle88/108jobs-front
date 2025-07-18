"use client";

import Link from "next/link";
import { usePublicFetch } from "@/hooks/api-hooks";
import { API_ROUTES } from "@/api/endpoints";
import { ServiceCatalogData } from "@/types/catalog";
import CategoryList from "@/components/CategoryDetail/components/CategoryList";

const Advise: React.FC = () => {
  const {
    data: catalogData,
    isLoading,
    error,
  } = usePublicFetch<ServiceCatalogData>(API_ROUTES.catalog.getAllCatalog);

  if (isLoading || error) return null;

  const adviseService = catalogData?.serviceCatalogs.find(
    (catalog) => catalog.name.toLowerCase() === "advise"
  );

  if (!adviseService) return null;

  return (
    <div className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <Link prefetch={false}  href={`/categories/${adviseService.slug}`} className="px-2 text-[#485261] whitespace-nowrap sm:whitespace-normal">{adviseService.name}</Link>
      <div className="grid grid-cols-[1fr_1fr_1fr] max-h-sub-menu overflow-auto gap-y-4 absolute right-0 w-[670px] opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-sub-menu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-50 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        {adviseService.sections.map((section) => (
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
  );
};

export default Advise;
