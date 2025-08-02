"use client";

import Link from "next/link";
import CategoryList from "@/components/CategoryDetail/components/CategoryList";
import {useState} from "react";
import {useHttpGet} from "@/hooks/useHttpGet";
import {CommunityNodeView} from "@/lib/lemmy-js-client/src";

const Advise: React.FC = () => {
  const [activeCatalogIndex, setActiveCatalogIndex] = useState<number>(0);

  const {
    data: catalogData,
    isMutating: isLoading,
  } = useHttpGet("listCommunities");

  const serviceCatalogs = catalogData?.communities || [];
  const activeCatalog = serviceCatalogs[activeCatalogIndex];

  if (isLoading ) return null;

  const adviseService = serviceCatalogs.find(
    (catalog) => activeCatalog.community.name.toLowerCase() === "advise"
  );

  if (!adviseService) return null;

  return (
    <div
      className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <Link prefetch={false} href={`/categories/${activeCatalog.community.title}`}
            className="px-2 text-[#485261] whitespace-nowrap sm:whitespace-normal">{activeCatalog.community.name}</Link>
      <div
        className="grid grid-cols-[1fr_1fr_1fr] max-h-sub-menu overflow-auto gap-y-4 absolute right-0 w-[670px] opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-sub-menu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-50 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        {serviceCatalogs.map((section) => (
          <CategoryList
            key={section.community.title}
            title={section.community.name}
            items={
              section.children?.map((cat: CommunityNodeView) => ({
                title: cat.community.name,
                slug: cat.community.slug,
              })) ?? []
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Advise;