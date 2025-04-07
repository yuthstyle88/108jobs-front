import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Post = () => {
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
        Xem bài đăng tuyển dụng của người thuê & đề xuất dịch vụ của bạn
      </span>
      <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
        Hiển thị dịch vụ của bạn dưới các bài đăng của người thuê để tăng cơ hội
        được thuê.
      </p>
      <Link href="/job-board" className="mt-6">
        <span className="text-[0.875rem] font-medium text-third">
          Đi đến Bảng thông báo việc làm
          <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third" />
        </span>
      </Link>
    </div>
  );
};

export default Post;
