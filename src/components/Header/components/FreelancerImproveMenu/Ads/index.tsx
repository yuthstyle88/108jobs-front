import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Ads = () => {
  const global = useTranslateFile(LanguageFile.GLOBAL);
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        {global?.hire_opportunity_title}
      </span>
      <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
        {global?.ads_section_description}
      </p>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://docs.google.com/forms/d/e/1FAIpQLSesGWrCFtS0BfIszgQyVe33KA2jinuqMjpgWTUcypTzGO0xuQ/viewform?source=web_marketplace_top-nav-bar_mega-menu"
        className="mt-6"
      >
        <span className="text-[0.875rem] font-medium text-third">
          {global?.ads_feedback_link}
          <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third" />
        </span>
      </Link>
    </div>
  );
};

export default Ads;
