import SellerHeader from "@/components/SellerHeader";
import SideBarSellerAccountSetting from "@/components/SideBarSellerAccountSetting";
import { defaultMetadata } from "@/config/metadata";
import Link from "next/link";
import { ReactNode } from "react";

interface SellerProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: SellerProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      <div className="flex-1">
        <SellerHeader />
        <div className="min-h-screen bg-[#F8F9FB] pt-12">
          {/* Header */}
          <div className="max-w-7xl mx-auto flex items-center">
            <div className="flex items-center text-blue-600">
              <Link href="/seller" className="text-blue-600 font-medium">
                Seller center
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-600">Cài đặt tài khoản</span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Left sidebar */}
            <SideBarSellerAccountSetting />
            <div className="md:col-span-3">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  ...defaultMetadata,
  title: "Seller Center | Fastwork.co",
  description:
    "ติดตามความคืบหน้าและจัดการงานอย่างมืออาชีพบน Fastlance Seller Center",
  openGraph: {
    ...defaultMetadata.openGraph,
    title: "Seller Center | Fastwork.co",
    description:
      "ติดตามความคืบหน้าและจัดการงานอย่างมืออาชีพบน Fastlance Seller Center",
  },
};
