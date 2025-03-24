"use client";
import { AssetsImage, CategoriesImage } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import Benefit from "./components/Benefit";
import FreelancerTypes from "./components/FreelancerTypes";
import Step from "./components/Step";
import ProfileSelling from "./Profile";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
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

const StartSelling = () => {

    const {
      data: applyFreelancerData,
      isLoading,
      error,
    } = useGlobalTranslate(LanguageFile.APPLY_FREELANCER);


    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data.</p>;

  return (
    <main>
      <div className="relative h-[300px] w-full overflow-hidden ">
        <div className="absolute inset-0">
          <Image
            src={AssetsImage.start_selling}
            alt="Freelance Work"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {applyFreelancerData?.freelancer_standard}
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            {applyFreelancerData?.subtitle}
          </p>
          <Link href="/apply-freelance">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              {applyFreelancerData?.apply_button}
            </button>
          </Link>
        </div>
      </div>
      <Benefit data={applyFreelancerData}/>
      <Step data={applyFreelancerData}/>
      <FreelancerTypes data={applyFreelancerData}/>
      <ProfileSelling data={applyFreelancerData}/>
      <div className="grid-container-desktop w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="col-start-2 col-end-3">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            {applyFreelancerData?.popular_categories_title}
          </h2>
          <div className="grid min-h-0 min-w-0 grid-cols-[1fr_1fr_1fr_1fr] gap-[0.75rem] ">
            {category_images.map((category, index) => (
              <Link key={index} href="/seo" className="group">
                <div
                  style={{
                    backgroundImage: `url("/categories-image/web-development-02032022.jpg")`,
                  }}
                  className="relative rounded-md overflow-hidden bg-cover bg-center transition-all ease-[120ms] cursor-pointer"
                >
                  <div className="relative flex items-end h-20 px-4 py-3 text-white bg-[rgba(0,0,0,.5)] font-semibold">
                    <span className="group-hover:translate-y-[-4px] duration-150">
                      ทำ SEO
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default StartSelling;
