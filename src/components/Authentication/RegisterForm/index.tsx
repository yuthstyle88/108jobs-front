"use client";
import LoadingCircle from "@/components/LoadingCircle";
import {CustomInput} from "@/components/ui/InputField";
import {LanguageFile} from "@/constants/language";
import {useTranslateFile} from "@/hooks/translation/useTranslateFile";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter, useSearchParams} from "next/navigation";
import React, {Component, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {
    CaptchaResponse,
    GetCaptchaResponse,
    GetSiteResponse,
    LoginResponse,
} from "lemmy-js-client";

import {
    EMPTY_REQUEST,
    HttpService, LOADING_REQUEST,
    RequestState,
} from "@/services/HttpService";
import {IsoData} from "@/interfaces";
import {toast} from "@/toast";
import {UserService} from "@/services";
import {setIsoData} from "@/utils/app";
import { isBrowser } from "@/utils/browser";
import classNames from "classnames";
import Link from "next/link";
import {Spinner} from "@/components/icon";
import {Play, RefreshCcw} from "lucide-react";


interface RegisterFormProps {
    formState: {
        username: string;
        password: string;
    };
    setFormState: React.Dispatch<
      React.SetStateAction<{
          username: string;
          password: string;
      }>
    >;
    redirectUrl: string;
    router: any;
    authen: any;
    formMethods: any;
    registerSchema: any;
    apiError: string | null;
    setApiError: (value: string | null) => void;
    history: any;
}

interface RegisterFormState {
    registerRes: RequestState<LoginResponse>;
    captchaRes: RequestState<GetCaptchaResponse>;
    showPassword: boolean;
    showConfirmPassword: boolean;
    apiError: string | null;
    form: {
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        privacyAccepted: boolean;
        termsAccepted: boolean;
        captchaUuid?: string;
        captchaAnswer?: string;
        answer?: string;
        role: "Employer" | "Freelancer";
    };
    captchaPlaying: boolean;
    siteRes: GetSiteResponse | null;
    isSubmitting: boolean;
    hasFetchedSite: boolean;
    isValid: boolean;
    errors: {
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        termsAccepted?: string;
        privacyAccepted?: string;
        captchaAnswer?: string;
    };
}


async function handleRegisterSuccess(i: RegisterFormClass, loginRes: LoginResponse, site: RequestState<GetSiteResponse>) {
    UserService.Instance.login({
        res: loginRes,
    });

    if (site.state === "success") {
        try {
            const isoData = setIsoData(i.context);
            if (isoData && isoData.siteRes) {
                isoData.siteRes.oauthProviders = site.data.oauthProviders;
                isoData.siteRes.adminOauthProviders = site.data.adminOauthProviders;
            }
        } catch (error) {
            console.error("Error updating isoData:", error);
        }
    }

    // ใช้ redirectUrl จาก props แทน prev
    const {redirectUrl} = i.props;

    // ใช้ router จาก props แทน history
    if (redirectUrl) {
        i.props.router.replace(redirectUrl);
    } else {
        i.props.router.replace("/");
    }
}

const withHooks = (Component: any) => {
    const WrappedWithHooks = (props: any) => {
        const authen = useTranslateFile(LanguageFile.AUTHEN);
        const router = useRouter();
        const searchParams = useSearchParams();
        const redirectUrl = searchParams.get("redirect") || "/";

        const registerSchema = z
        .object({
            email: z.string().email(authen?.invalidEmail),
            username: z.string().min(6,authen?.usernameMin6),
            password: z.string().min(6, authen?.passwordMin6),
            confirmPassword: z.string(),
            termsAccepted: z.boolean().refine((val) => val === true),
            privacyAccepted: z.boolean().refine((val) => val === true),
            captchaAnswer: z.string().min(4, authen?.requireCaptcha),
            role: z.enum(["Employer", "Freelancer"]).default("Employer"),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: authen?.notMatchPassword,
            path: ["confirmPassword"],
        });

        const formMethods = useForm<z.infer<typeof registerSchema>>({
            resolver: zodResolver(registerSchema),
            mode: "onChange",
            criteriaMode: "all",
        });

        const {
            register,
            handleSubmit,
            getValues,
            formState: { isValid, errors },
        } = formMethods;

        const { formState } = formMethods;
        const watch = formMethods.watch;
        // ✅ เพิ่ม useEffect นี้เพื่อตรวจสอบค่า isValid และ errors
        useEffect(() => {
            const values = getValues();
            console.log("📌 isValid:", isValid);
            console.log("📌 errors:", errors);
            console.log("📌 password:", values.password);
            console.log("📌 confirmPassword:", values.confirmPassword);
            console.log("📌 captchaAnswer:", values.captchaAnswer);
        }, [watch(), isValid, errors]);

        const [apiError, setApiError] = useState<string | null>(null);

        return (
            <Component
                {...props}
                authen={authen}
                register={register}
                router={router}
                redirectUrl={redirectUrl}
                formMethods={formMethods}
                registerSchema={registerSchema}
                apiError={apiError}
                setApiError={setApiError}
            />
        );
    };

    /* add explicit display name to satisfy react/display-name */
    WrappedWithHooks.displayName = `withHooks(${Component.displayName || Component.name || 'Component'})`;

    return WrappedWithHooks;
};

class RegisterFormClass extends Component<
    RegisterFormProps , RegisterFormState> {
    private audio: HTMLAudioElement | undefined;
    private isoData: IsoData | null = null;
    private hasFetchedSite = false;
    state: RegisterFormState = {
        registerRes: EMPTY_REQUEST,
        captchaRes: EMPTY_REQUEST,
        form: {
            role: "Employer",
            privacyAccepted: false,
            termsAccepted: false
        },
        captchaPlaying: false,
        siteRes: null,
        // เพิ่มคุณสมบัติที่ขาดหายไป
        showPassword: false,
        showConfirmPassword: false,
        apiError: null,
        isSubmitting: false,
        isValid: false,
        errors: {},
        hasFetchedSite: false
    };

    constructor(props: any, context: any) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
    }


    async componentDidMount() {
        const storedData = sessionStorage.getItem("RegisterData");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            this.setState((prevState) => ({
                ...prevState,
                form: {
                    ...prevState.form,
                    email: parsedData.email || prevState.form.email,
                },
                termsAccepted: parsedData.termsAccepted || false,
                privacyAccepted: parsedData.privacyAccepted || false,
            }));
        }

        if (this.hasFetchedSite || this.state.hasFetchedSite) return;

        this.hasFetchedSite = true;
        const site = await HttpService.client.getSite();
        if (site.state === "success") {
            this.setState({
                siteRes:  site.data,
                hasFetchedSite: true,
            });
            if (
              site.data?.siteView?.localSite?.captchaEnabled &&
              isBrowser()
            ) {
                await this.fetchCaptcha();
            }
        }else{
            this.props.setApiError("เกิดข้อผิดพลาดในการดึงข้อมูลเว็บไซต์");
            this.setState({
                hasFetchedSite: true,
                siteRes: null,
            });
        }
    }

    async fetchCaptcha() {
        console.log("fetchCaptcha")
        this.setState({captchaRes: LOADING_REQUEST});
        const captchaRes = await HttpService.client.getCaptcha();
        if (captchaRes.state === "success") {
            this.setState((prevState) => ({
                ...prevState,
                captchaRes,
                form: {
                    ...prevState.form,
                    captchaUuid: captchaRes.data.ok?.uuid
                }
            }));
        }
    }
    handleCaptchaPlay = () => {
        if (this.state.captchaRes.state === "success" && this.state.captchaRes.data.ok) {
            const captchaRes = this.state.captchaRes.data.ok;
            if (!this.audio) {
                const base64 = `data:audio/wav;base64,${captchaRes.wav}`;
                this.audio = new Audio(base64);
                this.audio.play();
                this.setState({ captchaPlaying: true });
                this.audio.addEventListener("ended", () => {
                    if (this.audio) {
                        this.audio.currentTime = 0;
                        this.setState({ captchaPlaying: false });
                    }
                });
            }
        }
    }
    handleRegenCaptcha = async () => {
        this.audio = undefined;
        this.setState({ captchaPlaying: false });
        await this.fetchCaptcha();
    }

    captchaPngSrc(captcha: CaptchaResponse) {
        return `data:image/png;base64,${captcha.png}`;
    }
    refetchCaptcha() {
        if (this.refetch) {
            this.refetch();
        }
    }

    refetch?: () => void;



    handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        this.setState((prevState) => ({
            ...prevState,
            form: {
                ...prevState.form,
                [name]: value,
            }
        }));
    }

    handleSubmit = async (data: any) => {
        const {email, username ,password, confirmPassword, termsAccepted, privacyAccepted, captchaUuid,captchaAnswer, role} = data;

        this.setState(prev => ({
            form: {
                ...prev.form,
                email,
                username,
                password,
                confirmPassword,
                termsAccepted,
                privacyAccepted,
                captchaAnswer,
                role
            }
        }));

        this.setState({ isSubmitting: true, apiError: null });

        sessionStorage.setItem("RegisterUpData", JSON.stringify(data));

        const registerRes = await HttpService.client.register({
            username: data.username || "",  // เพิ่มค่า default เป็น string เปล่า
            email: data.email,
            password: data.password || "",  // เพิ่มค่า default เป็น string เปล่า
            passwordVerify: data.confirmPassword || "",  // เพิ่มค่า default เป็น string เปล่า
            captchaUuid: this.state.form.captchaUuid,
            captchaAnswer: data.captchaAnswer,
            role: data.role,
            acceptedApplication: data.termsAccepted && data.privacyAccepted
        });
        switch (registerRes.state) {
            case "failed": {
                this.setState({
                    form: {
                        email: "",
                        password: "",
                        confirmPassword: "",
                        username: "",
                        role: "Employer",
                        privacyAccepted: false,
                        termsAccepted: false
                    },
                    captchaRes: { state: "empty" },
                    errors: {},
                    isSubmitting: false,
                    showConfirmPassword: false,
                    showPassword: false,
                });
                break;
            }
            case "success": {
                const loginData = registerRes.data;
                // Only log them in if a jwt was set
                if (loginData.jwt) {
                    UserService.Instance.login({
                        res: loginData,
                    });

                    const site = await HttpService.client.getSite();

                    if (site.state === "success") {
                        UserService.Instance.myUserInfo = site.data.myUser;
                        await handleRegisterSuccess(this, loginData, site);
                    }

                    this.props.history.replace("/communities");
                } else {
                    if (data.verifyEmailSent) {
                        toast(("verifyEmailSent"));
                    }
                    if (data.registrationCreated) {
                        toast("registrationApplicationSent");
                    }
                    this.props.history.push("/");
                }
                break;
            }
        }


    }


    renderCaptcha() {
        const { captchaRes, form, captchaPlaying, errors } = this.state;

        if (captchaRes.state === "loading") {
            return (
              <div className="animate-pulse flex items-center justify-center py-4">
                  <Spinner />
              </div>
            );
        }

        if (captchaRes.state !== "success" || !captchaRes.data.ok) return null;

        const captcha = captchaRes.data.ok;

        return (
            <div className="border border-gray-300 rounded-lg p-4 space-y-3">
                <label
                    htmlFor="register-captcha"
                    className="block text-sm font-semibold text-gray-700"
                >
                    {this.props.authen?.captchaLabel || "Enter the code below"}
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    {/* CAPTCHA Image */}
                    <img
                        src={this.captchaPngSrc(captcha)}
                        alt="Captcha"
                        className="rounded border w-full sm:w-[180px] h-[60px] object-contain"
                    />

                    {/* Buttons */}
                    <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={this.handleRegenCaptcha}
                            className="inline-flex items-center px-2.5 py-1.5 border text-xs rounded-md text-gray-700 bg-white hover:bg-gray-100"
                        >
                            <RefreshCcw className="w-4 h-4 mr-1" />
                            {this.props.authen?.refreshCaptcha || "Refresh"}
                        </button>

                        {captcha.wav && (
                            <button
                                type="button"
                                onClick={this.handleCaptchaPlay}
                                className={`inline-flex items-center px-2.5 py-1.5 border text-xs rounded-md text-gray-700 bg-white hover:bg-gray-100 ${
                                    captchaPlaying ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                disabled={captchaPlaying}
                            >
                                <Play className="w-4 h-4 mr-1" />
                                {captchaPlaying ? "Playing..." : this.props.authen?.playAudio || "Audio"}
                            </button>
                        )}
                    </div>
                </div>

                {/* CAPTCHA Input */}
                <CustomInput
                    label={this.props.authen?.labelCached}
                    name="captchaAnswer"
                    type="text"
                    placeholder={this.props.authen?.placeholderCaptcha || "Enter CAPTCHA"}
                    error={this.props.formMethods.formState.errors.captchaAnswer?.message}
                    register={this.props.formMethods.register("captchaAnswer")}
                />

                {/* Error message */}
                {errors.captchaAnswer && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.captchaAnswer}
                    </p>
                )}
            </div>

        );
    }

    render() {
        const {authen, formMethods} = this.props;
        const {
            form: {
                username,
                email,
                password,
                confirmPassword,
                role
            },
            captchaRes: { state: captchaState },
            showPassword,
            showConfirmPassword,
            apiError,
        } = this.state;

        const {register, handleSubmit, formState: {errors, isSubmitting}} = formMethods;

        return (

          <form onSubmit={handleSubmit(this.handleSubmit)} className="space-y-5" noValidate>
              {this.props.apiError && (
                <p className="text-red-500 text-sm text-center mb-4">
                    {this.props.apiError}
                </p>
              )}
              {errors.root && (
                <p className="text-red-500 text-sm text-center mb-4">
                    {errors.root.message}
                </p>
              )}
              <CustomInput
                label={authen?.labelUsername}
                name="username"
                error={this.props.formMethods.formState.errors.username?.message}
                placeholder={authen?.placeholderUsername}
                type="text"
                register={this.props.formMethods.register("username")}
              />
              <CustomInput
                label={authen?.labelEmail}
                type="email"
                name={"email"}
                placeholder={authen?.placeholderEmail}
                register={this.props.formMethods.register("email")}
                error={this.props.formMethods.formState.errors.email?.message}
              />
              <CustomInput
                label={authen?.labelPassword}
                name="password"
                type="password"
                error={this.props.formMethods.formState.errors.password?.message}
                placeholder={authen?.placeholderPassword}
                showPassword={showPassword}
                toggleShowPassword={() => this.setState({ showPassword: !showPassword })}
                register={this.props.formMethods.register("password")}
              />
              <CustomInput
                label={authen?.labelConfirmPassword}
                name="confirmPassword"
                type="password"
                placeholder={authen?.placeholderConfirmPassword}
                showPassword={showConfirmPassword}
                toggleShowPassword={() =>
                  this.setState({ showConfirmPassword: !showConfirmPassword })
                }
                error={this.props.formMethods.formState.errors.confirmPassword?.message}
                register={this.props.formMethods.register("confirmPassword")}
              />
              <div className="space-y-2 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      {"You want to be a:"}
                  </label>
                  <div className="flex gap-4 text-sm font-medium w-full max-w-md">
                      {["Employer", "Freelancer"].map((option) => (
                        <label key={option} className="flex-1 relative">
                            <input
                              type="radio"
                              name="role"
                              value={option}
                              checked={role === option}
                              onChange={(e) => this.handleRadioChange(e)}
                              className="peer hidden"
                            />
                            <div
                              className={classNames(
                                "peer-checked:bg-primary peer-checked:text-white",
                                "bg-white text-gray-600 border border-gray-300",
                                "hover:border-primary hover:text-primary",
                                "rounded-md text-center",
                                "h-10 flex items-center justify-center",
                                "transition-all duration-200 cursor-pointer"
                              )}
                            >
                                {option}
                            </div>
                        </label>
                      ))}
                  </div>
              </div>
              {this.renderCaptcha()}
              <div className="space-y-4 text-gray-700">
                  <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
                        {...register("termsAccepted")}

                      />
                      <label
                        htmlFor="termsAccepted"
                        className="text-sm text-text_secondary font-sans"
                      >
                          {authen?.checkboxTermsConditions}{" "}
                          <Link
                            prefetch={false}
                            href="/content/terms"
                            className="text-text_secondary underline"
                          >
                              {authen?.checkboxTermsConditionsRedirect}
                          </Link>
                      </label>
                  </div>

                  <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="privacyAccepted"
                        name="privacyAccepted"
                        className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
                        {...register("privacyAccepted")}
                      />
                      <label
                        htmlFor="privacyAccepted"
                        className="text-sm text-text_secondary font-sans"
                      >
                          {authen?.checkboxTermsConditions}{" "}
                          <Link
                            prefetch={false}
                            href="/content/privacy"
                            className="text-text_secondary underline"
                          >
                              {authen?.checkboxPrivacyPolicyRedirect}
                          </Link>
                      </label>
                  </div>
              </div>

              {apiError && (
                <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                    {apiError}
                </div>
              )}

              <div className="text-center">
                  <button
                    type="submit"
                    className="submit-button py-3"
                    disabled={!formMethods.formState.isValid}>
                      {isSubmitting ? <LoadingCircle /> : authen?.linkCreateAccount}
                  </button>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                  <div className="text-center text-sm text-gray-500">
                      หรือสมัครด้วยบัญชีโซเชียล
                  </div>
              </div>
          </form>
        );
    }
}

export const RegisterForm = withHooks(RegisterFormClass);