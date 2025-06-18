"use client";
import { API_ROUTES } from "@/api/endpoints";
import FavoriteButton from "@/components/FavoriteButton";
import ShareJobModal from "@/components/ShareJob";
import { JobDetailIcon } from "@/constants/icons";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { JobDetailResponse } from "@/types/jobDetail";
import { JobDetailLanguage } from "@/types/language";
import { ProfileData } from "@/types/userData";
import { formatThaiBaht } from "@/utils/formatMoney";
import { scrollToElementById } from "@/utils/scrollSmooth";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface AsideJobProps {
  language: Partial<JobDetailLanguage> | undefined | null;
  data: JobDetailResponse;
}

const AsideJob = ({ language, data }: AsideJobProps) => {
  const { data: user } = usePrivateFetch<ProfileData>(
    API_ROUTES.profile.get_profile
  );
  console.log("user", user);

  const [selectedPackage, setSelectedPackage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    scrollToElementById("package");
  };

  const isCurrentUser = data?.user.user_id === user?.user.id;

  const isAvailable = data.user.available === true;

  return (
    <aside className="text-black sticky top-40 self-start">
      <div className="bg-[#F6F9FE] rounded-md shadow-jobCard p-4">
        <div className="flex items-center ">
          <div className="mr-4">
            <Image
              src={JobDetailIcon.guarantee}
              alt="guarantee"
              className="w-16 h-[45px]"
            />
          </div>
          <div className="">
            <strong className="text-third ">
              {language?.fastwork_guarantee}
            </strong>
            <p className="mt-1 text-[0.75rem] text-text_secondary font-sans">
              {language?.fastwork_guarantee_description}
            </p>
            <Link href="#" className="text-third text-[0.75rem] font-sans">
              {language?.read_additional_protection_terms}
            </Link>
          </div>
        </div>
      </div>
      <div className="rounded-md overflow-hidden mt-4 shadow-jobCard ">
        <section className="grid-cols-[1fr_1fr_1fr] grid min-w-0 min-h-0">
          {data.packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative ${
                selectedPackage === index
                  ? "bg-white text-[#1a73e8]"
                  : "bg-[#F6F7F8] text-[#8793a6]"
              } py-5 text-center cursor-pointer ${
                index === 0 ? "rounded-tl-md" : ""
              } ${index === 2 ? "rounded-tr-md" : ""}`}
              onClick={() => setSelectedPackage(index)}
            >
              <strong>{formatThaiBaht(pkg.price)}</strong>
            </div>
          ))}
        </section>
        <section className="p-6 bg-white">
          <h3 className="font-medium text-third">
            {data.packages[selectedPackage].package_name}
          </h3>
          <p className="line-clamp-2 text-ellipsis overflow-hidden break-words mt-2 text-[0.875rem] text-text_secondary font-sans ">
            {data.packages[selectedPackage].description}
          </p>
          <Link
            href="#package"
            onClick={(e) => handleClick(e)}
            className="text-third mt-2 font-semibold text-[0.875rem] cursor-pointer font-sans"
          >
            {language?.view_package_info}
          </Link>
          <hr className="mt-4 bg-border_primary block overflow-visible w-full h-[1px] m-0" />
          {!isCurrentUser && (
            <>
              {isAvailable ? (
                <Link
                  href={`/chat/message/${data.id}`}
                  target="_blank"
                  className="w-full"
                >
                  <button className="relative inline-flex justify-center items-center overflow-hidden min-h-[2.5rem] px-[1.125rem] border-none rounded-[0.25rem] bg-third text-[0.875rem] font-medium w-full text-white">
                    <span>{language?.chat_with_freelancers}</span>
                  </button>
                </Link>
              ) : (
                <div className="w-full">
                  <button
                    disabled
                    className="relative inline-flex justify-center items-center overflow-hidden min-h-[2.5rem] px-[1.125rem] border-none rounded-[0.25rem] bg-third text-[0.875rem] font-medium w-full text-white opacity-50 cursor-not-allowed"
                  >
                    <span>{language?.chat_with_freelancers}</span>
                  </button>
                </div>
              )}

              <div className="text-center mt-2">
                {!isAvailable ? (
                  <small className="text-[0.75rem] text-red-600">
                    *This freelancer is currently not accepting new jobs.
                  </small>
                ) : (
                  <small className="text-[0.75rem] text-text_secondary">
                    {language?.no_charges_message}
                  </small>
                )}
              </div>
            </>
          )}
        </section>
      </div>
      <div className="mt-4 overflow-hidden shadow-jobCard rounded-[0.5rem] ">
        <Link href="#">
          <div className="aspect-[320/68] h-[68px] w-full relative">
            <Image
              src={JobDetailIcon.company}
              alt="company"
              width={500}
              height={500}
              className="object-cover bg-center"
            />
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-[1fr_1fr] text-center mt-4 font-medium text-text_secondary ">
        <FavoriteButton jobId={data.id} label={language?.save} />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex flex-row items-center justify-center min-w-[34px] p-2 cursor-pointer"
        >
          <FontAwesomeIcon icon={faShareAlt} className="text-text_secondary" />
          <p className="ml-2 cursor-pointer text-center">{language?.share}</p>
        </button>
      </div>
      <ShareJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </aside>
  );
};

export default AsideJob;
