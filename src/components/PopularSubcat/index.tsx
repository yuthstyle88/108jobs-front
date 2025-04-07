"use client";
import { API_ROUTES } from "@/api/endpoints";
import { CategoriesImage } from "@/constants/images";
import { usePublicFetch } from "@/hooks/api-hooks";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import Loading from "../Loading";
import { ServiceCatalogData } from "@/types/catalog";

type PopularSubCatItem = {
  id: number;
  name: string;
  imageUrl: string | StaticImageData;
  description: string;
};

const categories: PopularSubCatItem[] = [
  {
    id: 1,
    name: "ทำ SEO",
    imageUrl: CategoriesImage.web_development,
    description: "ทำ SEO เว็บเพจ บล็อก",
  },
  {
    id: 2,
    name: "Logo",
    imageUrl: CategoriesImage.web_development,
    description: "วาดและออกแบบโลโก้",
  },
  {
    id: 3,
    name: "Web Development",
    imageUrl: CategoriesImage.web_development,
    description: "พัฒนาและออกแบบเว็บไซต์",
  },
  {
    id: 4,
    name: "เขียนแบบวิศวกรรมและออกแบบโครงสร้าง",
    imageUrl: CategoriesImage.web_development,
    description: "ออกแบบและเขียนแบบโครงสร้าง",
  },
  {
    id: 5,
    name: "ช่างทำเล็บ",
    imageUrl: CategoriesImage.web_development,
    description: "บริการทำเล็บมือและเท้า",
  },
  {
    id: 6,
    name: "ดูดวง โหราศาสตร์ ความเชื่อ",
    imageUrl: CategoriesImage.web_development,
    description: "ดูดวงตามความเชื่อ การขาม การเงิน",
  },
];

const subcategories = [
  "ออกแบบกราฟิก",
  "สถาปัตย์และวิศวกรรม",
  "เว็บไซต์และเทคโนโลยี",
  "การตลาดและโฆษณา",
  "เขียนและแปลภาษา",
  "ภาพและเสียง",
  "ธุรกิจและที่ปรึกษา",
  "ไลฟ์สไตล์",
];

const subSEO = [
  "ทำ SEO",
  "Logo",
  "Web Development",
  "เขียนแบบวิศวกรรมและออกแบบโครงสร้าง",
  "ช่างทำเล็บ",
  "ดูดวง โหราศาสตร์ ความเชื่อ",
  "แม่บ้าน ทำความสะอาด",
  "ล้างแอร์",
];

const PopularSubCat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: catalogData,
    isLoading,
    error,
  } = usePublicFetch<ServiceCatalogData>(API_ROUTES.catalog.get_all_catalog);

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;

  console.log("catalogData",catalogData);
  

  return (
    <section className="col-start-2 col-end-3 grid grid-cols-[280px_1fr] pt-8 pb-9 gap-6 text-[0.875rem]">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 focus:outline-none"
        >
          <span className="text-lg">ประเภทงานยอดนิยม</span>
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
          <div className="absolute left-0 mt-2 w-[250px] bg-white rounded-lg shadow-lg z-50 flex">
            <div className="w-64 py-4">
              {subcategories.map((subcategory, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  {subcategory}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="pl-6 mt-4 grid gap-4 justify-start">
          {subSEO.map((sub, index) => (
            <Link key={index} href="" className="text-text_secondary ">
              {sub}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1 ">
        <h2 className="text-[32px] font-semibold text-text_primary pb-4">
          ประเภทงานยอดนิยม
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href="#"
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60" />
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-200"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSubCat;
