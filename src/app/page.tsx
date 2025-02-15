import { Metadata } from "next";
import Image from "next/image";
import Header from '@/components/Header'
import { AssetIcon } from "@/constants/icons";

export default function Home() {
  return (
    <div className="">
      <Header/>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Fastlance.vn - Tổng hợp freelancer chất lượng hàng đầu cho doanh nghiệp ",
  description: "Nền tảng freelancer chất lượng cao cho doanh nghiệp tại Việt Nam.",
};