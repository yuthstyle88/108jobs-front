"use client";

import { ERROR_CONSTANTS } from "@/constants/error";
import { useEffect, useState } from "react";

const ResendButton = ({ email }: { email?: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0 && error) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown, error]);

  const handleResend = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/resend-verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || ERROR_CONSTANTS.RESEND_FAILED);
        return;
      }
      setCountdown(60);
    } catch (error) {
      console.log("Error", error);
      
      setError(ERROR_CONSTANTS.SERVER_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 text-center">
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      {/* {success && (
        <div className="text-green-600 text-sm mb-2">
          {ERROR_CONSTANTS.RESEND_SUCCESS}
        </div>
      )} */}

      <button
        onClick={handleResend}
        disabled={isLoading || countdown > 0}
        className={`text-sm ${
          countdown > 0 || isLoading
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-600 hover:underline"
        }`}
      >
        {isLoading
          ? "Đang gửi..."
          : countdown > 0
          ? `Gửi lại sau (${countdown}s)`
          : "Gửi lại email xác thực"}
      </button>
    </div>
  );
};

export default ResendButton;
