import { CategoriesIcon } from "@/constants/icons";
import { ServiceCatalog } from "@/types/catalog";
import { catalogIcons } from "@/types/catalogIcon";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  serviceCatalogs: ServiceCatalog[];
  activeCatalog: ServiceCatalog;
  activeCatalogIndex: number;
  setActiveCatalogIndex: (index: number) => void;
};

const CatalogBanner = (props: Props) => {
  const {
    serviceCatalogs,
    activeCatalog,
    activeCatalogIndex,
    setActiveCatalogIndex,
  } = props;
  const { t } = useTranslation();
  return (
    <section className="hidden sm:block">
      <div className="grid-container-desktop-banner w-full ">
        <div className="min-h-[144px] mt-[-4rem] px-8 rounded-lg bg-white shadow-panel col-start-2 col-end-3">
          <div className="flex items-center justify-start flex-wrap overflow-x-auto">
            {serviceCatalogs.map((catalog, index) => {
              const matchedIcon = catalogIcons.find(
                (c) => c.name === catalog.name
              )?.icon;

              return (
                <div
                  key={catalog.id}
                  className={`group relative flex justify-center w-[9rem] h-[9rem] pt-4 px-2 rounded-lg cursor-pointer after:absolute after:bottom-2 after:block after:w-[80%] after:h-1 after:rounded-full after:bg-primary after:origin-center after:transition-all after:ease-[var(--timing-faster)] ${
                    activeCatalogIndex === index
                      ? "after:scale-100"
                      : "after:scale-0"
                  }`}
                  onClick={() => setActiveCatalogIndex(index)}
                >
                  <div className="flex flex-col items-center gap-y-[0.75rem] text-center">
                    <div
                      className={`${
                        activeCatalogIndex === index
                          ? "before:opacity-100 before:translate-y-[5px]"
                          : ""
                      } relative transform before:absolute before:opacity-0 before:bottom-[calc(56px*0.2*-1+8px)] before:left-0 before:right-0 before:mx-auto before:w-[calc(56px*0.8)] before:h-[calc(56px*0.2)] before:bg-secondary before:rounded-[50%] before:transition-all before:ease-in-out before:[backface-visibility:hidden] group-hover:before:opacity-100 group-hover:before:translate-y-[5px]`}
                    >
                      <Image
                        src={matchedIcon || CategoriesIcon.industry}
                        alt={catalog.name}
                        width={56}
                        height={56}
                        className={`group-hover:translate-y-[-4px] duration-150 group-hover:grayscale-0 ${
                          activeCatalogIndex === index
                            ? "grayscale-0 translate-y-[-4px]"
                            : "grayscale-[1]"
                        }`}
                      />
                    </div>
                    <p className="text-base font-medium text-text-primary leading-[18.4px]">
                      {catalog.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 ">
            <div className="grid min-h-0 min-w-0 grid-cols-[1fr_1fr_1fr_1fr] gap-[0.75rem] ">
              {activeCatalog?.sections
                ?.flatMap((section) => section.categories)
                .slice(0, 8)
                .map((category) => {
                  const backgroundImage = category.image
                    ? `url(${category.image})`
                    : `url("/categories-image/web-development-02032022.jpg")`;

                  return (
                    <Link
                      prefetch={false}
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
                        <div className="relative flex items-end h-20 px-4 py-3 text-white bg-[rgba(0,0,0,.5)] font-semibold">
                          <span className="group-hover:translate-y-[-4px] duration-150">
                            {category.name}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
            <div className="my-4 flex justify-end">
              <Link
                prefetch={false}
                href="/categories/popular-service"
                className="text-primary py-[0.75rem] relative no-underline cursor-pointer outline-none ease-in-out duration-150 transition-all"
              >
                {t("home.labelSeeMoreTittle")}
                <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogBanner;
