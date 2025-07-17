"use client";
import LoadingCircle from "@/components/LoadingCircle";
import { CustomInput } from "@/components/ui/InputField";
import {Icon, Spinner} from "@/components/icon";
import { LanguageFile } from "@/constants/language";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import { RegisterDataProps } from "@/types/register-data";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import { z } from "zod";
import {HttpService, UserService} from "@/services";
import {toast} from "sonner";
import {EMPTY_REQUEST, LOADING_REQUEST, RequestState} from "@/services/HttpService";
import { useForm } from "react-hook-form";
import {
  CaptchaResponse,
  GetCaptchaResponse,
  GetSiteResponse,
  LoginResponse,
  SiteView,
} from "lemmy-js-client";
import {IsoData} from "@/interfaces";
import {setIsoData} from "@/utils/app";
import { isBrowser } from "@/utils/browser";

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
    promotionalAccepted: boolean;
    captchaUuid?: string;
    captchaAnswer?: string;
    answer?: string;
    role: "Employer" | "Freelancer";
  };
  captchaPlaying: boolean;
  siteRes: GetSiteResponse | null;
  isSubmitting: boolean;
  hasFetchedSite: boolean;
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

class RegisterFormClass extends React.Component<
  RegisterFormProps,
  RegisterFormState
> {
  // ลบบรรทัดนี้ออก
  // authen = useTranslateFile(LanguageFile.AUTHEN);
  private isoData = setIsoData(this.context);
  private audio: HTMLAudioElement | undefined;
  private hasFetchedSite = false;
  // ใช้ authen จาก props แทน
  RegisterSchema = z
    .object({
      email: z.string().email(this.props.authen?.invalidEmail),
      username: z.string().min(6, this.props.authen?.usernameMin6),
      password: z.string().min(6, this.props.authen?.passwordMin6),
      confirmPassword: z.string(),
      termsAccepted: z.boolean().refine((val) => val === true),
      privacyAccepted: z.boolean().refine((val) => val === true),
      promotionalAccepted: z.boolean().optional(),
      captchaUuid: z.string().optional(),
      captchaAnswer: z.string().min(1, this.props.authen?.requireCaptcha),
      role: z.enum(["Employer", "Freelancer"]).default("Employer"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: this.props.authen?.notMatchPassword,
      path: ["confirmPassword"],
    });

  state: RegisterFormState = {
    registerRes: EMPTY_REQUEST,
    captchaRes: EMPTY_REQUEST,
    form: {
      promotionalAccepted: false,
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
    errors: {},
    hasFetchedSite: false
  };
  constructor(props: { isoData?: any; history?: any; switchToVerifyEmail?: () => void; setDataRegister?: (data: RegisterDataProps) => void; refetch?: (() => void) | undefined; register?: any; errors?: any; authen?: any; }) {
    super(props as RegisterFormProps);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    // this.isoData = setIsoData(this.context);
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

  setCaptchaUuid(uuid: string) {
    this.setState((prevState) => ({
      ...prevState,
      captchaRes: {
        ...prevState.captchaRes,
        uuid: uuid
      }
    }));
  }

  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    this.setState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [name]: value,
      }
    }));

  }

  handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;

    this.setState((prevState) => ({
      ...prevState,
      form: {
        ...prevState.form,
        [name]: checked,
      }
    }));

  }


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


  validateForm(): boolean {
    const data = {
      email: this.state.form.email,
      username: this.state.form.username,
      password: this.state.form.password,
      confirmPassword: this.state.form.confirmPassword,
      termsAccepted: this.state.form.termsAccepted,
      privacyAccepted: this.state.form.privacyAccepted,
      promotionalAccepted: this.state.form.promotionalAccepted,
      captchaUuid: this.state.form.captchaUuid,
      captchaAnswer: this.state.form.captchaAnswer,
      role: this.state.form.role,
    };

    try {
      this.RegisterSchema.parse(data);
      this.setState({ errors: {} });
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formErrors: any = {};
        err.errors.forEach((error) => {
          if (error.path.length > 0) {
            formErrors[error.path[0]] = error.message;
          }
        });
        this.setState({ errors: formErrors });
      }
      return false;
    }
  }

  async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setState({ isSubmitting: true, apiError: null });

    const data = {
      email: this.state.form.email,
      username: this.state.form.username,
      password: this.state.form.password,
      confirmPassword: this.state.form.confirmPassword,
      termsAccepted: this.state.form.termsAccepted,
      privacyAccepted: this.state.form.privacyAccepted,
      promotionalAccepted: this.state.form.promotionalAccepted,
      captchaUuid: this.state.form.captchaUuid,
      captchaAnswer: this.state.form.captchaAnswer,
      role: this.state.form.role,
    };

    sessionStorage.setItem("RegisterUpData", JSON.stringify(data));


      const registerRes = await HttpService.client.register({
          username: data.username || "",  // เพิ่มค่า default เป็น string เปล่า
          email: data.email,
          password: data.password || "",  // เพิ่มค่า default เป็น string เปล่า
          passwordVerify: data.confirmPassword || "",  // เพิ่มค่า default เป็น string เปล่า
          captchaUuid: data.captchaUuid,
          captchaAnswer: data.captchaAnswer,
      });
    switch (registerRes.state) {
      case "failed": {
        this.setState({
          form: {
            email: "",
            password: "",
            confirmPassword: "",
            username: "",
            promotionalAccepted: false,
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
        const data = registerRes.data;

        // Only log them in if a jwt was set
        if (data.jwt) {
          UserService.Instance.login({
            res: data,
          });

          const site = await HttpService.client.getSite();

          if (site.state === "success") {
            UserService.Instance.myUserInfo = site.data.myUser;
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

  handleRegisterCaptchaAnswerChange(i: RegisterFormClass, event: any) {
    i.state.form.captchaAnswer = event.target.value;
    i.setState(i.state);
  }

  async fetchCaptcha() {
    console.log("fetchCaptcha")
    this.setState({ captchaRes: LOADING_REQUEST });
    this.setState({
      captchaRes: await HttpService.client.getCaptcha(),
    });

    this.setState(s => {
      if (s.captchaRes.state === "success") {
        s.form.captchaUuid = s.captchaRes.data.ok?.uuid;
      }
      return s;
    });
  }
  handleCaptchaPlay(i: RegisterFormClass) {
    // This was a bad bug, it should only build the new audio on a new file.
    // Replays would stop prematurely if this was rebuilt every time.

    if (i.state.captchaRes.state === "success" && i.state.captchaRes.data.ok) {
      const captchaRes = i.state.captchaRes.data.ok;
      if (!i.audio) {
        const base64 = `data:audio/wav;base64,${captchaRes.wav}`;
        i.audio = new Audio(base64);
        i.audio.play();

        i.setState({ captchaPlaying: true });

        i.audio.addEventListener("ended", () => {
          if (i.audio) {
            i.audio.currentTime = 0;
            i.setState({ captchaPlaying: false });
          }
        });
      }
    }
  }
  async handleRegenCaptcha(i: RegisterFormClass) {
    console.log("handleRegenCaptcha")
    i.audio = undefined;
    i.setState({ captchaPlaying: false });
    await i.fetchCaptcha();
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


  render() {
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
      errors,
      isSubmitting,
    } = this.state;

    const authen = this.props.authen;

    // ในส่วน render method
  
  // ตรวจสอบว่า register มีค่าและเป็นฟังก์ชันหรือไม่
  const registerProp = typeof this.props.register === 'function' 
    ? this.props.register 
    : (name: string) => ({ name });  // ฟังก์ชันเริ่มต้นถ้า register ไม่ใช่ฟังก์ชัน

    return (
      <form onSubmit={this.handleSubmit} className="space-y-5" noValidate>
        <CustomInput
          label={authen?.labelUsername}
          name="username"
          onChange={this.handleInputChange}
          error={errors.username}
          placeholder={authen?.placeholderUsername}
          type="text"
        />
        <CustomInput
          label={authen?.labelEmail}
          name="email"
          onChange={this.handleInputChange}
          error={errors.email}
          placeholder={authen?.placeholderEmail}
          type="email"
        />

        <CustomInput
          label={authen?.labelPassword}
          name="password"
          type="password"
          onChange={this.handleInputChange}
          error={errors.password}
          placeholder={authen?.placeholderPassword}
          showPassword={showPassword}
          toggleShowPassword={() => this.setState({ showPassword: !showPassword })}
        />

        <CustomInput
          label={authen?.labelConfirmPassword}
          name="confirmPassword"
          type="password"
          onChange={this.handleInputChange}
          error={errors.confirmPassword}
          placeholder={authen?.placeholderConfirmPassword}
          showPassword={showConfirmPassword}
          toggleShowPassword={() =>
            this.setState({ showConfirmPassword: !showConfirmPassword })
          }
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {"Account Type"}
          </label>
          <div className="flex gap-6 items-center text-base text-textPrimary">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="Employer"
                name="role"
                checked={role === "Employer"}
                onChange={(e) => this.handleRadioChange(e)}
              />
              {"Employer"}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="Freelancer"
                name="role"
                checked={role === "Freelancer"}
                onChange={(e) => this.handleRadioChange(e)}
              />
              {"Freelancer"}
            </label>
          </div>
        </div>
        {/* สร้างปุ่มเล่นเสียง captcha */}
        {/*<button*/}
        {/*  type="button"*/}
        {/*  onClick={() => this.handleCaptchaPlay(this)}*/}
        {/*  className="captcha-play-button"*/}
        {/*>*/}
        {/*  /!*<IconSound className="icon-sound" />*!/*/}
        {/*  เล่นเสียง*/}
        {/*</button>*/}
        {this.renderCaptcha()}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={this.state.form.termsAccepted}
              onChange={this.handleCheckboxChange}
              className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
            />
            <label
              htmlFor="termsAccepted"
              className="text-sm text-textSecondary font-sans"
            >
              {authen?.checkboxTermsConditions}{" "}
              <Link
                prefetch={false}
                href="/content/terms"
                className="text-textSecondary underline"
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
              checked={this.state.form.privacyAccepted}
              onChange={this.handleCheckboxChange}
              className="w-[1.3em] h-[1.3em] flex-shrink-0 border-[0.0625em] border-neutral-500 rounded-xl bg-transparent cursor-pointer checked:border-primary checked:bg-primary "
            />
            <label
              htmlFor="privacyAccepted"
              className="text-sm text-textSecondary font-sans"
            >
              {authen?.checkboxTermsConditions}{" "}
              <Link
                prefetch={false}
                href="/content/privacy"
                className="text-textSecondary underline"
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
              !!errors.confirmPassword || !this.state.form.termsAccepted || !this.state.form.privacyAccepted || isSubmitting
            }
          >
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
  renderCaptcha() {
    switch (this.state.captchaRes.state) {
      case "loading":
        return <Spinner />;
      case "success": {
        const res = this.state.captchaRes.data;
        return (
          <div className="mb-3 row">
            <label className="col-sm-2" htmlFor="register-captcha">
              <span className="me-2">
                 enter_code
              </span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={(e) => this.handleRegenCaptcha}
                aria-label="captcha"
              >
                <Icon icon="refresh-cw" classes="icon-refresh-cw" />
              </button>
            </label>
            {this.showCaptcha(res)}
            <div className="col-sm-6">
              <input
                type="text"
                className="form-control"
                id="register-captcha"
                value={this.state.form.captchaAnswer}
                onInput={(e) => {
                  this.handleRegisterCaptchaAnswerChange(this, e);
                }}
                required
              />
            </div>
          </div>
        );
      }
    }
  }

  showCaptcha(res: GetCaptchaResponse) {
    const captchaRes = res?.ok;
    return captchaRes ? (
      <div className="col-sm-4">
        <>
          <img
            className="rounded-top img-fluid"
            src={this.captchaPngSrc(captchaRes)}
            alt="captcha"
          />
          {captchaRes.wav && (
            <button
              className="rounded-bottom btn btn-sm btn-secondary d-block"
              title="play_captcha_audio"
              onClick={async (e) => this.handleRegenCaptcha}
              type="button"
              disabled={this.state.captchaPlaying}
            >
              <Icon icon="play" classes="icon-play" />
            </button>
          )}
        </>
      </div>
    ) : (
      <></>
    );
  }
}

// แก้ไข HOC เพื่อส่ง authen ผ่าน props
function withHooks(Component: typeof RegisterFormClass) {
  return function WrappedComponent(props: Omit<RegisterFormProps, 'authen' | 'register' | 'errors'>) {
    const authen = useTranslateFile(LanguageFile.AUTHEN);
    
    // ใช้ useForm จริงๆ เพื่อให้ได้ register function ที่ถูกต้อง
    const { register, formState: { errors } } = useForm();
    
    return <Component 
      {...props}
      authen={authen} 
      register={register} 
      errors={errors} 
    />;
  };
}

// อัปเดต type ของ props ให้รวม authen
type RegisterFormProps = {
  history: any;
  switchToVerifyEmail: () => void;
  setDataRegister: (data: RegisterDataProps) => void;
  refetch?: () => void;
  register: any;
  errors: any;
  authen: any; // เพิ่ม authen ที่นี่
  setApiError(err: string): void;
};

export const RegisterForm = withHooks(RegisterFormClass);