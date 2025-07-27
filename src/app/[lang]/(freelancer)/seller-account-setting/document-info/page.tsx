"use client";

import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";
import useNotification from "@/hooks/useNotification";
import {useHttpPost} from "@/hooks/useHttpPost";
import {REQUEST_STATE} from "@/services/HttpService";

const DocumentInfo = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const { successMessage, errorMessage } = useNotification();

  // ใช้ useHttpApi เพื่อเรียก API
  const { state, execute, isMutating } = useHttpPost("updateAvailable");

  const handleToggle = async (value: boolean) => {
    setIsAvailable(value);
    const response = await execute({ available: value });

    if (response.state === REQUEST_STATE.SUCCESS) {
      successMessage("profile", value ? "updateAvailable" : "updateNotAvailable");
    } else {
      setIsAvailable((prev) => !prev);
      errorMessage("profile", "updateAvailableFail");
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-800">Job availability information</h2>
        <p className="text-sm text-gray-500">
          Toggle this setting to let clients know you&apos;re currently accepting new jobs or not.
        </p>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-gray-700">Accepting Jobs</span>
          <Switch.Root
            checked={isAvailable}
            onCheckedChange={handleToggle}
            disabled={isMutating}
            className={`w-[42px] h-[24px] rounded-full relative transition-colors ${
              isAvailable ? "bg-blue-600" : "bg-gray-300"
            } ${isMutating ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
          >
            <Switch.Thumb
              className={`block w-[18px] h-[18px] bg-white rounded-full shadow-md transition-transform duration-200 ${
                isAvailable ? "translate-x-[18px]" : "translate-x-[3px]"
              }`}
            />
          </Switch.Root>
        </div>
      </div>
    </div>
  );
};

export default DocumentInfo;