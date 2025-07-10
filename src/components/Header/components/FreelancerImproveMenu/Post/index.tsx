import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Post = () => {
  const global = useTranslateFile(LanguageFile.GLOBAL);
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        {global?.job_board_side_title}
      </span>
      <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
        {global?.job_board_side_desc}
      </p>
      <Link prefetch={false} href="/job-board" className="mt-6">
        <span className="text-[0.875rem] font-medium text-third">
          {global?.job_board_button}
          <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third" />
        </span>
      </Link>
    </div>
  );
};

export default Post;
