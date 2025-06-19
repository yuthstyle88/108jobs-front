import { CategoriesImage } from "@/constants/images";
import { ChatResponse } from "@/types/chat";
import Image from "next/image";
import React from "react";

type Props = {
  currentRoom?: ChatResponse;
};

const ChatJob = ({ currentRoom }: Props) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4 max-w-md ml-auto">
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-900">
              {currentRoom?.job.title}
            </h4>
            <div className="mt-2 text-sm">
              <p className="text-gray-700">
                ราคา : {currentRoom?.job.base_price} บาท
              </p>
            </div>
          </div>
          <Image
            src={currentRoom?.job_cover_image || CategoriesImage.seo_job}
            alt="seo_job"
            width={64}
            height={48}
            className="w-16 h-12 object-cover rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatJob;
