"use client";
import { API_ROUTES } from "@/api/endpoints";
import Error from "@/app/error";
import JobCard from "@/components/JobCard";
import JobCardSkeleton from "@/components/ui/JobCardSkeleton";
import Loading from "@/components/Loading";
import { LanguageFile } from "@/constants/language";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { FavoriteJob } from "@/types/favorite";

const Favorites = () => {
  const {
    data: global,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.GLOBAL);

  const {
    data: favoriteData,
    isLoading: isLoadingFavorite,
    error: isErrorFavorite,
  } = usePrivateFetch<FavoriteJob>(API_ROUTES.job.get_favorite_job);

  if (isLoading) return <Loading />;
  if (error || isErrorFavorite) return <Error/>;

  return (
    <div className="w-full min-h-screen">
      <div className="grid-container-desktop-banner w-full mt-6 sm:my-12 min-h-[400px]">
        <div className="col-start-2 col-end-3">
          <h1 className="text-[18px] sm:text-[1.75rem] text-text_primary font-medium">
            {global?.menu_favorite_jobs}
          </h1>
          <div className="w-full py-8 px-4 rounded-sm bg-[#F6F7F8] mt-4 sm:mt-8">
            <section className="grid grid-cols-1 md:grid-cols-[repeat(4,minmax(1px,1fr))] gap-5">
              {isLoadingFavorite ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <JobCardSkeleton key={index} />
                ))
              ) : favoriteData && favoriteData.jobs.length === 0 ? (
                <p className="text-[1.5rem] leading-[1.5] font-medium text-text_secondary">
                  ไม่มีฟรีแลนซ์ที่ถูกใจ
                </p>
              ) : (
                favoriteData && favoriteData.jobs.map((job, index) => (
                  <JobCard data={job} key={index} />
                ))
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
