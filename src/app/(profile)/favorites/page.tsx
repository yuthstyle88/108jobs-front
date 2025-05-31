"use client";
import CategoryCardMock from "@/components/CategoryCardMock";
import Loading from "@/components/Loading";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";

const Favorites = () => {
  const {
    data: global,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.GLOBAL);

    if (isLoading) return <Loading />;
    if (error) return <div>Error loading language data</div>;

  return (
    <div className="w-full min-h-screen">
      <div className="grid-container-desktop-banner w-full mt-6 sm:my-12 min-h-[400px]">
        <div className="col-start-2 col-end-3">
          <h1 className="text-[18px] sm:text-[1.75rem] text-text_primary font-medium">
            {global?.menu_favorite_jobs}
          </h1>
          <div className="w-full text-center py-8 px-4 rounded-sm bg-[#F6F7F8] mt-4 sm:mt-8">
            {/* <p className="text-[1.5rem] leading-[1.5] font-medium text-text_secondary">ไม่มีฟรีแลนซ์ที่ถูกใจ</p> */}
            <section className="grid grid-cols-1 md:grid-cols-[repeat(3,minmax(1px,1fr))] gap-5">
              {Array.from({ length: 2 }, (_, index) => (
                <CategoryCardMock key={index} />
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
