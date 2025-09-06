"use client";

import Link from "next/link";
import CategoryList from "@/components/CategoryDetail/components/CategoryList";
import {useHttpGet} from "@/hooks/useHttpGet";
import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";

const ImageAndSound: React.FC = () => {
    const {
        data: catalogData,
        isMutating: isLoading,
    } = useHttpGet("listCommunities");

    if (isLoading) return <Loading/>;

  const imageAndSoundService = catalogData?.communities.find(
    (catalog) => catalog.community.name.toLowerCase() === "photos and videos"
  );

  if (!imageAndSoundService) return <ErrorState/>;

  return (
    <div
      className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
      <Link prefetch={false} href={`/categories/${imageAndSoundService.community.id}`}
            className="px-2 text-[#485261] whitespace-nowrap sm:whitespace-normal">{imageAndSoundService.community.name}</Link>
      <div
        className="grid grid-cols-[1fr_1fr_1fr] gap-y-4 absolute right-0 w-[650px] opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-sub-menu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-50 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
        {imageAndSoundService.children?.map((section) => (
          <CategoryList
            key={section.community.id}
            title={section.community.name}
            items={section.children}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageAndSound;
