import {ServiceCatalog} from "@/types/catalog";
import Link from "next/link";

type Props = {
  activeCatalog: ServiceCatalog;
};
const SpCatalog = ({activeCatalog}: Props) => {
  return (
    <div className="mb-3">
      <h6 className="text-[1.125rem] text-primary font-semibold leading-[1.15]">
        Popular Catalog
      </h6>
      <div className="mb-3 pt-3">
        <div className="grid grid-cols-2 gap-2 ">
          {activeCatalog?.sections
          ?.flatMap((section) => section.categories)
          .slice(0,
            8)
          .map((category) => {
            const backgroundImage = category.image
              ? `url(${category.image})`
              : `url("/categories-image/web-development-02032022.jpg")`;

            return (
              <Link prefetch={false}
                    key={category.id}
                    href={`/job/${category.slug}`}
                    className="group"
              >
                <div
                  style={{
                    backgroundImage,
                  }}
                  className="relative rounded-md overflow-hidden bg-cover bg-center transition-all ease-[120ms] cursor-pointer"
                >
                  <div className="relative flex items-end h-24 px-4 py-3 text-white bg-[rgba(0,0,0,.5)] font-semibold">
                      <span className="group-hover:translate-y-[-4px] duration-150">
                        {category.name}
                      </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Link prefetch={false}
            href="/categories/popular-service"
            className="w-full flex justify-center items-center text-primary font-semibold text-[1.125rem] leading-[1.15]"
      >
        <span className="text-[16px] pt-3">View more categories</span>
      </Link>
    </div>
  );
};

export default SpCatalog;
