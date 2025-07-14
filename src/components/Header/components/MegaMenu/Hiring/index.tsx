import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Hiring = () => {
  const global = useTranslateFile(LanguageFile.GLOBAL);
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        {global?.company_registration_title}
      </span>
      <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
        {global?.signIn_steps_intro} <br />
        1. {global?.company_registration_step_1} <br />
        2. {global?.company_registration_step_2} <br />
        3. {global?.company_registration_step_3}
      </p>
      <Link prefetch={false} href="#" className="mt-6">
        <span className="text-[0.875rem] font-medium text-third">
          {global?.chat_to_hire_button}
          <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third" />
        </span>
      </Link>
    </div>
  );
};

export default Hiring;
