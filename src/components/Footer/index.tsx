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

  const { data:mock, isLoading, error } = useJobsTranslation("vi", "global");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error...</div>;
  // console.log(mock);

  return (
    <footer className="bg-blue-900 text-white">
     
    </footer>
  );
};

export default Footer;
