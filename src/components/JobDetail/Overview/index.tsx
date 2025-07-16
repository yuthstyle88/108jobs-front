import { JobDetailIcon } from "@/constants/icons";
import { CategoriesImage } from "@/constants/images";
import { JobDetailResponse } from "@/types/jobDetail";
import { JobDetailLanguage } from "@/types/language";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

type Props = {
  language: Partial<JobDetailLanguage> | undefined | null;
  data: JobDetailResponse;
};

const Overview = ({ language, data }: Props) => {
  return (
    <section>
      <h1 className="text-[1.5rem] text-third font-medium leading-[1.15]">
        {data.title}
      </h1>
      <div className="flex flex-wrap mt-3 gap-3">
        <div className="pr-2 border-r-1 border-r-borderPrimary flex items-center">
          <FontAwesomeIcon icon={faStar} className="text-[#E9B10C]" />
          <span className="ml-1 font-sans text-textPrimary">
            {Number(data.rating).toFixed(1)}
          </span>
        </div>
        <Link prefetch={false} href="#" className="">
          <Image
            src={CategoriesImage.specialist}
            alt="badgeRehire"
            className="h-6 w-full"
          />
        </Link>
        <Link prefetch={false} href="#" className="">
          <Image
            src={CategoriesImage.badgeRehire}
            alt="badgeRehire"
            className="h-6 w-full"
          />
        </Link>
      </div>
      <div className="px-3 py-2 gap-x-2 flex rounded-lg bg-[#F6F7F8] items-center my-6 ">
        <Image
          src={JobDetailIcon.iconRehire}
          alt="iconRehire"
          className="w-8 h-8"
        />
        <div className="text-[0.875rem] text-textPrimary font-sans">
          {language?.employersTrust}
        </div>
      </div>
      <hr className="mt-4 bg-borderPrimary block overflow-visible w-full h-[1px] m-0" />
      <div className="break-words whitespace-pre-wrap m-0 leading-[1.65]  mt-6">
        <div className="text-textPrimary font-sans">
          <p className="">{data.description}</p>

          <hr className="my-4" />

          <p className="text-base font-semibold text-textPrimary">
            Working step for
            {` `}
            {data.title}
          </p>
          <ul className="pl-4 py-3 text-base list-disc">
            {data.worksteps.map((step, index) => (
              <li key={index} className="mb-2">
                {step.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Overview;
