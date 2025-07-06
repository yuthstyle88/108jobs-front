"use client";
import { API_ROUTES } from "@/api/endpoints";
import CaptChaSkeleton from "@/components/ui/CaptChaSkeleton";
import { CustomInput } from "@/components/ui/InputField";
import { usePublicFetchV2 } from "@/hooks/api-hooks";
import { CaptchaResponse } from "@/types/capcha";
import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { UseFormRegister } from "react-hook-form";
import { RegisterFormData } from "../RegisterForm";

type CaptchaFieldProps = {
  setCaptchaUuid: (uuid: string) => void;
  register: UseFormRegister<RegisterFormData>;
  error?: string;
};

export const CaptchaField = ({
  setCaptchaUuid,
  register,
  error,
}: CaptchaFieldProps) => {
  const {
    data: captcha,
    isValidating,
    error: errorCaptcha,
    refetch,
  } = usePublicFetchV2<CaptchaResponse>(API_ROUTES.auth.get_capcha);

  useEffect(() => {
    if (captcha?.ok?.uuid) {
      setCaptchaUuid(captcha.ok.uuid);
    }
  }, [captcha, setCaptchaUuid]);

  const isCaptchaReady = captcha?.ok?.png && !isValidating;

  return (
    <div className="grid gap-4 grid-cols-[150px_1fr]">
      <div className="flex flex-col items-start justify-start space-y-2">
        {/* Skeleton when loading or refetching */}
        {isValidating || !isCaptchaReady ? (
          <CaptChaSkeleton />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`data:image/png;base64,${captcha.ok.png}`}
            alt="captcha"
            className="h-28 w-full"
          />
        )}

        {errorCaptcha && (
          <p className="text-red-500 text-sm">Error loading captcha!</p>
        )}

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isValidating}
          className="text-blue-500 text-sm text-start flex items-center gap-1"
        >
          <RefreshCcw className="text-third w-6 h-6" />
          <span>โหลดใหม่</span>
        </button>
      </div>

      <CustomInput
        name="captcha_answer"
        register={register("captcha_answer")}
        error={error}
        placeholder="Enter captcha answer"
      />
    </div>
  );
};
