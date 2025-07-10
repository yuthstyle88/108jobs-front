"use client";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import { AssetIcon } from "@/constants/icons";
import { CategoriesImage, LandingImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const category_images = [
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
  {
    image: CategoriesImage.seo_image,
    title: "ทำ SEO",
  },
];

export default function NotFound() {
  const {
    data: notFoundLanguageData,
    isLoading,
    error: isError,
  } = useGlobalTranslate(LanguageFile.NOT_FOUND);

  if (isLoading) return <Loading />;
  if (isError) return <Error/>;
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Header */}
      <header className="px-[1rem] flex h-[70px] items-center justify-start bg-primary">
        <div className=" px-4">
          <Link prefetch={false} href="/">
            <Image
              src={AssetIcon.logo}
              alt="logo"
              className="w-full h-full"
              width={500}
              height={500}
            />
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-grow">
        <section className="not-found-gradient py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="fade-in">
                <h1 className="text-[32px] md:text-4xl font-medium text-gray-800 mb-4">
                  {notFoundLanguageData?.error_title}
                </h1>
                <p className="text-[#728197] text-[20px] font-sans mb-8">
                  {notFoundLanguageData?.error_description}
                </p>
                <Link prefetch={false}
                  href="/"
                  className="inline-flex items-center gap-2 bg-third text-white px-6 py-3 rounded-md font-medium transition-all hover:bg-fastwork-dark-blue"
                >
                  <Home className="w-5 h-5" />
                  {notFoundLanguageData?.back_button}
                </Link>
              </div>
              <div className="fade-in stagger-1">
                <Image
                  src={LandingImage.construction}
                  alt="construction"
                  className="w-full h-full"
                  width={500}
                  height={500}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              {notFoundLanguageData?.recommended_section_title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category_images.map((category, index) => (
                <Link prefetch={false} key={index} href="/seo" className="group">
                  <div
                    style={{
                      backgroundImage: `url("/categories-image/web-development-02032022.jpg")`,
                    }}
                    className="relative rounded-md overflow-hidden bg-cover bg-center transition-all ease-[120ms] cursor-pointer"
                  >
                    <div className="relative flex items-end h-20 px-4 py-3 text-white bg-[rgba(0,0,0,.5)] font-semibold">
                      <span className="group-hover:translate-y-[-4px] duration-150">
                        {category.title}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Fastjob. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
