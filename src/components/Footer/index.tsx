"use client";
import en from "@/assets/icons/en.svg";
import th from "@/assets/icons/th.svg";
import vn from "@/assets/icons/vn.svg";
import {LanguageFile} from "@/constants/language";
import {faFacebook, faInstagram, faTiktok,} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import {getNamespace} from "@/utils/i18nHelper";

const Footer = () => {
  const global = getNamespace(LanguageFile.GLOBAL);

  // Handle loading and error states

  if (!global) return <div className="bg-blue-900 text-white p-4 text-center">No translation data available</div>;

  return (
    <footer className="bg-blue-900 text-white">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Categories */}
        <div>
          <h3 className="font-bold mb-3">{global.tittleFooter1}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link prefetch={false} href="#">{global.labelNavBarItem2}</Link>
            </li>
            <li>
              <Link prefetch={false} href="#">{global.labelNavBarItem3}</Link>
            </li>
            <li>
              <Link prefetch={false} href="#">{global.labelNavBarItem4}</Link>
            </li>
            <li>
              <Link prefetch={false} href="#">{global.labelNavBarItem5}</Link>
            </li>
            <li>
              <Link prefetch={false} href="#">{global.labelNavBarItem6}</Link>
            </li>
            <li>
              <Link prefetch={false} href="#">{global.labelNavBarItem7}</Link>
            </li>
            <li>
              <Link prefetch={false} href="#">{global.labelNavBarItem8}</Link>
            </li>
            <li>
              <Link prefetch={false} href="#">{global.labelNavBarItem9}</Link>
            </li>
          </ul>
        </div>

        {/* How to Use */}
        <div>
          <h3 className="font-bold mb-3">{global.tittleFooter2}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link prefetch={false} href="/start-selling">
                {global.menuBecomeFreelancer}
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/content/how">
                {global.labelStartSellingWork}
              </Link>
            </li>
            {/* <li>
              <Link prefetch={false} href="/">{global.labelPaymentWages}</Link>
            </li> */}
            <li>
              <Link prefetch={false} href="/content/guarantee">
                {global.labelEmploymentGuarantee}
              </Link>
            </li>
            {/* <li>
              <Link prefetch={false} href="#">{global.labelKnowledgeBlog}</Link>
            </li> */}
            <li>
              <Link prefetch={false} href="/content/support-center">
                {global.labelFaq}
              </Link>
            </li>
            <li>
              <Link prefetch={false} href="/consent-management">
                {global.labelManageDataUsage}
              </Link>
            </li>
          </ul>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-bold mb-3">{global.tittleFooter3}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link prefetch={false} href="/">108jobs</Link>
            </li>
            <li>
              <Link prefetch={false} href="/business">108jobs for Business</Link>
            </li>
          </ul>
        </div>

        {/* About 108jobs */}
        <div>
          <h3 className="font-bold mb-3">{global.tittleFooter4}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link prefetch={false} href="https://form.jotform.com/251484529705059">{global.labelFeedbackUs}</Link>
            </li>
            <li>
              <Link prefetch={false} href="/">{global.labelWorkWithFastwork}</Link>
            </li>
            <li>
              <Link prefetch={false} href="/content/terms">{global.labelTermsOfService}</Link>
            </li>
            <li>
              <Link prefetch={false} href="/content/privacy">{global.labelPrivacyPolicy}</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold mb-3">{global.tittleFooter5}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              Email:{" "}
              <Link prefetch={false} href="mailto:support@fastwork.co">support@fastwork.co</Link>
            </li>
            <li>
              <Link prefetch={false} href="#">Facebook Messenger</Link>
            </li>
          </ul>
          <p className="mt-3 text-xs">
            {global.labelWorkingHoursWeekdays} <br/>
            {global.labelWorkingHoursWeekends}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-800">
        <div className="container mx-auto px-4 py-2 md:grid-cols-5 gap-6 items-center">
          <div className="flex flex-col items-center md:flex-row justify-between">
            <div className="flex space-x-4 text-lg text-white items-center">
              <FontAwesomeIcon icon={faInstagram}/>
              <FontAwesomeIcon icon={faFacebook}/>
              <FontAwesomeIcon icon={faTiktok}/>
              <span>| Sitemaps |</span>
              <Image
                src={th}
                alt="TH"
                height={23}
                style={{height: "23px", width: "auto"}}
              />
              <Image
                src={en}
                alt="EN"
                height={23}
                style={{height: "23px", width: "auto"}}
              />
              <Image
                src={vn}
                alt="VN"
                height={23}
                style={{height: "23px", width: "auto"}}
              />
            </div>

            {/* Copyright */}
            <p className="text-sm font-sans text-white mt-3 md:mt-0">
              © 2025 108jobs
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
