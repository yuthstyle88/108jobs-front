"use client";
import Loading from "@/components/Loading";
import { AuthFormContainer } from "@/components/Authentication/AuthFormContainer";
import { LoginForm } from "@/components/Authentication/SignInForm";
import { AuthenticateIcon } from "@/constants/icons";
import { CategoriesImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {ForgotPasswordForm} from "@/components/Authentication/ForgotPasswordForm";
import {SignUpDataProps} from "@/types/sign-up-data";

type ViewState =
  | "signIn"
  | "forgot-password"
  | "verify-forgot-password";

export default function LoginPage() {
  const {
    data: signInLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.AUTHEN);

  const params = useSearchParams();
  const viewParam = params.get("view") as ViewState | null;

  // Set currentView from viewParam only once on mount
  useEffect(() => {
    if (viewParam) {
      setCurrentView(viewParam);
    }
  }, []);

  const [currentView, setCurrentView] = useState<ViewState>("signIn");

  const [forgotEmail, setForgotEmail] = useState<SignUpDataProps>();
  // Load singUpData from sessionStorage if available, only on client
  console.log("🧭 currentView:", currentView);
  const route = useRouter();



  // if (isLoading) return <Loading />;
  if (error) return <div>Error</div>;

  return (
    <div className="min-h-screen bg-[#E3EDFD] grid 2xl:grid-cols-[1fr_1240px_1fr] lg:grid-cols-[1fr_984px_1fr] md:grid-cols-[1fr_768px_1fr] grid-cols-[12px_minmax(0,auto)_12px]">
      <div className="flex justify-center items-center lg:flex-row lg:gap-[3rem] lg:justify-between col-start-2 col-end-3">
        <div className="hidden lg:flex m-auto flex-col gap-[4rem]">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-row items-center">
              <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                {signInLanguageData?.title_hire_through}
              </h2>
              <Image src={CategoriesImage.logodefault} alt="logo" />
            </div>
            <div className="flex gap-2 flex-row items-center">
              <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                {signInLanguageData?.subtitle_safe_money}
              </h2>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Image
              src={CategoriesImage.conceptbanner}
              alt="concept banner"
              className="h-[164px]"
            />
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage_1}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {signInLanguageData?.label_guaranteed_pay}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage_2}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {signInLanguageData?.label_professional_license}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage_3}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {signInLanguageData?.label_refund_policy}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage_4}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {signInLanguageData?.label_hiring_advice}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage_5}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {signInLanguageData?.label_freelancer_verified}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 justify-center items-center py-[4rem] max-w-[500px] w-full h-full ">
          <Image
            className="lg:hidden block"
            src={CategoriesImage.logodefault}
            alt="logo"
          />
          {currentView === "signIn" && (
            <AuthFormContainer
              title={signInLanguageData?.title_sign_in_create_account}
            >
              <LoginForm
                switchToSingUp={() => route.push("/sign-up")}
                switchToForgotPassword={() => setCurrentView("forgot-password")}
              />
            </AuthFormContainer>
          )}
          {currentView === "forgot-password" && (
            <AuthFormContainer
              title={signInLanguageData?.link_forgot_password}
              onBack={() => setCurrentView("signIn")}
            >
              <ForgotPasswordForm
                setForgotEmail={setForgotEmail}
                switchToVerifyForgotPassword={() =>
                  setCurrentView("verify-forgot-password")
                }
              />
            </AuthFormContainer>
          )}
        </div>
      </div>
    </div>
  );
}
