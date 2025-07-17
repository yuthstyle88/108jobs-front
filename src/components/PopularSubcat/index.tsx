"use client";

import { API_ROUTES } from "@/api/endpoints";
import { CategoriesImage } from "@/constants/images";
import { usePublicFetch } from "@/hooks/api-hooks";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ServiceCatalog, ServiceCatalogData } from "@/types/catalog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import { notFound } from "next/navigation";
import Error from "@/app/error";

type Props = {
  slug: string;
};

const PopularSubCat = ({ slug }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCatalog | null>(null);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const {
    data: catalogData,
    isLoading,
    error,
  } = usePublicFetch<ServiceCatalogData>(API_ROUTES.catalog.getAllCatalog);

  useEffect(() => {
  if (!catalogData?.serviceCatalogs) return;

  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, "-");

  const matchedCatalog = catalogData.serviceCatalogs.find(
    (catalog) =>
      catalog.slug === slug ||
      (!catalog.slug &&
        catalog.name.toLowerCase().replace(/\s+/g, "-") === normalizedSlug)
  );

  if (matchedCatalog) {
    if (!matchedCatalog.slug) {
      notFound();
      return;
    }

    setSelectedCategory(matchedCatalog);
  } else {
    notFound();
  }
}, [catalogData, slug]);

  if (isLoading) return <Loading />;
  if (error) return <Error/>;

  return (
    <section className="col-start-2 col-end-3 grid grid-cols-2 sm:grid-cols-[280px_1fr] pt-12 sm:pt-8 pb-9 gap-6 text-[0.875rem]">
      <div className="relative pt-4" ref={dropdownRef}>
        <div className="sticky top-[110px] sm:top-[100px]">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 focus:outline-none"
          >
            <span className="text-lg">{selectedCategory?.name}</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 w-[250px] bg-white rounded-lg shadow-lg z-50 flex animate-fade-down">
              <div className="w-64 py-4">
                {catalogData?.serviceCatalogs.map((subcategory) => {
                  const fallbackSlug = subcategory.name
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  const catalogSlug = subcategory.slug ?? fallbackSlug;

                  return (
                    <Link prefetch={false}
                      key={subcategory.id}
                      href={`/categories/${catalogSlug}`}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      {subcategory.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {selectedCategory && (
            <div className="pl-6 mt-4 grid gap-2 justify-start">
              {selectedCategory.sections
                .flatMap((section) => section.categories)
                .map((cat) => (
                  <Link prefetch={false}
                    key={cat.id}
                    href={`/job/${cat.slug}`}
                    className="text-text_secondary hover:underline"
                  >
                    {cat.name}
                  </Link>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h2 className="text-[24px] md:text-[32px] font-semibold text-text_primary pb-4">
          {selectedCategory?.name}
        </h2>
        {selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCategory.sections
              .flatMap((section) => section.categories)
              .map((cat) => (
                <Link prefetch={false}
                  key={cat.id}
                  href={`/job/${cat.slug}`}
                  className="group relative overflow-hidden rounded-lg"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={cat.image || CategoriesImage.webDevelopment}
                      alt={cat.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-200 bg-black/20"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-semibold">{cat.name}</h3>
                      <p className="text-sm opacity-90">{cat.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularSubCat;
