"use client";
import LoadingCircle from "@/components/LoadingCircle";
import {CustomInput} from "@/components/ui/InputField";
import {LanguageFile} from "@/constants/language";
import {useTranslateFile} from "@/hooks/translation/useTranslateFile";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter, useSearchParams} from "next/navigation";
import React, {Component, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {
    GetSiteResponse,
    LoginResponse,
    OAuthProvider,
    PublicOAuthProvider,
} from "../../../lib/lemmy-js-client";
import {
    EMPTY_REQUEST,
    HttpService,
    RequestState,
} from "@/services/HttpService";
import {IsoData} from "@/interfaces";
import {toast} from "@/toast";
import {UserService} from "@/services";
import {setIsoData} from "@/utils/app";

interface LoginFormProps {
    formState: {
        usernameOrEmail: string;
        password: string;
        totp2faToken?: string;
    };
    setFormState: React.Dispatch<
        React.SetStateAction<{
            usernameOrEmail: string;
            password: string;
            totp2faToken?: string;
        }>
    >;
    switchToRegister: () => void;
    switchToForgotPassword: () => void;
    openTotpModal: () => void;
}


interface State {
    loginRes: RequestState<LoginResponse>;
    form: {
        usernameOrEmail: string;
        password: string;
        totp2faToken?: string;
    };

    siteRes: GetSiteResponse | null;
    show2faModal: boolean;
    showOAuthModal: boolean;
    showPassword: boolean;
    oauthProviders: PublicOAuthProvider[];
    hasFetchedSite: boolean;
}

interface LoginFormState {
    showPassword: boolean;
    oauthProviders: PublicOAuthProvider[];
    hasFetchedSite: boolean;
}


async function handleLoginSuccess(i: LoginFormClass, loginRes: LoginResponse) {
    UserService.Instance.login({
        res: loginRes,
    });
    const site = await HttpService.client.getSite();

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

        const loginSchema = z.object({
            usernameOrEmail: z
                .string()
                .min(6, authen?.pleaseEnterEmailOrUsernameMin6)
                .max(32, authen?.usernameMax32),
            password: z.string().min(6, authen?.passwordMin6),
        });

        const formMethods = useForm<z.infer<typeof loginSchema>>({
            resolver: zodResolver(loginSchema),
        });

    const [apiError, setApiError] = useState<string | null>(null);

    return (
      <Component
        {...props}
        authen={authen}
        router={router}
        redirectUrl={redirectUrl}
        formMethods={formMethods}
        loginSchema={loginSchema}
        apiError={apiError}
        setApiError={setApiError}
      />
    );
  };

    /* add explicit display name to satisfy react/display-name */
    WrappedWithHooks.displayName = `withHooks(${Component.displayName || Component.name || 'Component'})`;

    return WrappedWithHooks;
};

class LoginFormClass extends Component<
    LoginFormProps & {
    authen: any;
    router: any;
    redirectUrl: string;
    formMethods: any;
    loginSchema: any;
    apiError: string | null;
    setApiError: (value: string | null) => void;
    },
    State> {
    private isoData: IsoData | null = null;
    private hasFetchedSite = false;

    state: State = {
        loginRes: EMPTY_REQUEST,
        form: {
            usernameOrEmail: "",
            password: "",
        },
        siteRes: null,
        show2faModal: false,
        showOAuthModal: false,
        showPassword: false,
        oauthProviders: [],
        hasFetchedSite: false
    };

    constructor(props: any, context: any) {
        super(props, context);

        this.handleSubmitTotp = this.handleSubmitTotp.bind(this);
        this.handleLoginWithProvider = this.handleLoginWithProvider.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }


    async componentDidMount() {
        this.isoData = setIsoData(this.context);

        if (this.isoData?.siteRes) {
            this.setState({
                siteRes: this.isoData.siteRes,
                oauthProviders: this.isoData.siteRes.oauthProviders ?? [],
                hasFetchedSite: true,
            });
            return;
        }
        if (this.hasFetchedSite || this.state.hasFetchedSite) return;

        this.hasFetchedSite = true;

        const site = await HttpService.client.getSite();
        if (site.state === "success") {
            this.setState({
                siteRes: site.data,
                oauthProviders: site.data.oauthProviders ?? [],
                hasFetchedSite: true,
            });
        }else{
            this.props.setApiError("เกิดข้อผิดพลาดในการดึงข้อมูลเว็บไซต์");
            this.setState({
                hasFetchedSite: true,
                oauthProviders: [],
            });
        }
    }

    toggleShowPassword = () => {
        this.setState((prevState: LoginFormState) => ({
            showPassword: !prevState.showPassword
        }));
    };

    handleLoginWithProvider = (provider: OAuthProvider) => {
        this.handleUseOAuthProvider({
            oauthProvider: provider,
            prev: this.props.redirectUrl,
        });
    };

    handleUseOAuthProvider = async (params: {
        oauthProvider: OAuthProvider;
        username?: string;
        prev?: string;
        answer?: string;
        showNsfw?: boolean;
    }) => {
        const redirectUri = `${window.location.origin}/api/auth/callback/${params.oauthProvider.displayName}`;
        const state = crypto.randomUUID();
        const requestUri =
            params.oauthProvider.authorizationEndpoint +
            "?" +
            [
                `client_id=${encodeURIComponent(params.oauthProvider.clientId)}`,
                `response_type=code`,
                `scope=${encodeURIComponent(params.oauthProvider.scopes)}`,
                `redirect_uri=${encodeURIComponent(redirectUri)}`,
                `state=${state}`,
            ].join("&");
        console.log(requestUri);

        localStorage.setItem(
            "oauthState",
            JSON.stringify({
                state,
                oauthProviderId: params.oauthProvider.id,
                redirectUri: redirectUri,
                prev: params.prev ?? "/",
                username: params.username,
                answer: params.answer,
                expiresAt: Date.now() + 5 * 60_000,
            }),
        );

        window.location.assign(requestUri);
    };

    handleLoginSuccess = async (loginInRes: LoginResponse) => {
        sessionStorage.setItem("jwt", loginInRes.jwt || "");
    };
    handleLogin = async (data: any) => {
        const {usernameOrEmail, password} = data;
        this.setState(prev => ({
            form: {
                ...prev.form,
                usernameOrEmail,
                password,
            }
        }));
        try {
            const loginRes = await HttpService.client.login({
                usernameOrEmail,
                password,
                totp2faToken: this.state.form.totp2faToken || undefined,
            });

            switch (loginRes.state) {
                case "failed": {
                    const {name, message} = loginRes.err ?? {};
                    console.log("error ", name);
                    if (name === "missing_totp_token") {
                        // Trigger modal to ask for TOTP token
                        this.setState({show2faModal: true});
                        this.props.openTotpModal();
                    } else {
                        this.props.formMethods.setError("password", {
                            type: "manual",
                            message: this.props.authen?.invalidPassword ?? "รหัสผ่านไม่ถูกต้อง",
                        });
                    }
                    this.setState({loginRes});
                    break;
                }
                case "success": {
                    await handleLoginSuccess(this, loginRes.data);
                    break;
                }
            }
        } catch (error) {
            console.error(error);
            this.props.formMethods.setError("root", {
                type: "manual",
                message: this.props.authen?.systemError ?? "เกิดข้อผิดพลาดของระบบ กรุณาลองใหม่อีกครั้ง",
            });
        }
    };

    async handleSubmitTotp(totp: string) {
        const {usernameOrEmail, password} = this.state.form;

        this.setState(prev => ({
            form: {
                ...prev.form,
                totp2faToken: totp,
            },
        }));

        const loginRes = await HttpService.client.login({
            usernameOrEmail,
            password,
            totp2faToken: totp,
        });

        const successful = loginRes.state === "success";
        if (successful) {
            this.setState({show2faModal: false});
            await this.handleLoginSuccess(loginRes.data);
        } else {
            toast("incorrectTotpCode");
        }

        return successful;
    }

    render() {
        const {switchToRegister, switchToForgotPassword, authen, formMethods} = this.props;
        const {showPassword, oauthProviders} = this.state;
        const {register, handleSubmit, formState: {errors, isSubmitting}} = formMethods;

    return (
      <form onSubmit={handleSubmit(this.handleLogin)} className="space-y-5">
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
                    label={authen?.labelUsernameOrEmail}
                    name="usernameOrEmail"
                    register={register("usernameOrEmail")}
                    value={this.props.formState.usernameOrEmail}
                    onChange={(e) =>
                        this.props.setFormState((prev) => ({
                            ...prev,
                            usernameOrEmail: e.target.value,
                        }))
                    }
                    error={errors.usernameOrEmail?.message}
                    placeholder={authen?.placeholderUsernameOrEmail}
                />

                <CustomInput
                    label={authen?.labelPassword}
                    name="password"
                    type="password"
                    register={register("password")}
                    value={this.props.formState.password}
                    onChange={(e) =>
                        this.props.setFormState((prev) => ({
                            ...prev,
                            password: e.target.value,
                        }))
                    }
                    error={errors.password?.message}
                    placeholder={authen?.placeholderPassword}
                    showPassword={showPassword}
                    toggleShowPassword={this.toggleShowPassword}
                />

                <div className="text-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="submit-button py-2"
                    >
                        {isSubmitting ? <LoadingCircle/> : authen?.buttonProceed}
                    </button>

                    <div className="flex justify-between text-sm text-blue-600 mt-4">
                        <button
                            type="button"
                            onClick={switchToRegister}
                            className="hover:underline"
                        >
                            {authen?.linkCreateAccount}
                        </button>
                        <button
                            type="button"
                            onClick={switchToForgotPassword}
                            className="hover:underline"
                        >
                            {authen?.linkForgotPassword}
                        </button>
                    </div>
                </div>

                {oauthProviders.length > 0 && (
                    <>
                        <hr className="my-6"/>
                        <p className="text-center text-sm text-gray-600 mb-3">
                            {authen?.labelOrSignInWith ?? "หรือเข้าสู่ระบบด้วย"}
                        </p>
                        <div className="flex flex-col gap-3">
                            {oauthProviders.map((p) => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => this.handleLoginWithProvider(p)}
                                    className="oauth-button py-2 px-4 border rounded-md flex justify-center items-center hover:bg-gray-100"
                                >
                                    {p.displayName}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </form>
        );
    }
}

export const LoginForm = withHooks(LoginFormClass);