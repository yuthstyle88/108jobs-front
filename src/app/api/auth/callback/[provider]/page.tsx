"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner"; // หรือไลบรารีที่คุณใช้สำหรับ toast notifications

import { HttpService } from "@/services/HttpService";
import { UserService } from "@/services";
import {arrayBufferToHex, exportPublicKey, generateEcKeyPair, importEcPublicKeyHex, uint8ArrayToHex} from "@/lib/web-crypto";
import { getNamespace } from "@/utils/i18nHelper";
import { LanguageFile } from "@/constants/language";

// ฟังก์ชันสำหรับดึงค่า query parameters
function useOAuthCallbackQueryParams() {
  const searchParams = useSearchParams();
  return {
    code: searchParams.get("code") || undefined,
    state: searchParams.get("state") || undefined,
  };
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { code, state } = useOAuthCallbackQueryParams();
  const authLanguage = getNamespace(LanguageFile.NOTIFICATION);

  useEffect(() => {
    console.log("EEEE loginRes:",);
    async function handleOAuth() {
      try {
        // ดึงข้อมูล state จาก localStorage
        const localOAuthState = JSON.parse(
          localStorage.getItem("oauthState") || "{}"
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
          toast.error(authLanguage.oauthVerificationFailed);
          router.replace("/login");
          return;
        }

        // เรียก API เพื่อยืนยันตัวตนด้วย OAuth
        const loginRes = await HttpService.client.authenticateWithOAuth({
          code,
          oauthProviderId: localOAuthState.oauthProviderId,
          redirectUri: localOAuthState.redirectUri,
          answer: localOAuthState.answer,
        });
        console.log("loginRes:", loginRes);
        if (loginRes.state === "success") {

          if (loginRes.data.jwt) {
            // Login สำเร็จ
            await handleLoginSuccess(loginRes.data, localOAuthState.prev);
          } else {
            // ไม่มี JWT แต่มีการตอบกลับอื่นๆ
            if (loginRes.data.verifyEmailSent) {
              toast.info(authLanguage.verificationEmailSent);
            }
            if (loginRes.data.registrationCreated) {
              toast.info(authLanguage.registrationRequestSubmitted);
            }
            router.push("/login");
            return
          }
        } else if (loginRes.state === "failed") {
          // จัดการกับข้อผิดพลาด
          let errRedirect = "/login";

          switch (loginRes.err.message) {
            case "registrationUsernameRequired":
            case "registrationApplicationAnswerRequired":
              errRedirect = `/signup?ssoProviderId=${localOAuthState.oauthProviderId}`;
              toast.error(loginRes.err.message);
              break;
            case "registrationApplicationIsPending":
              toast.error(authLanguage.registrationRequestProcessing);
              break;
            case "registrationDenied":
            case "oauthAuthorizationInvalid":
            case "oauthLoginFailed":
            case "oauthRegistrationClosed":
            case "emailAlreadyExists":
            case "usernameAlreadyExists":
            case "noEmailSetup":
              toast.error(loginRes.err.message);
              break;
            default:
              toast.error(authLanguage.invalidLoginOccurred);
              break;
          }

          router.push(errRedirect);
        }
      } catch (error) {
        console.error("OAuth error:", error);
        toast.error(authLanguage.loginError);
        router.replace("/login");
      }
    }

   handleOAuth().then(r => console.log("login success"));
  }, [code, state, router]);

  return true
}

// ฟังก์ชันช่วยจัดการการเข้าสู่ระบบที่สำเร็จ
async function handleLoginSuccess(loginData: any, prev?: string) {
  try {
    console.log("Login success handler called with data:", loginData);
    UserService.Instance.login({
      res: loginData,
    });

    const {privateKey, publicKey} = await generateEcKeyPair();
    const exportPub = await exportPublicKey(publicKey);
    const res = await HttpService.client.exchange_public_key({publicKey: exportPub});
    if (res.state === "success") {
      const serverPubKey = await importEcPublicKeyHex(res.data.publicKey);
      const sharedKey = await crypto.subtle.deriveBits(
        { name: "ECDH", public: serverPubKey },
        privateKey,
        256
      );
      const sharedKeyHex = arrayBufferToHex(sharedKey);

      UserService.Instance.login({
        res: loginData,
        sharedKey: sharedKeyHex
      });
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