import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Chat = () => {
  const global = useTranslateFile(LanguageFile.GLOBAL);
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        {global?.chat_to_hire_title}
      </span>
      <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
        {global?.chat_to_hire_description}
      </p>
      <div className="mt-6">
        <span className="text-[0.875rem] font-medium text-third">
          {global?.chat_to_hire_button}
          <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third" />
        </span>
      </div>
    </div>
  );
};

export default Chat;
