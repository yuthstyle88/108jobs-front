import {CategoriesIcon} from "@/constants/icons";
import {CommunityNodeView} from "@/lib/lemmy-js-client/src";
import {catalogIcons} from "@/types/catalogIcon";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {useTranslation} from "react-i18next";
import {slugToCamelCase} from "@/utils/helpers";

type Props = {
    serviceCatalogs: CommunityNodeView[];
    activeCatalog: CommunityNodeView;
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
    const {t} = useTranslation();

    return (
        <section className="hidden sm:block">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="min-h-[144px] mt-[-4rem] px-6 py-8 rounded-2xl bg-white shadow-xl border border-gray-100">
                    <div className="flex items-center justify-start flex-wrap gap-4 overflow-x-auto">
                        {serviceCatalogs.map((catalog, index) => {
                            const matchedIcon = catalogIcons.find(
                                (c) => c.name === catalog.community.name
                            )?.icon;

                            return (
                                <div
                                    key={catalog.community.id}
                                    className={`group relative flex justify-center w-32 h-32 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                        activeCatalogIndex === index
                                            ? "bg-blue-50"
                                            : "hover:bg-gray-50"
                                    } after:absolute after:bottom-2 after:block after:w-4/5 after:h-1 after:rounded-full after:bg-blue-600 after:origin-center after:transition-all after:duration-150 ${
                                        activeCatalogIndex === index
                                            ? "after:scale-100"
                                            : "after:scale-0"
                                    }`}
                                    onClick={() => setActiveCatalogIndex(index)}
                                >
                                    <div className="flex flex-col items-center gap-y-3 text-center">
                                        <div
                                            className={`relative transform before:absolute before:bottom-[-8px] before:left-0 before:right-0 before:mx-auto before:w-10 before:h-2 before:bg-blue-200 before:rounded-full before:transition-all before:duration-150 before:[backface-visibility:hidden] ${
                                                activeCatalogIndex === index
                                                    ? "before:opacity-100 before:translate-y-1"
                                                    : "before:opacity-0 group-hover:before:opacity-100 group-hover:before:translate-y-1"
                                            }`}
                                        >
                                            <Image
                                                src={matchedIcon || CategoriesIcon.industry}
                                                alt={catalog.community.name}
                                                width={56}
                                                height={56}
                                                className={`transition-all duration-150 group-hover:translate-y-[-4px] group-hover:grayscale-0 ${
                                                    activeCatalogIndex === index
                                                        ? "grayscale-0 translate-y-[-4px]"
                                                        : "grayscale"
                                                }`}
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-gray-800 leading-tight">
                                            {t(`catalogs.${slugToCamelCase(catalog.community.slug)}`)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8">
                        <div className="grid min-h-0 min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {activeCatalog?.children?.slice(0, 8).map(({community}) => {
                                const backgroundImage = community.icon
                                    ? `url(${community.icon})`
                                    : `url("/categories-image/web-development-02032022.jpg")`;

                                return (
                                    <Link
                                        prefetch={false}
                                        key={community.id}
                                        href={`/job/${community.slug}`}
                                        className="group"
                                    >
                                        <div
                                            style={{backgroundImage}}
                                            className="relative rounded-xl overflow-hidden bg-cover bg-center h-24 transition-all duration-150 ease-in-out cursor-pointer hover:shadow-lg"
                                        >
                                            <div
                                                className="relative flex items-end h-full px-4 py-3 text-white bg-[rgba(0,0,0,0.6)] font-semibold transition-all duration-150">
                        <span className="group-hover:-translate-y-1">
                          {t(`catalogs.${slugToCamelCase(community.slug)}`)}
                        </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                            {(!activeCatalog?.children || activeCatalog.children.length === 0) && (
                                <div className="col-span-full text-center text-gray-500 py-4">
                                    No subcatalogs available
                                </div>
                            )}
                        </div>
                        <div className="my-6 flex justify-end">
                            <Link
                                prefetch={false}
                                href="/categories/popular-service"
                                className="text-blue-600 py-3 relative no-underline cursor-pointer outline-none transition-all duration-150 hover:text-blue-800 font-medium"
                            >
                                {t("home.labelSeeMoreTittle")}
                                <FontAwesomeIcon icon={faArrowRight} className="pl-2"/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CatalogBanner;