"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import {
    EMPTY_REQUEST,
    HttpService, isSuccess,
} from "@/services/HttpService";
import { setIsoData } from "@/utils/app";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    OAuthProvider,
} from "lemmy-js-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Component, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { handleLogin, handleSubmitTotp, handleUseOAuthProvider } from "@/components/Authentication/LoginForm/handlers";
import { LoginFormProps, LoginFormState, State } from "@/components/Authentication/LoginForm/interface";
import { OAuthButtons } from "@/components/Authentication/LoginForm/oauth-provider";
import TotpModal from "@/components/Common/Modal/TotpModal";
import { useTranslation } from "react-i18next";


const withHooks = (Component: any) => {
    const WrappedWithHooks = (props: any) => {
        const { t } = useTranslation();
        const router = useRouter();
        const searchParams = useSearchParams();
        const redirectUrl = searchParams.get("redirect") || "/";
        
        // Handle loading and error states
        const loginSchema = z.object({
            usernameOrEmail: z
                .string()
                .min(6, t("authen.usernameMin6"))
                .max(32, t("authen.usernameMax32")),
            password: z.string().min(6, t("authen.passwordMin6")),
        });

        const formMethods = useForm<z.infer<typeof loginSchema>>({
            resolver: zodResolver(loginSchema),
        });

        const [apiError, setApiError] = useState<string | null>(null);

        return (
            <Component
                {...props}
                t={t}
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

export class LoginFormClass extends Component<
    LoginFormProps & {
        t: (key: string, options?: any) => string;
        router: any;
        redirectUrl: string;
        formMethods: any;
        loginSchema: any;
        apiError: string | null;
        setApiError: (value: string | null) => void;
    },
    State> {
    private isoData = setIsoData(this.context);
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

        this.handleLoginWithProvider = this.handleLoginWithProvider.bind(this);
    }

    async componentDidMount() {

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
        if (isSuccess(site)) {
            this.setState({
                siteRes: site.data,
                oauthProviders: site.data.oauthProviders ?? [],
                hasFetchedSite: true,
            });
        } else {
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
        handleUseOAuthProvider({
            oauthProvider: provider,
            prev: this.props.redirectUrl,
        });
    };

    render() {
        const { switchToRegister, switchToForgotPassword, t, formMethods } = this.props;
        const { showPassword, oauthProviders } = this.state;
        const { register, handleSubmit, formState: { errors, isSubmitting } } = formMethods;

        return (
            <div>
                {this.state.show2faModal && (
                    <TotpModal
                        show={this.state.show2faModal}
                        onClose={() => this.setState({ show2faModal: false })}
                        onSubmit={handleSubmit((data: string) => handleSubmitTotp(this, data))}
                        type={"login"}
                    />
                )}
                <form onSubmit={handleSubmit((data: any) => handleLogin(this, data))} className="space-y-5">
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
                        label={t("authen.labelUsernameOrEmail")}
                        name="usernameOrEmail"
                        register={register("usernameOrEmail")}
                        error={errors.usernameOrEmail?.message}
                        placeholder={t("authen.placeholderUsernameOrEmail")}
                    />

                    <CustomInput
                        label={t("authen.labelPassword")}
                        name="password"
                        type="password"
                        register={register("password")}
                        error={errors.password?.message}
                        placeholder={t("authen.placeholderPassword")}
                        showPassword={showPassword}
                        toggleShowPassword={this.toggleShowPassword}
                    />

                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="submit-button py-2"
                        >
                            {isSubmitting ? <LoadingCircle /> : t("authen.buttonProceed")}
                        </button>

                        <div className="flex justify-between text-sm text-blue-600 mt-4">
                            <button
                                type="button"
                                onClick={switchToRegister}
                                className="hover:underline"
                            >
                                {t("authen.linkCreateAccount")}
                            </button>
                            <button
                                type="button"
                                onClick={switchToForgotPassword}
                                className="hover:underline"
                            >
                                {t("authen.linkForgotPassword")}
                            </button>
                        </div>
                    </div>
                    <OAuthButtons providers={oauthProviders} onLogin={this.handleLoginWithProvider} label={t("authen.labelOrSignInWith")} />
                </form>
            </div>
        );
    }
}

export const LoginForm = withHooks(LoginFormClass);