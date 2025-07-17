"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { UpdateDataProps } from "@/types/update-term";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { Component, createRef } from "react";
import { z } from "zod";
import { RegisterOAuthFormData } from "@/types/formTypes/RegisterOAuth";
import { useSession } from "next-auth/react";
import {axiosPrivate} from "@/lib/axios"; // เพิ่ม import นี้

type AcceptFormProps = {
  switchToVerifyEmail: () => void;
  setDataUpdate: (data: UpdateDataProps) => void;
  authen: ReturnType<typeof useTranslateFile>;
  session: ReturnType<typeof useSession>["data"];
};

type AcceptFormState = {
  showPassword: boolean;
  showConfirmPassword: boolean;
  apiError: string | null;
  isSubmitting: boolean;
  errors: {
    email?: { message?: string };
    password?: { message?: string };
    confirmPassword?: { message?: string };
  };
  formValues: {
    email: string;
    password: string;
    confirmPassword: string;
    role: "Employer" | "Freelancer";
    termsAccepted: boolean;
    privacyAccepted: boolean;
    promotionalAccepted?: boolean;
  };
};

export class AcceptFormClass extends Component<AcceptFormProps, AcceptFormState> {
  form: React.RefObject<HTMLFormElement | null>;
  UpdateSchema: z.ZodType<any>;

  constructor(props: AcceptFormProps) {
    super(props);
    this.form = createRef();
    this.UpdateSchema = z
      .object({
        email: z.string().email(this.props.authen?.invalidEmail),
        password: z.string().min(6, this.props.authen?.passwordMin6),
        confirmPassword: z.string(),
        termsAccepted: z.boolean().refine((val) => val === true),
        privacyAccepted: z.boolean().refine((val) => val === true),
        promotionalAccepted: z.boolean().optional(),
        role: z.enum(["Employer", "Freelancer"]).default("Employer"),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: this.props.authen?.notMatchPassword,
        path: ["confirmPassword"],
      });

    this.state = {
      showPassword: false,
      showConfirmPassword: false,
      apiError: null,
      isSubmitting: false,
      errors: {},
      formValues: {
        email: "",
        password: "",
        confirmPassword: "",
        role: "Employer",
        termsAccepted: false,
        privacyAccepted: false,
        promotionalAccepted: false,
      },
    };
  }

  async componentDidMount() {
    const session = this.props.session;
    if (session?.user?.email) {
      this.setState((prev) => ({
        formValues: {
          ...prev.formValues,
          email: session.user.email || "",
        },
      }));
    }
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    this.setState((prev) => ({
      formValues: {
        ...prev.formValues,
        [name]: type === "checkbox" ? checked : value,
      },
      errors: {
        ...prev.errors,
        [name]: undefined, // clear error on change
      },
    }));
  };

  handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState((prev) => ({
      formValues: {
        ...prev.formValues,
        role: e.target.value as "Employer" | "Freelancer",
      },
    }));
  };

  toggleShowPassword = () => {
    this.setState((prev) => ({ showPassword: !prev.showPassword }));
  };

  toggleShowConfirmPassword = () => {
    this.setState((prev) => ({ showConfirmPassword: !prev.showConfirmPassword }));
  };

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { formValues } = this.state;
    this.setState({ isSubmitting: true, apiError: null, errors: {} });
    // Validate with zod
    try {
      const validData = this.UpdateSchema.parse(formValues);
      sessionStorage.setItem("RegisterUpData", JSON.stringify(validData));
      const response = await axiosPrivate.post("/account/auth/update_term", {
        email: validData.email,
        password: validData.password,
        passwordVerify: validData.confirmPassword,
        role: validData.role,
        termsAccepted: validData.termsAccepted,
      });
      if (response.status === 200) {
        // handle success
        // this.props.switchToVerifyEmail();
        // this.props.setDataUpdate({ ... });
        // For now, log response
        console.error("response:", response.data);
      }
    } catch (error: any) {
      if (error?.errors || error?.formErrors) {
        // zod error
        const fieldErrors: any = {};
        if (error.errors) {
          error.errors.forEach((err: any) => {
            if (err.path && err.path.length > 0) {
              fieldErrors[err.path[0]] = { message: err.message };
            }
          });
        }
        this.setState({ errors: fieldErrors, apiError: null });
      } else {
        // api error
        this.setState({
          apiError:
            error instanceof Error
              ? error.message
              : "เกิดข้อผิดพลาดในการลงทะเบียน",
        });
      }
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  render() {
    const { showPassword, showConfirmPassword, apiError, isSubmitting, errors, formValues } = this.state;
    const authen = this.props.authen;
    return (
      <form onSubmit={this.handleSubmit} className="space-y-5" ref={this.form}>
        <CustomInput
          label={authen?.labelEmail}
          name="email"
          error={errors.email?.message}
          placeholder={authen?.placeholderEmail}
          readonly
          type="email"
        />

        <CustomInput
          label={authen?.labelPassword}
          name="password"
          type={showPassword ? "text" : "password"}
          error={errors.password?.message}
          placeholder={authen?.placeholderPassword}
          showPassword={showPassword}
          toggleShowPassword={this.toggleShowPassword}
        />

        <CustomInput
          label={authen?.labelConfirmPassword}
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          error={errors.confirmPassword?.message}
          placeholder={authen?.placeholderConfirmPassword}
          showPassword={showConfirmPassword}
          toggleShowPassword={this.toggleShowConfirmPassword}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {"Account Type"}
          </label>
          <div className="flex gap-6 items-center text-base text-text_primary">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="Employer"
                checked={formValues.role === "Employer"}
                onChange={this.handleRoleChange}
              />
              {"Employer"}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="Freelancer"
                checked={formValues.role === "Freelancer"}
                onChange={this.handleRoleChange}
              />
              {"Freelancer"}
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formValues.termsAccepted}
              onChange={this.handleInputChange}
              className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
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
              checked={formValues.privacyAccepted}
              onChange={this.handleInputChange}
              className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
            />
            <label
              htmlFor="privacyAccepted"
              className="text-sm text-text_secondary font-sans"
            >
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
            disabled={
              !!errors.confirmPassword ||
              !formValues.termsAccepted ||
              !formValues.privacyAccepted
            }
          >
            {isSubmitting ? <LoadingCircle /> : authen?.linkCreateAccount}
          </button>
        </div>
      </form>
    );
  }
}

// Higher Order Component to inject hooks into a class component
function withHooks<T>(ComponentClass: React.ComponentType<T>) {
  return (props: Omit<T, "authen" | "session">) => {
    const authen = useTranslateFile(LanguageFile.AUTHEN);
    const { data: session } = useSession();

    return <ComponentClass {...(props as T)} authen={authen} session={session} />;
  };
}

export const AcceptForm = withHooks(AcceptFormClass);
