"use client";
import Link from "next/link";
import Image from "next/image";
import id from "@/assets/icons/id.svg";
import th from "@/assets/icons/th.svg";
import vn from "@/assets/icons/vn.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { useLanguageStore } from "@/store/useLanguageStore";

const Footer = () => {
  const { globalLanguageData } = useLanguageStore();

  return (
    <footer className="bg-blue-900 text-white">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Categories */}
        <div>
          <h3 className="font-bold mb-3">
            {globalLanguageData?.tittle_footer_1}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">{globalLanguageData?.label_nav_bar_item_2}</Link>
            </li>
            <li>
              <Link href="#">{globalLanguageData?.label_nav_bar_item_3}</Link>
            </li>
            <li>
              <Link href="#">{globalLanguageData?.label_nav_bar_item_4}</Link>
            </li>
            <li>
              <Link href="#">{globalLanguageData?.label_nav_bar_item_5}</Link>
            </li>
            <li>
              <Link href="#">{globalLanguageData?.label_nav_bar_item_6}</Link>
            </li>
            <li>
              <Link href="#">{globalLanguageData?.label_nav_bar_item_7}</Link>
            </li>
            <li>
              <Link href="#">{globalLanguageData?.label_nav_bar_item_8}</Link>
            </li>
            <li>
              <Link href="#">{globalLanguageData?.label_nav_bar_item_9}</Link>
            </li>
          </ul>
        </div>

        {/* How to Use */}
        <div>
          <h3 className="font-bold mb-3">
            {globalLanguageData?.tittle_footer_2}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">{globalLanguageData?.menu_become_freelancer}</Link>
            </li>
            <li>
              <Link href="#">
                {globalLanguageData?.label_start_selling_work}
              </Link>
            </li>
            <li>
              <Link href="#">{globalLanguageData?.label_payment_wages}</Link>
            </li>
            <li>
              <Link href="#">
                {globalLanguageData?.label_employment_guarantee}
              </Link>
            </li>
            <li>
              <Link href="#">{globalLanguageData?.label_knowledge_blog}</Link>
            </li>
            <li>
              <Link href="#">{globalLanguageData?.label_faq}</Link>
            </li>
            <li>
              <Link href="#">
                {globalLanguageData?.label_manage_data_usage}
              </Link>
            </li>
          </ul>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-bold mb-3">
            {globalLanguageData?.tittle_footer_3}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">Fastwork</Link>
            </li>
            <li>
              <Link href="#">Fastwork for Business</Link>
            </li>
          </ul>
        </div>

        {/* About Fastwork */}
        <div>
          <h3 className="font-bold mb-3">
            {globalLanguageData?.tittle_footer_4}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#">{globalLanguageData?.label_feedback_us}</Link>
            </li>
            <li>
              <Link href="#">
                {globalLanguageData?.label_work_with_fastwork}
              </Link>
            </li>
            <li>
              <Link href="#">{globalLanguageData?.label_terms_of_service}</Link>
            </li>
            <li>
              <Link href="#">{globalLanguageData?.label_privacy_policy}</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold mb-3">
            {globalLanguageData?.tittle_footer_5}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              Email:{" "}
              <Link href="mailto:support@fastwork.co">support@fastwork.co</Link>
            </li>
            <li>
              <Link href="#">Facebook Messenger</Link>
            </li>
          </ul>
          <p className="mt-3 text-xs">
            {globalLanguageData?.label_working_hours_weekdays} <br />
            {globalLanguageData?.label_working_hours_weekends}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-800">
        <div className="container mx-auto px-4 py-2 md:grid-cols-5 gap-6 items-center">
          <div className="flex flex-col items-center md:flex-row justify-between">
            <div className="flex space-x-4 text-lg text-white items-center">
              <FontAwesomeIcon icon={faInstagram} />
              <FontAwesomeIcon icon={faFacebook} />
              <FontAwesomeIcon icon={faTiktok} />
              <span>| Sitemaps |</span>
              <Image src={th} alt="TH" width={24} height={16} />
              <Image src={id} alt="SG" width={24} height={16} />
              <Image src={vn} alt="VN" width={24} height={16} />
            </div>

            {/* Copyright */}
            <p className="text-sm font-sans text-white mt-3 md:mt-0">
              © 2025 Fastwork
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
