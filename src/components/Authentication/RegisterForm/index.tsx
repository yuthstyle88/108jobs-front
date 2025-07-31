"use client";
import LoadingCircle from "@/components/LoadingCircle";
import {CustomInput} from "@/components/ui/InputField";
import {RegisterDataProps} from "@/types/register-data";
import {zodResolver} from "@hookform/resolvers/zod";
import {CaptchaResponse, GetCaptchaResponse, GetSiteResponse, LoginResponse, MyUserInfo, RoleType} from "lemmy-js-client";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

import {Spinner} from "@/components/icon";
import {UserService} from "@/services";
import {EMPTY_REQUEST, HttpService, isSuccess, LOADING_REQUEST, REQUEST_STATE, RequestState,} from "@/services/HttpService";
import {toast} from "@/toast";
import {setIsoData} from "@/utils/app";
import {isBrowser} from "@/utils/browser";
import classNames from "classnames";
import {Play, RefreshCcw} from "lucide-react";
import Link from "next/link";
import {useTranslation} from "react-i18next";

// Form schema definition
const createRegisterSchema = (t: any) => z
.object({
  email: z.string().email(t("authen.invalidEmail")),
  username: z.string().min(6,
    t("authen.usernameMin6")),
  password: z.string().min(6,
    t("authen.passwordMin6")),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine((val) => val),
  privacyAccepted: z.boolean().refine((val) => val),
  captchaAnswer: z.string().min(4,
    t("authen.requireCaptcha")),
  role: z.nativeEnum(RoleType),
})
.refine((data) => data.password === data.confirmPassword,
  {
    message: t("authen.notMatchPassword"),
    path: ["confirmPassword"],
  });

interface RegisterFormProps {
  redirectUrl?: string;
  history?: any;
  switchToVerifyEmail?: () => void;
  setDataRegister?: React.Dispatch<React.SetStateAction<RegisterDataProps | null>>;
  setApiError?: (err: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  redirectUrl: propRedirectUrl,
  history,
  switchToVerifyEmail,
  setDataRegister,
  setApiError
}) => {
  // Hooks
  const {t} = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = propRedirectUrl || searchParams.get("redirect") || "/";

  // State
  const [apiErrorState, setApiErrorState] = useState<string | null>(null);

  // Use the provided setApiError function if available, otherwise use the local state setter
  const handleApiError = useCallback((err: string) => {
      if (setApiError) {
        setApiError(err);
      } else {
        setApiErrorState(err);
      }
    },
    [setApiError]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaRes, setCaptchaRes] = useState<RequestState<GetCaptchaResponse>>(EMPTY_REQUEST);
  const [captchaUuid, setCaptchaUuid] = useState<string | undefined>();
  const [captchaPlaying, setCaptchaPlaying] = useState(false);
  const [siteRes, setSiteRes] = useState<GetSiteResponse | null>(null);
  const [hasFetchedSite, setHasFetchedSite] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isoDataRef = useRef(setIsoData(null));

  // Form setup
  const registerSchema = createRegisterSchema(t);
  const formMethods = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      role: RoleType.Employer,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: {isValid, errors, isSubmitting}
  } = formMethods;

  // Fetch captcha
  const fetchCaptcha = useCallback(async() => {
      setCaptchaRes(LOADING_REQUEST);
      const captchaResponse = await HttpService.client.getCaptcha();

      if (isSuccess(captchaResponse) && (
        captchaResponse.data.ok?.wav ||
        captchaResponse.data.ok?.png
      )) {
        setCaptchaRes(captchaResponse);
        setCaptchaUuid(captchaResponse.data.ok?.uuid);
        setValue("captchaAnswer",
          "");
      }
    },
    [setValue]);

  // Handle registration success
  const handleRegisterSuccess = useCallback(async(loginRes: LoginResponse, user: MyUserInfo) => {
      UserService.Instance.login({
        res: loginRes,
      });

      if (user) {
        try {
          const isoData = setIsoData(null);
          if (isoData) {
            isoData.myUserInfo = user;
          }
        } catch (error) {
          console.error("Error updating isoData:",
            error);
        }
      }

      if (redirectUrl) {
        router.replace(redirectUrl);
      } else {
        router.replace("/");
      }
    },
    [redirectUrl, router]);

  // Handle form submission
  const onSubmit = useCallback(async(data: any) => {
      // Store data in session storage
      sessionStorage.setItem("RegisterUpData",
        JSON.stringify(data));

      // If setDataRegister prop is provided, update the parent component's state
      if (setDataRegister) {
        setDataRegister({
          email: data.email,
          username: data.username,
          role: data.role
        });
      }

      const registerRes = await HttpService.client.register({
        username: data.username || "",
        email: data.email,
        password: data.password || "",
        passwordVerify: data.confirmPassword || "",
        captchaUuid: captchaUuid,
        captchaAnswer: data.captchaAnswer,
        role: data.role,
        acceptedApplication: data.termsAccepted && data.privacyAccepted,
        answer: "hello yuth"
      });

      switch (registerRes.state) {
        case REQUEST_STATE.FAILED: {
          handleApiError(registerRes.err.name);
          await fetchCaptcha();
          break;
        }
        case REQUEST_STATE.SUCCESS: {
          const loginData = registerRes.data;

          // Only log them in if a jwt was set
          if (loginData.jwt) {
            UserService.Instance.login({
              res: loginData,
            });

            const user = await HttpService.client.getMyUser();

            if (isSuccess(user) && user.data) {
              UserService.Instance.myUserInfo = user.data;
              await handleRegisterSuccess(loginData,
                user.data);
            }

            if (history) {
              history.replace("/communities");
            } else {
              router.replace("/communities");
            }
          } else {
            if (switchToVerifyEmail) {
              switchToVerifyEmail();
            }

            if (data.verifyEmailSent) {
              toast(("verifyEmailSent"));
            }

            if (data.registrationCreated) {
              toast("registrationApplicationSent");
            }

            if (history) {
              history.push("/");
            } else {
              router.push("/");
            }
          }
          break;
        }
      }
    },
    [captchaUuid, fetchCaptcha, handleRegisterSuccess, history, router, switchToVerifyEmail, setDataRegister]);

  // Handle captcha play
  const handleCaptchaPlay = useCallback(() => {
      if (isSuccess(captchaRes) && captchaRes.data.ok) {
        const captchaData = captchaRes.data.ok;

        if (!audioRef.current) {
          const base64 = `data:audio/wav;base64,${captchaData.wav}`;
          audioRef.current = new Audio(base64);
          audioRef.current.play();
          setCaptchaPlaying(true);

          audioRef.current.addEventListener("ended",
            () => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCaptchaPlaying(false);
              }
            });
        }
      }
    },
    [captchaRes]);

  // Handle captcha regeneration
  const handleRegenCaptcha = useCallback(async() => {
      audioRef.current = null;
      setCaptchaPlaying(false);
      await fetchCaptcha();
    },
    [fetchCaptcha]);

  // Get captcha PNG source
  const captchaPngSrc = useCallback((captcha: CaptchaResponse) => {
      return `data:image/png;base64,${captcha.png}`;
    },
    []);

  // Initial data loading
  useEffect(() => {
      const storedData = sessionStorage.getItem("RegisterData");

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (parsedData.email) {
          setValue("email",
            parsedData.email);
        }

        if (parsedData.termsAccepted) {
          setValue("termsAccepted",
            parsedData.termsAccepted);
        }

        if (parsedData.privacyAccepted) {
          setValue("privacyAccepted",
            parsedData.privacyAccepted);
        }
      }
    },
    [setValue]);

  // Fetch site data and captcha
  useEffect(() => {
      const getSiteData = async() => {
        if (hasFetchedSite) return;

        setHasFetchedSite(true);
        const site = await HttpService.client.getSite();

        if (isSuccess(site) && site.data) {
          setSiteRes(site.data);

          if (site.data?.siteView?.localSite?.captchaEnabled && isBrowser()) {
            await fetchCaptcha();
          }
        } else {
          handleApiError(t("authen.errorFetchingSiteData"));
        }
      };

      getSiteData();
    },
    [fetchCaptcha, hasFetchedSite]);

  // Cleanup audio on unmount
  useEffect(() => {
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    },
    []);

  // Render captcha
  const renderCaptcha = () => {
    if (captchaRes.state === "loading") {
      return (
        <div className="animate-pulse flex items-center justify-center py-4">
          <Spinner/>
        </div>
      );
    }

    if (captchaRes.state !== "success" || !captchaRes.data.ok) return null;

    const captcha = captchaRes.data.ok;

    return (
      <div className="border border-gray-300 rounded-lg p-4 space-y-3">
        <label
          htmlFor="register-captcha"
          className="block text-sm font-semibold text-gray-700"
        >
          {t("authen.enterCodeBelow")}
        </label>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* CAPTCHA Image */}
          <img
            src={captchaPngSrc(captcha)}
            alt="Captcha"
            className="rounded border w-full sm:w-[180px] h-[60px] object-contain"
          />

          {/* Buttons */}
          <div className="flex flex-row sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRegenCaptcha}
              className="inline-flex items-center px-2.5 py-1.5 border text-xs rounded-md text-gray-700 bg-white hover:bg-gray-100"
            >
              <RefreshCcw className="w-4 h-4 mr-1"/>
              {t("authen.refresh")}
            </button>

            {captcha.wav && (
              <button
                type="button"
                onClick={handleCaptchaPlay}
                className={`inline-flex items-center px-2.5 py-1.5 border text-xs rounded-md text-gray-700 bg-white hover:bg-gray-100 ${
                  captchaPlaying ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={captchaPlaying}
              >
                <Play className="w-4 h-4 mr-1"/>
                {captchaPlaying ? t("authen.playing") : t("authen.audio")}
              </button>
            )}
          </div>
        </div>

        {/* CAPTCHA Input */}
        <CustomInput
          label={t("authen.captchaLabel")}
          name="captchaAnswer"
          type="text"
          placeholder={t("authen.captchaPlaceholder")}
          error={errors.captchaAnswer?.message}
          register={register("captchaAnswer")}
        />
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {apiErrorState && (
        <p className="text-red-500 text-sm text-center mb-4">
          {t("authen.apiErrorState")}
        </p>
      )}

      {errors.root && (
        <p className="text-red-500 text-sm text-center mb-4">
          {errors.root.message}
        </p>
      )}

      <CustomInput
        label={t("authen.labelUsername")}
        name="username"
        error={errors.username?.message}
        placeholder={t("authen.placeholderUsername")}
        type="text"
        register={register("username")}
      />

      <CustomInput
        label={t("authen.labelEmail")}
        type="email"
        name={"email"}
        placeholder={t("authen.placeholderEmail")}
        register={register("email")}
        error={errors.email?.message}
      />

      <CustomInput
        label={t("authen.labelPassword")}
        name="password"
        type="password"
        error={errors.password?.message}
        placeholder={t("authen.placeholderPassword")}
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword(!showPassword)}
        register={register("password")}
      />

      <CustomInput
        label={t("authen.labelConfirmPassword")}
        name="confirmPassword"
        type="password"
        placeholder={t("authen.placeholderConfirmPassword")}
        showPassword={showConfirmPassword}
        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        error={errors.confirmPassword?.message}
        register={register("confirmPassword")}
      />

      <div className="space-y-2 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("authen.roleSelectionLabel")}
        </label>

        <div className="flex gap-4 text-sm font-medium w-full max-w-md">
          {[RoleType.Employer, RoleType.Freelancer].map((option) => (
            <label key={option} className="flex-1 relative">
              <input
                type="radio"
                value={option}
                {...register("role",
                  {required: true})}
                className="peer hidden"
              />
              <div
                className={classNames(
                  "peer-checked:bg-primary peer-checked:text-white",
                  "bg-white text-gray-600 border border-gray-300",
                  "hover:border-primary hover:text-primary",
                  "rounded-md text-center",
                  "h-10 flex items-center justify-center",
                  "transition-all duration-200 cursor-pointer"
                )}
              >
                {option}
              </div>
            </label>
          ))}
        </div>
      </div>

      {renderCaptcha()}

      <div className="space-y-4 text-gray-700">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="termsAccepted"
            className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary"
            {...register("termsAccepted")}
          />
          <label
            htmlFor="termsAccepted"
            className="text-sm text-text-secondary font-sans"
          >
            {t("authen.checkboxTermsConditions")}{" "}
            <Link
              prefetch={false}
              href="/content/terms"
              className="text-text-secondary underline"
            >
              {t("authen.checkboxTermsConditionsRedirect")}
            </Link>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="privacyAccepted"
            className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary"
            {...register("privacyAccepted")}
          />
          <label
            htmlFor="privacyAccepted"
            className="text-sm text-text-secondary font-sans"
          >
            {t("authen.checkboxTermsConditions")}{" "}
            <Link
              prefetch={false}
              href="/content/privacy"
              className="text-text-secondary underline"
            >
              {t("authen.checkboxPrivacyPolicyRedirect")}
            </Link>
          </label>
        </div>
      </div>

      {apiErrorState && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
          {apiErrorState}
        </div>
      )}

      <div className="text-center">
        <button
          type="submit"
          className="submit-button py-3"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? <LoadingCircle/> : t("authen.linkCreateAccount")}
        </button>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <div className="text-center text-sm text-gray-500">
          {t("authen.signUpWithSocial")}
        </div>
      </div>
    </form>
  );
};