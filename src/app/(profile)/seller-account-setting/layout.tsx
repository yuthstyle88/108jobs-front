import SellerHeader from "@/components/SellerHeader";
import SideBarSellerAccountSetting from "@/components/SideBarSellerAccountSetting";
import SpSellerHeader from "@/containers/SpHeaderSeller";
import { ReactNode } from "react";
import BreadCrumbAccountSetting from "./components/BreadScrumbAccountSetting";

interface SellerProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: SellerProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex">
      <div className="flex-1">
        <div className="hidden md:block">
          <SellerHeader />
        </div>
        <div className="block md:hidden">
          <SpSellerHeader />
        </div>
        <div className="min-h-screen bg-[#F8F9FB] pt-12">
          {/* Header */}
          <div className="max-w-7xl mx-auto flex items-center pt-12 pl-4 md:pt-0 md:pl-0">
            <BreadCrumbAccountSetting />
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
