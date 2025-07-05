"use client";
import { CustomInput } from "@/components/ui/InputField";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { RegisterFormData } from "../RegisterForm";
import { usePublicFetchV2 } from "@/hooks/api-hooks";
import { API_ROUTES } from "@/api/endpoints";
import { CaptchaResponse } from "@/types/capcha";
import AvatarSkeleton from "@/components/ui/AvatarSkeleton";

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
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    data: captcha,
    isValidating,
    error: errorCaptcha,
    refetch,
  } = usePublicFetchV2<CaptchaResponse>(API_ROUTES.auth.get_capcha);

  // Set UUID từ captcha
  useEffect(() => {
    if (captcha?.ok?.uuid) {
      setCaptchaUuid(captcha.ok.uuid);
    }
  }, [captcha, setCaptchaUuid]);

  // Khi captcha mới, đặt lại trạng thái ảnh
  useEffect(() => {
    if (captcha?.ok?.png) {
      setImageLoaded(false);
    }
  }, [captcha?.ok?.png]);

  return (
    <div className="grid gap-4 grid-cols-[150px_1fr]">
      <div className="flex flex-col items-start justify-start space-y-2">
        {/* Skeleton nếu ảnh chưa sẵn sàng */}
        {(!captcha?.ok?.png || !imageLoaded) && <AvatarSkeleton />}

        {/* Ảnh captcha */}
        {captcha?.ok?.png && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`data:image/png;base64,${captcha.ok.png}`}
            alt="captcha"
            className={`h-20 w-full object-contain transition-opacity duration-300 ${
              isValidating ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        )}

        {/* Lỗi load captcha */}
        {errorCaptcha && (
          <p className="text-red-500 text-sm">Error loading captcha!</p>
        )}

        {/* Nút reload */}
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isValidating}
          className="text-blue-500 text-sm text-start"
        >
          <RefreshCcw
            className={`text-third w-6 h-6 ${
              imageLoaded && isValidating
                ? "animate-spin [animation-duration:0.8s]"
                : ""
            }`}
          />
        </button>
      </div>

      {/* Trường nhập captcha */}
      <CustomInput
        name="captcha_answer"
        register={register("captcha_answer")}
        error={error}
        placeholder="Enter captcha answer"
      />
    </div>
  );
};
