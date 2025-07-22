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
    OAuthProvider,
} from "lemmy-js-client";
import {
    EMPTY_REQUEST,
    HttpService,
} from "@/services/HttpService";
import {setIsoData} from "@/utils/app";

import TotpModal from "@/components/Common/Modal/TotpModal";
import {OAuthButtons} from "@/components/Authentication/LoginForm/oauth-provider";
import {handleLogin, handleSubmitTotp, handleUseOAuthProvider} from "@/components/Authentication/LoginForm/handlers";
import {LoginFormProps, LoginFormState, State, LoginProps} from "@/components/Authentication/LoginForm/interface";


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

export class LoginFormClass extends Component<
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
    private isoData  = setIsoData(this.context);
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
        if (site.state === "success") {
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
        const {switchToRegister, switchToForgotPassword, authen, formMethods} = this.props;
        const {showPassword, oauthProviders} = this.state;
        const {register, handleSubmit, formState: {errors, isSubmitting}} = formMethods;

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
                        label={authen?.labelUsernameOrEmail}
                        name="usernameOrEmail"
                        register={register("usernameOrEmail")}
                        error={errors.usernameOrEmail?.message}
                        placeholder={authen?.placeholderUsernameOrEmail}
                    />

                    <CustomInput
                        label={authen?.labelPassword}
                        name="password"
                        type="password"
                        register={register("password")}
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
                    <OAuthButtons providers={oauthProviders} onLogin={this.handleLoginWithProvider} label={authen?.labelOrSignInWith ?? "หรือเข้าสู่ระบบด้วย"}/>
                </form>
            </div>
        );
    }
}

export const LoginForm = withHooks(LoginFormClass);