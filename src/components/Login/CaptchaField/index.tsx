"use client";
import { API_ROUTES } from "@/api/endpoints";
import CaptChaSkeleton from "@/components/ui/CaptChaSkeleton";
import { CustomInput } from "@/components/ui/InputField";
import { usePublicFetchV2 } from "@/hooks/api-hooks";
import { CaptchaResponse } from "@/types/capcha";
import { RefreshCcw } from "lucide-react";
import { useEffect, useRef } from "react";
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
  const hasLoadedOnce = useRef(false);
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

  useEffect(() => {
    if (captcha?.ok?.png) {
      hasLoadedOnce.current = true;
    }
  }, [captcha]);

  return (
    <div className="grid gap-4 grid-cols-[150px_1fr]">
      <div className="flex flex-col items-start justify-start space-y-2">
        {!captcha?.ok?.png && isValidating && <CaptChaSkeleton />}
        {captcha?.ok?.png && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`data:image/png;base64,${captcha.ok.png}`}
            alt="captcha"
            className={`h-28 w-full ${
              isValidating ? "opacity-50 pointer-events-none" : ""
            }`}
          />
        )}
        {errorCaptcha && (
          <p className="text-red-500 text-sm">Error loading capcha!</p>
        )}
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isValidating}
          className="text-blue-500 text-sm text-start"
        >
          <RefreshCcw
            className={`text-third w-6 h-6 ${
              hasLoadedOnce.current && isValidating
                ? "animate-spin [animation-duration:0.8s]"
                : ""
            }`}
          />
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
