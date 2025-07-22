import React, {useState} from "react";
import {HttpService} from "@/services";

interface VerificationForgotPasswordProps {
    onVerifySuccess: () => void;
    forgotEmail: string;
    setTokenPassword: (token: string) => void;
    switchToChangePassword: () => void;
}

const VerificationForgotPassword: React.FC<VerificationForgotPasswordProps> = (
    {
        onVerifySuccess,
        forgotEmail,
        setTokenPassword,
        switchToChangePassword,
    }) => {
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setError(null);
        if (code.length !== 6) {
            setError("Verification code must be 6 digits.");
            return;
        }

        try {
            setLoading(true);
            const response = await HttpService.client.verifyForgotPassword({
                email: forgotEmail,
                token: code,
            });

            if (response.state === "success" && response.data?.token) {
                setTokenPassword(response.data.token);
                onVerifySuccess();
                switchToChangePassword();
            } else {
                setError("Invalid or expired verification code.");
            }
        } catch (err) {
            console.error(err);
            setError("Server error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto text-center">
            <h2 className="text-lg font-semibold mb-4">Verify Email</h2>
            <p className="mb-2">We have sent a verification code to:</p>
            <p className="mb-4 font-mono">{forgotEmail}</p>
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="border p-2 w-full text-center mb-4"
                placeholder="Enter 6-digit code"
                disabled={loading}
            />
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <button
                onClick={handleVerify}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Verifying..." : "Verify"}
            </button>
        </div>
    );
};

export default VerificationForgotPassword;