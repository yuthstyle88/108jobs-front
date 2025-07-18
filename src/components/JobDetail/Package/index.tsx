import { JobDetailIcon } from "@/constants/icons";
import { JobDetailResponse } from "@/types/jobDetail";
import { JobDetailLanguage } from "@/types/language";
import { formatThaiBaht } from "@/utils/formatMoney";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

type Props = {
  language: Partial<JobDetailLanguage> | undefined | null;
  data: JobDetailResponse;
};
const Package = ({ language, data }: Props) => {
  return (
    <div id="package">
      <div className="grid grid-cols-[1fr] gap-y-6">
        <h2 className="text-[1.25rem] text-third font-medium">
          {language?.packageDetails} {data.title}
        </h2>
        {data.packages.map((pkg) => (
          <div
            key={pkg.id}
            className="px-6 pt-6 pb-4 border-[0.0625rem] border-borderPrimary rounded-[0.25rem]"
          >
            <div className="flex flex-row justify-between text-third">
              <h3>
                <strong>{pkg.packageName}</strong>
              </h3>
              <strong>{formatThaiBaht(pkg.price)}</strong>
            </div>
            <div className="mt-2 text-[0.875rem] text-text_secondary flex flex-row gap-2 items-center font-sans">
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-text_secondary"
              />
              <p>ระยะเวลาในการทำงาน {pkg.executionTime} วัน</p>
            </div>
            <div className="pt-4 text-[14px] font-sans text-text-primary break-words whitespace-pre-wrap">
              <p>{pkg.description}</p>
            </div>
            <hr className="my-4 bg-borderPrimary block overflow-visible w-full h-[1px] m-0" />
            <div className="flex justify-end items-end">
              <button className="relative inline-flex justify-center items-center overflow-hidden min-h-[2.5rem] px-[1.125rem] border-none rounded-[0.25rem] bg-third text-[0.875rem] font-medium w-fit text-white">
                <span>{language?.chatWithFreelancers}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 shadow-md">
        <Image
          src={JobDetailIcon.companyHiring}
          alt="company"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Package;
