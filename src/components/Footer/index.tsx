"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useJobsTranslation } from "@/hooks/useTranslation";
import {
  faFacebook,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import LanguageSwitcher from "../LanguageSwitcher";

const Footer = () => {
  const { lang } = useLanguage();

  const { data: mock, isLoading, error } = useJobsTranslation(lang);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  console.log(error);
  console.log(mock.footer);

  const data = mock.footer;
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Categories */}
        <div>
          <h3 className="font-bold mb-3">{data.categories}</h3>
          <ul className="space-y-2 text-sm">
            {data.categoriesList?.map((item: string, index: number) => (
              <li key={index}>
                <Link href="#">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* How to Use */}
        <div>
          <h3 className="font-bold mb-3">{data.howToUse}</h3>
          <ul className="space-y-2 text-sm">
            {data.howToUseList?.map((item: string, index: number) => (
              <li key={index}>
                <Link href="#">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-bold mb-3">{data.products}</h3>
          <ul className="space-y-2 text-sm">
            {data.productsList?.map((item: string, index: number) => (
              <li key={index}>
                <Link href="#">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About Fastwork */}
        <div>
          <h3 className="font-bold mb-3">{data.aboutFastwork}</h3>
          <ul className="space-y-2 text-sm">
            {data.aboutFastworkList?.map((item: string, index: number) => (
              <li key={index}>
                <Link href="#">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold mb-3">{data.contact}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              {data.contactDetails.emailLabel}{" "}
              <Link href={`mailto:${data.contactDetails.email}`}>
                {data.contactDetails.email}
              </Link>
            </li>
            <li>
              <Link href="#">{data.contactDetails.messenger}</Link>
            </li>
          </ul>
          <p className="mt-3 text-xs">{data.contactDetails.workingHours}</p>
        </div>
      </div>

      <div className="bg-gray-800">
        <div className="container mx-auto px-4 py-2 md:grid-cols-5 gap-6 ">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex space-x-4 text-lg text-white items-center">
              <FontAwesomeIcon icon={faInstagram} />
              <FontAwesomeIcon icon={faFacebook} />
              <FontAwesomeIcon icon={faTiktok} />
              <span>| Sitemaps |</span>
              <LanguageSwitcher />
            </div>
            {/* Copyright */}
            <p className="text-xs text-white mt-3 md:mt-0">
              {data.bottom.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
