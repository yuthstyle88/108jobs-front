// app/login/page.tsx
"use client";
import Loading from "@/components/Loading";
import { AuthFormContainer } from "@/components/Login/AuthFormContainer";
import { ForgotPasswordForm } from "@/components/Login/ForgotPasswordForm";
import { LoginForm } from "@/components/Login/LoginForm";
import { RegisterForm } from "@/components/Login/RegisterForm";
import VerificationEmail from "@/components/Login/VerifyEmail";
import { AuthenticateIcon } from "@/constants/icons";
import { CategoriesImage } from "@/constants/images";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { useLanguageStore } from "@/store/useLanguageStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ViewState = "login" | "register" | "forgot-password" | "verify-email";

export default function LoginPage() {
  const { isLoading, error } = useGlobalTranslate("login");
  const { loginLanguageData } = useLanguageStore();

  const [currentView, setCurrentView] = useState<ViewState>("login");

  const [verifyEmail, setVerifyEmail] = useState("");

  const route = useRouter();

  if (isLoading) return <Loading />;
  if (error) return <div>Error</div>;
  
  return (
    <div className="min-h-screen bg-[#E3EDFD] flex items-center justify-center">
      <div className="flex flex-row gap-[5rem] items-center">
        <div className="mx-auto flex flex-col gap-[4rem]">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-row items-center">
              <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                {loginLanguageData?.title_hire_through}
              </h2>
              <Image src={CategoriesImage.logodefault} alt="logo" />
            </div>
            <div className="flex gap-2 flex-row items-center">
              <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                {loginLanguageData?.subtitle_safe_money}
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
                {loginLanguageData?.label_guaranteed_pay}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage_2}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.label_professional_license}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage_3}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.label_refund_policy}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage_4}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.label_hiring_advice}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={AuthenticateIcon.advantage_5}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                {loginLanguageData?.label_freelancer_verified}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {currentView === "login" && (
            <AuthFormContainer title={loginLanguageData?.title_login_create_account}>
              <LoginForm
                switchToRegister={() => setCurrentView("register")}
                switchToForgotPassword={() => setCurrentView("forgot-password")}
              />
            </AuthFormContainer>
          )}

          {currentView === "register" && (
            <AuthFormContainer
              title={`${loginLanguageData?.link_create_account} Fastwork`}
              onBack={() => setCurrentView("login")}
            >
              <RegisterForm
                switchToVerifyEmail={() => setCurrentView("verify-email")}
                onBack={() => setCurrentView("login")}
                setVerifyEmail={setVerifyEmail}
              />
            </AuthFormContainer>
          )}

          {currentView === "forgot-password" && (
            <AuthFormContainer
              title={loginLanguageData?.link_forgot_password}
              onBack={() => setCurrentView("login")}
            >
              <ForgotPasswordForm />
            </AuthFormContainer>
          )}

          {currentView === "verify-email" && (
            <AuthFormContainer
              title="ยืนยันอีเมล"
              onBack={() => setCurrentView("register")}
            >
              <VerificationEmail
                onVerifySuccess={() => {
                  route.push("/");
                }}
                verifyEmail={verifyEmail}
              />
            </AuthFormContainer>
          )}
        </div>
      </div>
    </div>
  );
}
