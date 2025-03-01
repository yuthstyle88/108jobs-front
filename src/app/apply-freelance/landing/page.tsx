import { FreelancerImage } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LandingApplyFreelancer = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-white overflow-hidden relative">
      <Image
        src={FreelancerImage.background_left}
        alt="landing"
        className="absolute left-0 top-0 object-cover h-full"
      />
      <Image
        src={FreelancerImage.background_right}
        alt="landing"
        className="absolute right-0 top-0 object-cover h-full"
      />

      <div className="m-0 mx-auto mb-8 pt-8 px-4 relative z-10">
        <div className="flex flex-col items-center justify-center h-full pt-16">
          <h1 className="text-[20px] font-bold text-gray-800 text-center">
            ลงทะเบียนเพื่อเป็นฟรีแลนซ์ที่ประสบความสำเร็จ
          </h1>
          <p className="text-gray-600 text-center mt-2 max-w-2xl font-sans">
            คุณสามารถเริ่มโพสต์งานของคุณได้ทันที เพียงคลิกเริ่มโพสต์งาน
          </p>

          <div className="mt-12 relative">
            <div className="relative flex items-center justify-center">
              <div className="relative z-20 border-4 border-white rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={FreelancerImage.landing}
                  alt="landing"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 w-full max-w-md flex flex-col gap-4">
            <Link
              href="/"
              className="w-full py-3 bg-blue-600 text-white text-center font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              เริ่มลงประกาศงาน
            </Link>

            <Link
              href="/"
              className="w-full py-3 text-blue-600 text-center font-medium border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              กลับสู่หน้าแรก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingApplyFreelancer;
