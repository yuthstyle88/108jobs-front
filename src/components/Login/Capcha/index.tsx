"use client";
import { CustomInput } from "@/components/ui/InputField";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { RegisterFormData } from "../RegisterForm";

type CaptchaFieldProps = {
  setCaptchaUuid: (uuid: string) => void;
  register: UseFormRegister<RegisterFormData>;
  error?: string;
};

const mockFetchCaptcha = async () => {
  const dummyPng =
    "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";

  return {
    png: dummyPng,
    uuid: crypto.randomUUID(),
  };
};

export const CaptchaField = ({
  setCaptchaUuid,
  register,
  error,
}: CaptchaFieldProps) => {
  const [captchaData, setCaptchaData] = useState<{
    png: string;
    uuid: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCaptcha = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await mockFetchCaptcha();
      setCaptchaData({ png: result.png, uuid: result.uuid });
      setCaptchaUuid(result.uuid);
    } catch (error) {
      console.error("Error fetching captcha", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-[150px_1fr]">
      <div className="flex flex-col items-start justify-start space-y-2">
        {captchaData && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:image/png;base64,${captchaData.png}`}
            alt="captcha"
            className={`h-16 ${
              loading ? "opacity-50 pointer-events-none" : ""
            }`}
          />
        )}

        <button
          type="button"
          onClick={loadCaptcha}
          disabled={loading}
          className="text-blue-500 text-sm text-start"
        >
          {loading ? (
            <RefreshCcw className="text-third w-6 h-6 animate-spin [animation-duration:0.8s]" />
          ) : (
            <RefreshCcw className="text-third w-6 h-6" />
          )}
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
