"use client";
import { JobDetailIcon } from "@/constants/icons";
import { ProfileImage } from "@/constants/images";
import { useLanguage } from "@/contexts/LanguageContext";
import { JobDetailResponse } from "@/types/jobDetail";
import { JobDetailLanguage } from "@/types/language";
import Image from "next/image";
import Link from "next/link";

type Props = {
  language: Partial<JobDetailLanguage> | undefined | null;
  data: JobDetailResponse;
};

const Freelance = ({ language, data }: Props) => {
  const { lang: currentLang } = useLanguage();
  const freelancer = [
    {
      title: language?.work_completed,
      icon: JobDetailIcon.completed,
      percentage:
        data.completion_rate === 0 ? "-" : `${data.completion_rate}%`,
    },
    {
      title: language?.can_be_sold,
      icon: JobDetailIcon.sold,
      percentage:
        data.completion_rate === 0
          ? "-"
          : `${data.completion_rate} ${language?.times}`,
    },
    {
      title: language?.re_hiring,
      icon: JobDetailIcon.response,
      percentage:
        data.rehire_orders_count === 0
          ? "-"
          : `${data.rehire_orders_count} ${language?.times}`,
    },
    {
      title: language?.respond,
      icon: JobDetailIcon.hiring,
      percentage:
        data.reviews_count === 0
          ? "-"
          : `${data.reviews_count} ${language?.minutes}`,
    },
  ];
  return (
    <div className="grid grid-cols-[1fr] gap-y-6">
      <h2 className="text-[1.25rem] text-third font-medium">
        {language?.freelancer}
      </h2>
      <div className="mx-auto bg-white rounded-xl border-border_primary border-1 shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <Link prefetch={false} href={`/${currentLang}/user/${data.user.username}`} className="flex items-start space-x-4">
            <Image
              src={data.user.avatar_url || ProfileImage.avatar}
              alt="Profile"
              width={88}
              height={88}
              className="w-[88px] h-[88px] rounded-full object-cover"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg text-text_primary font-semibold">
                  {data.user.display_name}
                </h2>
                <button className="px-3 py-1 text-blue-600 border border-blue-600 rounded-lg text-sm hover:bg-blue-50">
                  {language?.view_profile}
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed font-sans text-text_secondary line-clamp-4">
                {data.user.bio}
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          {freelancer.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center space-x-2"
            >
              <Image src={item.icon} alt="icon" className="h-6" />
              <div>
                <div className="text-text_secondary font-sans">
                  {item.title}
                </div>
                <div className="text-blue-600 font-semibold">
                  {item.percentage}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Freelance;
