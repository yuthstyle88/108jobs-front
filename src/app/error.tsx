"use client";

import Loading from "@/components/Loading";
import { LandingImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import Image from "next/image";
interface ErrorProps {
  message?: string;
}

export default function Error({ message }: ErrorProps) {
  const {
    data: errorLanguageData,
    isLoading,
    error: isError,
  } = useGlobalTranslate(LanguageFile.ERROR);

  if (isLoading) return <Loading />;
  // if (isError) return <div>Error loading language data</div>;

  return (
    <div className="min-h-screen w-full h-full flex items-center justify-center bg-secondary">
      <Image
        src={LandingImage.bgError}
        alt="error"
        fill
        className="object-cover md:block hidden"
      />
      <Image
        src={LandingImage.errorMobile}
        alt="error"
        fill
        className="object-cover"
      />
      <div className="flex flex-col items-center gap-16 mx-2">
        <Image
          src={LandingImage.error}
          alt="error"
          className="w-[80%] h-[280px] sm:w-full"
        />
        {isError ? 
        <p className="text-center text-[20px] md:text-[32px] text-text_primary font-sans">
          {message || "Something not work. Please try latter"}
        </p>
        :
        <p className="text-center text-[20px] md:text-[32px] text-text_primary font-sans">
          {errorLanguageData?.title}
        </p>
        }
       
      </div>
    </div>
  );
}
