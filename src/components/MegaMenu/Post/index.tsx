import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Post = () => {
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
      หาฟรีแลนซ์ผ่านบอร์ดประกาศงาน
      </span>
      <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
      โพสต์รายละเอียดงาน รอฟรีแลนซ์มาเสนองาน และเลือกจ้างได้เลย
      </p>
      <div className="mt-6">
        <span className="text-[0.875rem] font-medium text-third">
        ไปบอร์ดประกาศงาน
        <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third"/>
        </span>
      </div>
    </div>
  );
};

export default Post;
