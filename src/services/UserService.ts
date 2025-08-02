import {isAuthPath} from "@/utils/app";
import {clearAuthCookie, isBrowser, setAuthCookie} from "@/utils/browser";
import * as cookie from "cookie";
import {jwtDecode} from "jwt-decode";
import {LoginResponse, MyUserInfo} from "lemmy-js-client";
import {amAdmin} from "@/utils/roles";
import {HttpService} from "./index";
import {authCookieName} from "@/config";
import {toast} from "sonner";

interface Claims {
  sub: number;
  iss: string;
  iat: number;
  email: string;
  role: string;
  lang: string;
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

  private constructor() {
    this.#setAuthInfo();
  }

  public static get Instance() {
    return this.#instance || (this.#instance = new this());
  }

  get getLanguage(): string {
    return this.currentLanguage;
  }

  get isLoggedIn() {
    return Boolean(this.authInfo?.auth);
  }

  public get moderatesSomething(): boolean {
    return amAdmin() || (this.myUserInfo?.moderates?.length ?? 0) > 0;
  }

  public login({
    res,
    showToast = true,
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
      setAuthCookie(res.jwt, this.getLanguage);
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

    if (isAuthPath(location.pathname)) {
      location.replace("/");
    } else {
      location.reload();
    }
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
      HttpService.client.removeHeader?.("Authorization");
      this.authInfo = undefined;
      this.currentLanguage = "th";
      return;
    }
    HttpService.client.setHeaders({Authorization: `Bearer ${auth}`});
    const claims = jwtDecode<Claims>(auth);
    this.authInfo = {auth, claims, sharedKey};
    this.currentLanguage = claims?.lang;
  }
}
