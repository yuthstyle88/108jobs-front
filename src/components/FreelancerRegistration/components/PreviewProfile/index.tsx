import { ApplyFreelancerIcon, AssetIcon } from "@/constants/icons";
import {
    ArrowLeft,
    ArrowRight,
    Handshake,
    Home,
    Lock,
    MessageSquareMore,
    RefreshCcw,
    RotateCw,
    ShoppingCart,
  } from "lucide-react";
  import Image from "next/image";
  import React from "react";
  
  type FormData = {
    username: string;
    bio: string;
    display_name: string;
    avatar_url: string | null;
  };
  
  type PreviewProfileProps = {
    formData: FormData;
  };
  
  const PreviewProfile: React.FC<PreviewProfileProps> = ({ formData }) => {
  return (
    <div className="w-full md:w-1/2 md:pl-4 step2-gradient relative z-0 overflow-hidden">
      <div className=" rounded-lg overflow-hidden absolute top-[100px] left-[150px] -z-0 w-full h-full bg-white">
        <div className="bg-[#dee1e6] flex h-[42px] px-3">
          <div className="flex gap-2 items-center flex-row">
            <div className="bg-red-500 w-3 h-3 rounded-full"></div>
            <div className="bg-yellow-500 w-3 h-3 rounded-full"></div>
            <div className="bg-green-500 w-3 h-3 rounded-full"></div>
          </div>
          <div className="ml-4 h-full w-[200px] relative">
            <div className="flex flex-row gap-2 absolute bottom-0 items-center rounded-tr-lg rounded-tl-lg bg-white h-[80%] w-[200px] px-3">
              <div className="flex flex-row gap-2 items-center">
                <Image
                  src={AssetIcon.favicon}
                  width={18}
                  height={18}
                  alt="Fastwork Logo"
                />
                <div className="w-[180px] h-[10px] rounded-md skeleton-gray"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center flex-row px-3 relative bg-white h-[38px] border-b border-gray-100">
          <ArrowLeft width={18} color="gray" />
          <ArrowRight width={18} color="gray" />
          <RotateCw width={18} color="gray" />
          <Home width={18} color="gray" />
          <div className="flex gap-2 items-center flex-row px-3 h-[28px] rounded-[14px] flex-1 bg-fourth ">
            <Lock width={15} color="gray" />
            <span className="text-text_primary text-[12px]">
              Fastwork.co/user/{formData.username || "username"}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute left-[25px] top-[220px] max-w-[475px] w-full">
        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mr-4">
              {formData.avatar_url ? (
                <Image
                  src={formData.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                />
              ) : (
                <div className="w-full h-full bg-gray-300"></div>
              )}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3 className="font-medium text-lg text-text_primary truncate">
                {formData.display_name || "Display name"}
              </h3>
              <p className="text-gray-500 text-sm break-words whitespace-pre-line line-clamp-3">
                {formData.bio || "Bio"}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <div className="flex space-x-6">
              <div className="flex items-center gap-2">
                <Handshake width={20} className="text-gray-400" />
                <div className="flex flex-col gap-1">
                  <div className="w-[50px] h-[12px] rounded-md skeleton-gray"></div>
                  <div className="w-[30px] h-[12px] rounded-md skeleton-blue"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart width={20} className="text-gray-400" />
                <div className="flex flex-col gap-1">
                  <div className="w-[50px] h-[12px] rounded-md skeleton-gray"></div>
                  <div className="w-[30px] h-[12px] rounded-md skeleton-blue"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCcw width={20} className="text-gray-400" />
                <div className="flex flex-col gap-1">
                  <div className="w-[50px] h-[12px] rounded-md skeleton-gray"></div>
                  <div className="w-[30px] h-[12px] rounded-md skeleton-blue"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquareMore width={20} className="text-gray-400" />
                <div className="flex flex-col gap-1">
                  <div className="w-[50px] h-[12px] rounded-md skeleton-gray"></div>
                  <div className="w-[30px] h-[12px] rounded-md skeleton-blue"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-secondary px-4 py-2 rounded-lg border border-third ">
          <div className="flex gap-3">
            <Image
              src={ApplyFreelancerIcon.know}
              alt="know"
              width={23}
              height={18}
            />
            <div>
              <p className="text-sm text-gray-700">
                ลูกค้ากว่า 80% อ่านประวัติของคุณ ก่อนตัดสินใจจ้างงาน
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewProfile;
