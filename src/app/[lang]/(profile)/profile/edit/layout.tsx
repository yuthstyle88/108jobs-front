"use client";
import {LanguageFile} from "@/constants/language";
import {useLanguage} from "@/contexts/LanguageContext";
import {ExternalLink} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ReactNode} from "react";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {getNamespace} from "@/utils/i18nHelper";


interface StartSellingLayoutProps {
  children: ReactNode;
}

export default function StartSellingLayout({
  children,
}: StartSellingLayoutProps) {
  const pathname = usePathname();
  const {lang} = useLanguage();
  const userEditLanguage = getNamespace(LanguageFile.PROFILE_USER_EDIT);

  const {profileState, person} = useMyUser();
  const menuItems = [
    {href: "/profile/edit/education", label: userEditLanguage?.education},
    {href: "/profile/edit/experience", label: userEditLanguage?.workExperience},
    {href: "/profile/edit/skills", label: userEditLanguage?.skills},
    {href: "/profile/edit/languages", label: userEditLanguage?.languages},
    {
      href: "/profile/edit/certifications",
      label: userEditLanguage?.certificatesAwards,
    },
  ];

  return (
    <>
      <section className="bg-[#FBFBFC] mb-12">
        <div className="h-[200px] relative flex justify-center items-center w-full edit-profile-gradient">
          <p className="text-[1.75rem] font-semibold text-white">
            {userEditLanguage?.userEditHeading}
          </p>
        </div>

        <div className="w-[1064px] mx-auto bg-[#FBFBFC]">
          <div className="min-h-screen flex pt-12">
            {/* Left sidebar */}
            <div className="w-56">
              <nav className="py-2 bg-white border-1 border-border-primary rounded-lg">
                <ul>
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link prefetch={false}
                            href={item.href}
                            className={`flex items-center px-4 py-2 ${
                              pathname === `/${lang}${item.href}`
                                ? "text-blue-600 bg-blue-50 border-l-4 border-blue-500"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="px-4 py-2 mt-4 border-1 border-border-primary rounded-lg">
                <Link prefetch={false}
                      href={`/profile/${person?.name}`}
                      className="text-blue-600 flex justify-center items-center gap-2"
                >
                  <p className="font-medium">
                    {userEditLanguage?.viewProfile}
                  </p>
                  <ExternalLink className="w-4 h-4 mr-2"/>
                </Link>
              </div>
            </div>

            {/* Main content */}
            <div className="px-20 flex-1">{children}</div>
          </div>
        </div>
      </section>
    </>
  );
}
