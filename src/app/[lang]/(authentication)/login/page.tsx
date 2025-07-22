"use client";
import Loading from "@/components/Loading";
import { AuthFormContainer } from "@/components/Authentication/AuthFormContainer";
import { LoginForm } from "@/components/Authentication/LoginForm";
import { AuthenticateIcon } from "@/constants/icons";
import { CategoriesImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ForgotPasswordForm } from "@/components/Authentication/ForgotPasswordForm";
import { RegisterDataProps } from "@/types/register-data";

type ViewState = "login" | "forgot-password";

export default function LoginPage() {
  const {
    data: loginLanguageData,
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

  const [currentView, setCurrentView] = useState<ViewState>("login");

  const [forgotEmail, setForgotEmail] = useState<RegisterDataProps>();
    const [tokenPassword, setTokenPassword] = useState<string>();
  // Load singUpData from sessionStorage if available, only on client
  console.log("🧭 currentView:", currentView);
  const route = useRouter();

  if (isLoading) return <Loading />;
  if (error) return <div>Error</div>;

  return (
    <div className="min-h-screen bg-[#E3EDFD] grid 2xl:grid-cols-[1fr_1240px_1fr] lg:grid-cols-[1fr_984px_1fr] md:grid-cols-[1fr_768px_1fr] grid-cols-[12px_minmax(0,auto)12px]">
      <div className="flex justify-center items-center lg:flex-row lg:gap-[3rem] lg:justify-between col-start-2 col-end-3">
        <div className="hidden lg:flex m-auto flex-col gap-[4rem]">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-row items-center">
              <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                {loginLanguageData?.titleHireThrough}
              </h2>
              <Image src={CategoriesImage.logodefault} alt="logo" />
            </div>
            <div className="flex gap-2 flex-row items-center">
              <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                {loginLanguageData?.subtitleSafeMoney}
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
                src={AuthenticateIcon.advantage1}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.labelGuaranteedPay}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage2}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.labelProfessionalLicense}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage3}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.labelRefundPolicy}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage4}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.labelHiringAdvice}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage5}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.labelFreelancerVerified}
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
          {currentView === "login" && (
            <AuthFormContainer title="Sign in FastJob">
              <LoginForm
                switchToRegister={() => route.push("/register")}
                switchToForgotPassword={() => setCurrentView("forgot-password")}
              />
            </AuthFormContainer>
          )}
          {currentView === "forgot-password" && (
            <AuthFormContainer
              title={loginLanguageData?.linkForgotPassword}
              onBack={() => setCurrentView("login")}
            >
              <ForgotPasswordForm
                setForgotEmail={setForgotEmail}
                switchToVerifyForgotPassword={() =>
                  setCurrentView("forgot-password")
                }
              />
            </AuthFormContainer>
          )}
        </div>
      </div>
    </div>
  );
}
