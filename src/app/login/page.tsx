// app/login/page.tsx
"use client";
import { AuthFormContainer } from "@/components/Login/AuthFormContainer";
import { ForgotPasswordForm } from "@/components/Login/ForgotPasswordForm";
import { LoginForm } from "@/components/Login/LoginForm";
import { RegisterForm } from "@/components/Login/RegisterForm";
import VerificationEmail from "@/components/Login/VerifyEmail";
import { CategoriesIcon } from "@/constants/icons";
import { CategoriesImage } from "@/constants/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
type ViewState = "login" | "register" | "forgot-password" | "verify-email";

export default function LoginPage() {
  const [currentView, setCurrentView] = useState<ViewState>("login");

  const [verifyEmail, setVerifyEmail] = useState("");

  const route = useRouter();

  return (
    <div className="min-h-screen bg-[#E3EDFD] flex items-center justify-center">
      <div className="flex flex-row gap-[5rem] items-center">
        <div className="mx-auto flex flex-col gap-[4rem]">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-row items-center">
              <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                จ้างผ่าน
              </h2>
              <Image src={CategoriesImage.logodefault} alt="logo" />
            </div>
            <div className="flex gap-2 flex-row items-center">
              <h2 className="text-[2.5rem] text-[hsl(215,15%,20%,0.95)]">
                เงินปลอดภัย ได้งานชัวร์
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
                src={CategoriesIcon.architect}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                รับประกันเงินจ้าง
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={CategoriesIcon.architect}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                มีใบประกอบวิชาชีพ
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={CategoriesIcon.architect}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                ผิดเงื่อนไข ยินดีคืนเงิน
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={CategoriesIcon.architect}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                ให้คำแนะนำตลอดการจ้าง
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Image
                src={CategoriesIcon.architect}
                alt="advantage"
                className="h-[48px] w-[48px]"
              />
              <span className="font-sans text-[20px] font-medium leading-[23px] text-[rgba(43,50,59,0.95)]">
                ฟรีแลนซ์ผ่านการตรวจสอบ
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {currentView === "login" && (
            <AuthFormContainer title="เข้าสู่ระบบ / สร้างบัญชี">
              <LoginForm
                switchToRegister={() => setCurrentView("register")}
                switchToForgotPassword={() => setCurrentView("forgot-password")}
              />
            </AuthFormContainer>
          )}

          {currentView === "register" && (
            <AuthFormContainer
              title="สร้างบัญชี Fastwork"
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
              title="ลืมรหัสผ่าน"
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
