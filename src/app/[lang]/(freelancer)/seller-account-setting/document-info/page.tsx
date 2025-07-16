"use client";

import { API_ROUTES } from "@/api/endpoints";
import * as Switch from "@radix-ui/react-switch";
import { useState } from "react";
import { usePrivatePut } from "@/hooks/api-hooks";
import useNotification from "@/hooks/useNotification";

const DocumentInfo = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const { successMessage, errorMessage } = useNotification();
  const { trigger: updateStatus, isMutating } = usePrivatePut(
    API_ROUTES.profile.updateAvailable
  );

  const handleToggle = async (value: boolean) => {
    setIsAvailable(value);
    try {
      await updateStatus({ available: value });
      successMessage(
        "profile",
        value ? "updateAvailable" : "updateNotAvailable"
      );
    } catch (err) {
      console.error("Failed to update availability", err);
      setIsAvailable((prev) => !prev);
      errorMessage("profile", "updateAvailableFail");
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-medium text-gray-800">
          Job availability information
        </h2>
        <p className="text-sm text-gray-500">
          Toggle this setting to let clients know you&apos;re currently accepting new
          jobs or not.
        </p>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-gray-700">
            Accepting Jobs
          </span>
          <Switch.Root
            checked={isAvailable}
            onCheckedChange={handleToggle}
            disabled={isMutating}
            className={`w-[42px] h-[24px] rounded-full relative transition-colors ${
              isAvailable ? "bg-blue-600" : "bg-gray-300"
            } ${
              isMutating ? "opacity-50 pointer-events-none" : "cursor-pointer"
            }`}
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
