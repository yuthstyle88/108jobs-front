"use client";
import {HttpService, UserService,} from "@/services";
import React, {useCallback, useEffect, useState} from "react";

import {CustomInput} from "@/components/ui/InputField";
import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {REQUEST_STATE} from "@/services/HttpService";
import LoadingCircle from "@/components/LoadingCircle";
import useNotification from "@/hooks/useNotification";

interface VerifyOTPProps {
    switchToVerifyEmail?: () => void;
    setApiError?: (err: string) => void;
    email: string;
}

const createOTPSchema = (t: any) => z
    .object({
        code: z.string().min(5, t("authen.invalidOTP")),
    });

export const VerifyOTPForm: React.FC<VerifyOTPProps> = ({
                                                            setApiError,
                                                            email
                                                        }) => {
    // Hooks
    const {t} = useTranslation();
    // State
    const [apiErrorState, setApiErrorState] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(30);
    const [isResending, setIsResending] = useState(false);
    const {successMessage, errorMessage} = useNotification();

    const handleResendEmail = useCallback(async () => {
        setIsResending(true);
        try {
            const resendRes = await HttpService.client.resendVerificationEmail({
                email: email
            });
            if (resendRes.state === REQUEST_STATE.SUCCESS) {
                successMessage(null, null, t("authen.resendOTPSuccess") ?? "Success!");
                setResendCooldown(30);
            }
        } catch (error) {
            errorMessage(null, null, t("authen.resendFailed") ?? "Submission failed!");
        } finally {
            setIsResending(false);
        }
    }, [t]);

    useEffect(() => {
        if (resendCooldown <= 0) return;

        const timer = setInterval(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleApiError = useCallback((err: string) => {
            if (setApiError) {
                setApiError(err);
            } else {
                setApiErrorState(err);
            }
        },
        [setApiError]);
    // Form setup
    const otpSchema = createOTPSchema(t);
    const formMethods = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        mode: "onChange",
        criteriaMode: "all",
    });
    const {
        register,
        handleSubmit,
        formState: {isValid, errors, isSubmitting}
    } = formMethods;
    const onSubmit = useCallback(async (data: any) => {

            const verifyRes = await HttpService.client.verifyEmail({
                code: data.code,
            });
            switch (verifyRes.state) {
                case REQUEST_STATE.FAILED: {
                    setApiErrorState(t(`authen.${verifyRes.err.name}`));
                    break;
                }
                case REQUEST_STATE.SUCCESS: {
                    UserService.Instance.login({
                        res: verifyRes.data,
                    });
                }
                    break;
            }
        },
        []);
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {apiErrorState && (
                <p className="text-red-500 text-sm text-center mb-4">
                    {apiErrorState}
                </p>
            )}
            {errors.root && (
                <p className="text-red-500 text-sm text-center mb-4">
                    {errors.root.message}
                </p>
            )}
            <CustomInput
                label={t("authen.labelOTP")}
                type="string"
                name={"code"}
                placeholder={t("authen.placeholderOTP")}
                register={register("code")}
                error={errors.code?.message}
            />

            <div className="text-center">
                <button
                    type="submit"
                    className="submit-button py-3"
                    disabled={!isValid || isSubmitting}
                >
                    {isSubmitting ? <LoadingCircle/> : t("authen.btnVerifyOTP")}
                </button>
            </div>
            <div className="text-center mt-4">
                <button
                    type="button"
                    className={`text-blue-500 hover:text-blue-700 text-sm ${
                        resendCooldown > 0 || isResending ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleResendEmail}
                    disabled={resendCooldown > 0 || isResending}
                >
                    {isResending ? (
                        <LoadingCircle/>
                    ) : resendCooldown > 0 ? (
                        `${t("authen.resendOTP")} (${resendCooldown}s)`
                    ) : (
                        t("authen.resendOTP")
                    )}
                </button>
            </div>

        </form>
    );
};
