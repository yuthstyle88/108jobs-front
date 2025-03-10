import { ERROR_CONSTANTS } from "@/constants/error";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
interface VerificationEmailProps {
  verifyEmail?: string;
  resendDelay?: number;
  onBack?: () => void;
  onVerifySuccess?: () => void;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({
  verifyEmail,
  resendDelay = 60,
}) => {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(resendDelay);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const resetCode = () => {
    setCode(Array(6).fill(""));
    inputRefs.current[0]?.focus();
  };

  useEffect(() => {
    if (!isResendDisabled) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isResendDisabled]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setCodeError(null);
    setApiError(null);
    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
      setCodeError(ERROR_CONSTANTS.INVALID_CODE);
      resetCode();
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verifyEmail,
          code: enteredCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fieldErrors?.code) {
          setCodeError(data.fieldErrors.code);
        } else if (data.error) {
          setApiError(data.error);
        } else {
          setApiError("การยืนยันอีเมลไม่สำเร็จ");
        }
        resetCode();
        return;
      }

      if (data.jwt) {
        const loginResponse = await fetch("/api/auth/token-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: data.jwt }),
        });
  
        if (loginResponse.ok) {
          window.location.href = "/dashboard";
        } else {
          setApiError("Đăng nhập tự động thất bại");
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      setApiError(ERROR_CONSTANTS.SERVER_ERROR);
      resetCode();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (isResendDisabled) return;

    try {
      setTimeLeft(resendDelay);
      setIsResendDisabled(true);
    } catch (error) {
      setApiError(ERROR_CONSTANTS.SERVER_ERROR);
    }
  };

  return (
    <div className="text-center max-w-md mx-auto">
      <p className="text-gray-700 mb-2 text-sm">
        รหัสยืนยันถูกส่งไปที่อีเมล {verifyEmail}
      </p>
      <p className="text-gray-700 mb-1 text-sm">
        กรุณากรอกรหัสเพื่อเปิดใช้บัญชี (หากไม่พบโปรดตรวจ
      </p>
      <p className="text-gray-700 mb-4 text-sm">สอบกล่องอีเมล Spam และ Junk)</p>

      <div className="flex justify-center gap-2 mb-4">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            value={code[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !code[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
              }
            }}
            className={`text-text_primary w-12 h-12 text-center border rounded ${
              codeError ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-blue-500`}
            maxLength={1}
            disabled={isSubmitting}
            autoFocus={index === 0}
          />
        ))}
      </div>

      {codeError && (
        <div className="text-red-600 text-sm mb-4">{codeError}</div>
      )}

      <button
        onClick={handleVerify}
        className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition duration-300 ${
          isSubmitting || code.join("").length !== 6 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={code.join("").length !== 6 || isSubmitting}
      >
        {isSubmitting ? "กำลังยืนยัน..." : "ยืนยันอีเมล"}
      </button>

      {apiError && (
        <div className="p-3 bg-red-100 text-red-700 rounded text-sm mt-4">
          {apiError}
        </div>
      )}

      <button
        onClick={handleResend}
        disabled={isResendDisabled}
        className={`text-gray-500 text-sm mt-4 hover:text-blue-600 transition-colors ${
          isResendDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        ส่งอีกครั้ง {isResendDisabled ? `(${timeLeft})` : ""}
      </button>
    </div>
  );
};

export default VerificationEmail;