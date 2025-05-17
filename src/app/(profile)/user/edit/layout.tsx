"use client";
import { API_ROUTES } from "@/api/endpoints";
import Loading from "@/components/Loading";
import { LanguageFile } from "@/constants/language";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { ProfileData } from "@/types/userData";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface StartSellingLayoutProps {
  children: ReactNode;
}

export default function StartSellingLayout({
  children,
}: StartSellingLayoutProps) {
  const pathname = usePathname();

  const {
    data: userEditLanguage,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.PROFILE_USER_EDIT);

  const { data: user } = usePrivateFetch<ProfileData>(
    API_ROUTES.profile.get_profile
  );

  const menuItems = [
    { href: "/user/edit/education", label: userEditLanguage?.education },
    { href: "/user/edit/experience", label: userEditLanguage?.work_experience },
    { href: "/user/edit/skills", label: userEditLanguage?.skills },
    { href: "/user/edit/languages", label: userEditLanguage?.languages },
    { href: "/user/edit/certifications", label: userEditLanguage?.certificates_awards },
  ];

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;

  return (
    <>
      <section className="bg-[#FBFBFC] mb-12">
        <div className="h-[200px] relative flex justify-center items-center w-full edit-profile-gradient">
          <p className="text-[1.75rem] font-semibold text-white">
            Chỉnh sửa thông tin freelancer
          </p>
        </div>

        <div className="w-[1064px] mx-auto bg-[#FBFBFC]">
          <div className="min-h-screen flex pt-12">
            {/* Left sidebar */}
            <div className="w-56">
              <nav className="py-2 bg-white border-1 border-border_primary rounded-lg">
                <ul>
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-2 ${
                          pathname === item.href
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

              <div className="px-4 py-2 mt-4 border-1 border-border_primary rounded-lg">
                <Link
                  target="_blank"
                  href={`/user/${user?.user.username}`}
                  className="text-blue-600 flex justify-center items-center gap-2"
                >
                  <p className="font-medium">{userEditLanguage?.view_profile}</p>
                  <ExternalLink className="w-4 h-4 mr-2" />
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
