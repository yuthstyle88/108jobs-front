import Link from "next/link";

const SpCatalog = () => {
  return (
    <div className="mb-3">
      <h6 className="text-[1.125rem] text-primary font-semibold leading-[1.15]">
        Popular Catalog
      </h6>
      <div className="mb-3 pt-3">
        <div className="grid grid-cols-2 gap-2 ">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
            <Link key={index} href={`/seo`} className="group">
              <div
                style={{
                  backgroundImage: `url("/categories-image/web-development-02032022.jpg")`,
                }}
                className="relative rounded-md overflow-hidden bg-cover bg-center transition-all ease-[120ms] cursor-pointer"
              >
                <div className="relative flex items-end h-24 px-4 py-3 text-white bg-[rgba(0,0,0,.5)] font-semibold">
                  <span className="group-hover:translate-y-[-4px] duration-150">
                    SEO
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Link
        href="/popular-subcat"
        className="w-full flex justify-center items-center text-primary font-semibold text-[1.125rem] leading-[1.15]"
      >
        <span className="text-[16px] pt-3">View more categories</span>
      </Link>
    </div>
  );
};

export default SpCatalog;
