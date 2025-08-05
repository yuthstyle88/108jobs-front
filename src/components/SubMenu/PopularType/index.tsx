"use client";
import CategoryList from "@/components/CategoryDetail/components/CategoryList";
import Link from "next/link";
import {useHttpGet} from "@/hooks/useHttpGet";
import Loading from "@/components/Loading";
import ErrorState from "@/components/ErrorState";

const PopularType = () => {
    const {
        data: catalogData,
        isMutating: isLoading,
    } = useHttpGet("listCommunities");


    const popularService = catalogData?.communities.find(
        (catalog) => catalog.community.name.toLowerCase() === "popular services"
    );

    if (isLoading) return <Loading/>;

    if (!popularService) return <ErrorState/>;


    return (
        <div
            className="relative flex items-center justify-center hover:bg-[#F6F9FE] group after:block after:w-0 after:h-[0.25rem] after:rounded-full after:bg-primary after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:transition-all after:duration-100 after:ease-in-out hover:after:w-[80%] hover:after:opacity-100">
            <Link prefetch={false}
                  href={`/categories/${popularService.community.id}`}
                  className="px-2 text-[#485261] whitespace-nowrap sm:whitespace-normal"
            >
                {popularService.community.name}
            </Link>
            <div
                className="absolute left-0 w-[250px] right-0 opacity-0 scale-y-0 origin-top top-[3.5rem] shadow-sub-menu px-[1rem] py-[1rem] text-[rgba(43,50,59,.95)] z-50 bg-white border-t-[1px] border-t-secondary border-b-2 border-b-third  group-hover:opacity-100 group-hover:scale-y-100 transition-all duration-300">
                <div className="min-w-[rem] max-w-[12rem] ">
                    <CategoryList
                        key={popularService.community.id}
                        title={popularService.community.name}
                        items={popularService.children}
                    />
                </div>
            </div>
        </div>
    );
};

export default PopularType;
