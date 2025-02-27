import { AssetIcon } from "@/constants/icons";
import {
  faArrowRightToBracket,
  faCalendar,
  faFileContract,
  faGift,
  faIdCard,
  faListCheck,
  faMoneyBill1Wave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const SellerSidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-[73px] border-b border-gray-200">
        <a href="/" className="flex items-center justify-row pl-4 pr-8">
          <div className="relative overflow-hidden py-4 pr-4 flex items-center">
            <Image
              src={AssetIcon.logo_seller}
              alt="avatar"
              className="w-full h-full"
            />
          </div>
          <FontAwesomeIcon
            icon={faArrowRightToBracket}
            className="text-[20px] text-third rotate-180"
          />
        </a>
      </div>

      <nav className="flex-1">
        <div className="">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-4 text-base text-third bg-white border-l-4 border-primary bg-secondary"
          >
            <FontAwesomeIcon
              icon={faFileContract}
              className="text-[16px] text-third "
            />
            <p>Tổng quan</p>
          </a>
          <a
            href="#"
            className="group flex items-center gap-3 px-3 py-4 text-base text-text_secondary bg-white border-l-4 hover:border-primary hover:bg-secondary"
          >
            <FontAwesomeIcon
              icon={faListCheck}
              className="text-[16px] text-text_secondary group-hover:text-third"
            />
            <p>Quản lý dự án</p>
          </a>
          <a
            href="#"
            className="group flex items-center gap-3 px-3 py-4 text-base text-text_secondary bg-white border-l-4 hover:border-primary hover:bg-secondary"
          >
            <FontAwesomeIcon
              icon={faIdCard}
              className="text-[16px] text-text_secondary group-hover:text-third"
            />
            <p>Thống kê tài khoản</p>
          </a>
          <a
            href="#"
            className="group flex items-center gap-3 px-3 py-4 text-base text-text_secondary bg-white border-l-4 hover:border-primary hover:bg-secondary"
          >
            <FontAwesomeIcon
              icon={faCalendar}
              className="text-[16px] text-text_secondary group-hover:text-third"
            />
            <p>Dịch vụ của tôi</p>
          </a>
          <a
            href="#"
            className="group flex items-center gap-3 px-3 py-4 text-base text-text_secondary bg-white border-l-4 hover:border-primary hover:bg-secondary"
          >
            <FontAwesomeIcon
              icon={faMoneyBill1Wave}
              className="text-[16px] text-text_secondary group-hover:text-third"
            />
            <p>Rút tiền freelancer</p>
          </a>
          <a
            href="#"
            className="group flex items-center gap-3 px-3 py-4 text-base text-text_secondary bg-white border-l-4 hover:border-primary hover:bg-secondary"
          >
            <FontAwesomeIcon
              icon={faGift}
              className="text-[16px] text-text_secondary group-hover:text-third"
            />
            <p>Phần thưởng Fastlance</p>
          </a>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          Gửi phản hồi
        </a>
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          Trung tâm hỗ trợ
        </a>
      </div>
    </div>
  );
};

export default SellerSidebar;
