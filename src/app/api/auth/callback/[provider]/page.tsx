"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner"; // หรือไลบรารีที่คุณใช้สำหรับ toast notifications

import { HttpService } from "@/services/HttpService";
import { UserService } from "@/services";

// ฟังก์ชันสำหรับดึงค่า query parameters
function getOAuthCallbackQueryParams() {
  const searchParams = useSearchParams();
  return {
    code: searchParams.get("code") || undefined,
    state: searchParams.get("state") || undefined,
  };
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { code, state } = getOAuthCallbackQueryParams();

  useEffect(() => {
    async function handleOAuth() {
      try {
        // ดึงข้อมูล state จาก localStorage
        const localOAuthState = JSON.parse(
          localStorage.getItem("oauth_state") || "{}"
        );

        // ตรวจสอบความถูกต้องของ OAuth state
        if (
          !(
            state &&
            code &&
            localOAuthState?.state &&
            localOAuthState?.oauthProviderId &&
            localOAuthState?.expiresAt &&
            state === localOAuthState.state
          ) ||
          localOAuthState.expiresAt < Date.now()
        ) {
          // OAuth ล้มเหลวหรือหมดอายุ
          toast.error("การตรวจสอบ OAuth ไม่ถูกต้อง");
          router.replace("/login");
          return;
        }

        // เรียก API เพื่อยืนยันตัวตนด้วย OAuth
        const loginRes = await HttpService.client.authenticateWithOAuth({
          code,
          oauthProviderId: localOAuthState.oauthProviderId,
          redirectUri: localOAuthState.redirectUri,
          name: localOAuthState.name,
          email: localOAuthState.email,
          answer: localOAuthState.answer,
        });

        if (loginRes.state === "success") {
          if (loginRes.data.jwt) {
            // Login สำเร็จ
            await handleLoginSuccess(loginRes.data, localOAuthState.prev);
          } else {
            // ไม่มี JWT แต่มีการตอบกลับอื่นๆ
            if (loginRes.data.verifyEmailSent) {
              toast.info("อีเมลยืนยันตัวตนถูกส่งแล้ว");
            }
            if (loginRes.data.registrationCreated) {
              toast.info("ส่งคำขอลงทะเบียนแล้ว");
            }
            router.push("/login");
          }
        } else if (loginRes.state === "failed") {
          // จัดการกับข้อผิดพลาด
          let errRedirect = "/login";

          switch (loginRes.err.message) {
            case "registration_username_required":
            case "registration_application_answer_required":
              errRedirect = `/signup?sso_provider_id=${localOAuthState.oauthProviderId}`;
              toast.error(loginRes.err.message);
              break;
            case "registration_application_is_pending":
              toast.error("คำขอลงทะเบียนของคุณอยู่ระหว่างดำเนินการ");
              break;
            case "registration_denied":
            case "oauth_authorization_invalid":
            case "oauth_login_failed":
            case "oauth_registration_closed":
            case "email_already_exists":
            case "username_already_exists":
            case "no_email_setup":
              toast.error(loginRes.err.message);
              break;
            default:
              toast.error("การเข้าสู่ระบบไม่ถูกต้อง");
              break;
          }

          router.push(errRedirect);
        }
      } catch (error) {
        console.error("OAuth error:", error);
        toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        router.replace("/login");
      }
    }

   handleOAuth().then(r => console.log("login success"));
  }, [code, state, router]);

  return (
    <div className="container mx-auto flex justify-center items-center min-h-[50vh]">
      <div className="text-center">กำลังเข้าสู่ระบบ...</div>
    </div>
  );
}

// ฟังก์ชันช่วยจัดการการเข้าสู่ระบบที่สำเร็จ
async function handleLoginSuccess(loginData: any, prev?: string) {
  try {
    // บันทึกข้อมูลการเข้าสู่ระบบ
    UserService.Instance.login({
      res: loginData,
    });

    // ดึงข้อมูลไซต์หลังจากเข้าสู่ระบบ
    const site = await HttpService.client.getSite();

    if (site.state === "success") {
      UserService.Instance.myUserInfo = site.data.my_user;

      // อาจต้องเรียกใช้ฟังก์ชันอัพเดทธีม หรือตั้งค่าอื่นๆ ตามต้องการ
      // refreshTheme();
    }

    if (prev) {
      window.location.href = prev;
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }

    // อัปเดตข้อมูลการแจ้งเตือนและข้อความที่ยังไม่ได้อ่าน (ถ้ามี)
    // UnreadCounterService.Instance.updateAll();
  } catch (error) {
    console.error("Login success handler error:", error);
    // ถ้าเกิดข้อผิดพลาด นำทางไปยังหน้าหลัก
    window.location.href = "/";
  }
}