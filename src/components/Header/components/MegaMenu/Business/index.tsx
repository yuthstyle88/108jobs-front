import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Business = () => {
  const global = useTranslateFile(LanguageFile.GLOBAL);
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        {global?.business_service_title}
      </span>
      <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
        {global?.business_service_description}
      </p>
      <Link prefetch={false} href="/business" className="mt-6">
        <span className="text-[0.875rem] font-medium text-third">
          {global?.go_to_fastwork_business}
          <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third" />
        </span>
      </Link>
    </div>
  );
};

export default Business;
