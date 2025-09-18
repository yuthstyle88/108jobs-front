import {clearAuthCookie, isBrowser, setAuthCookie} from "@/utils/browser";
import * as cookie from "cookie";
import {jwtDecode} from "jwt-decode";
import {LoginResponse, MyUserInfo} from "lemmy-js-client";
import {HttpService} from "./index";
import {toast} from "sonner";
import {authCookieName} from "@/utils/config";
import {VALID_LANGUAGES, LANGUAGE_COOKIE} from "@/constants/language";

export interface Claims {
  sub: number;
  iss: string;
  iat: number;
  email: string;
  role: string;
  lang: string;
  accepted_application: boolean
}

interface AuthInfo {
  claims?: Claims;
  auth: string;
  sharedKey?: string;
}

export class UserService {
  static #instance: UserService;
  public myUserInfo?: MyUserInfo;
  public authInfo?: AuthInfo;
  public currentLanguage: string = "th";
  public applicationPending: boolean = false;

  private constructor() {
    this.#setAuthInfo();
  }

  public static get Instance() {
    return this.#instance || (this.#instance = new this());
  }

  get getLanguage(): string {
    return this.currentLanguage;
  }

  get getApplicationPending(): boolean {
    return this.applicationPending;
  }

  get isLoggedIn() {
    return Boolean(this.authInfo?.auth);
  }


  public login({
    res,
    showToast = false,
    sharedKey,
  }: {
    res: LoginResponse | string;
    showToast?: boolean;
    sharedKey?: string;
  }) {
    if (isBrowser() && typeof res !== "string" && res.jwt) {
      if (showToast) {
        toast("loggedIn");
      }
      this.#setAuthInfo({sharedKey});
      setAuthCookie(res.jwt);

      if (!VALID_LANGUAGES.includes(this.currentLanguage)) return;
      document.cookie = `${LANGUAGE_COOKIE}=${this.currentLanguage}; path=/`;
      const langsPattern = `(?:${VALID_LANGUAGES.join('|')})`;
      const cleanPath = window.location.pathname.replace(new RegExp(`^/` + langsPattern + `\\b`), "");
      window.location.pathname = `/${this.currentLanguage}${cleanPath}`;

    } else {
      this.#setAuthInfo({rawCookie: res.toString()});
    }
  }

  public logout() {
    this.authInfo = undefined;
    this.myUserInfo = undefined;

    if (isBrowser()) {
      clearAuthCookie();
    }

    HttpService.client.logout();

    // TODO: Remove this in a few releases when this cache has been deleted from most users' browsers
    if (isBrowser()) {
      window.caches?.delete?.("instance-cache");
    }
    location.replace("/");
  }

  public auth(throwErr = false): string | undefined {
    const auth = this.authInfo?.auth;

    if (auth) {
      return auth;
    } else {
      const msg = "No JWT cookie found";

      if (throwErr && isBrowser()) {
        console.error(msg);
        toast("notLoggedIn");
      }

      return undefined;
      // throw msg;
    }
  }

  #setAuthInfo(opts: {rawCookie?: string; sharedKey?: string} = {},
  ) {
    const {rawCookie = "", sharedKey = ""} = opts;
    const auth = isBrowser() ? cookie.parse(document.cookie)[authCookieName] : rawCookie;
    if (!auth) {
      this.authInfo = undefined;
      this.currentLanguage = "en";
      return;
    }
    // Authorization header is handled by HttpService's per-token client pool
    const claims = jwtDecode<Claims>(auth);
    this.authInfo = {auth, claims, sharedKey};
    this.currentLanguage = claims?.lang;
    this.applicationPending = !claims?.accepted_application;
  }
}
