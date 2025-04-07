import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Ads = () => {
  return (
    <div className="flex flex-col w-[420px] mt-8">
      <span className="text-third font-medium">
      Tăng cơ hội được thuê
      </span>
      <p className="mt-3 text-[0.875rem] text-text_secondary font-sans">
      Nâng cao cơ hội được thuê bằng cách quảng cáo với Fastlance
      </p>
      <Link target="_blank" rel="noopener noreferrer" href="https://docs.google.com/forms/d/e/1FAIpQLSesGWrCFtS0BfIszgQyVe33KA2jinuqMjpgWTUcypTzGO0xuQ/viewform?source=web_marketplace_top-nav-bar_mega-menu" className="mt-6">
        <span className="text-[0.875rem] font-medium text-third">
        Gửi phản hồi của bạn về tính năng quảng cáo
          <FontAwesomeIcon icon={faArrowRight} className="pl-2 text-third" />
        </span>
      </Link>
    </div>
  );
};

export default Ads;
