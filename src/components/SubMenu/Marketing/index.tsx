"use client";

import Link from "next/link";
import CategoryList from "@/components/CategoryDetail/components/CategoryList";
import {useHttpGet} from "@/hooks/useHttpGet";
import {useState} from "react";

;

const Marketing: React.FC = () => {

const [activeCatalogIndex, setActiveCatalogIndex] = useState<number>(0);

  const {
    data: catalogData,
    isMutating: isCatalogLoading,
  } = useHttpGet("listCommunities");

  const serviceCatalogs = catalogData?.communities || [];
  const activeCatalog = serviceCatalogs[activeCatalogIndex];
  if (!serviceCatalogs) return null;

  return (
    <div
      className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <Link prefetch={false} href={`/categories/${activeCatalog.community.apId}`}
            className="px-2 text-[#485261] whitespace-nowrap sm:whitespace-normal">{activeCatalog.community.name}</Link>
      <div
        className="grid grid-cols-[1fr_1fr_1fr] gap-y-4 absolute left-0 w-[630px] right-0 opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-sub-menu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-50 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        {serviceCatalogs.map((section) => (
          <CategoryList
            key={section.community.name}
            title={section.community.title}
            items={section?.children} // ถ้า `section?.children` เป็น undefined ให้ใช้ array ว่างแทน}
          />
        ))}
      </div>
    </div>
  );
};

export default Marketing;