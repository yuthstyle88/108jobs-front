import {clearAuthCookie, isBrowser, setAuthCookie} from "@/utils/browser";
import * as cookie from "cookie";
import {jwtDecode} from "jwt-decode";
import {LoginResponse, MyUserInfo} from "lemmy-js-client";
import {HttpService} from "./index";
import {toast} from "sonner";
import {authCookieName} from "@/utils/config";
import {VALID_LANGUAGES, LANGUAGE_COOKIE} from "@/constants/language";
import {getClientCurrentLanguage} from "@/actions/getClientCurrentLanguage";

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
    // Precompiled languages pattern for URL handling
    static langsPattern: string = `(?:${VALID_LANGUAGES.join('|')})`;
    // Prevent duplicate work on repeated login calls with the same jwt
    private static lastProcessedJwt?: string;
    private static lastProcessedAt?: number;
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
                     showToast = true,
                     sharedKey,
                 }: {
        res: LoginResponse | string;
        showToast?: boolean;
        sharedKey?: string;
    }) {
        // If we are in a browser and got a LoginResponse with a jwt
        if (isBrowser() && typeof res !== "string" && res.jwt) {
            // Guard against duplicate processing of the same JWT within a short window
            const now = Date.now();
            if (
                UserService.lastProcessedJwt === res.jwt &&
                UserService.lastProcessedAt &&
                now - UserService.lastProcessedAt < 3000 // 3s window to suppress duplicates
            ) {
                // Still make sure sharedKey can be updated if needed
                this.#setAuthInfo({rawCookie: res.jwt, sharedKey});
                return;
            }
            UserService.lastProcessedJwt = res.jwt;
            UserService.lastProcessedAt = now;

            // Set cookie first, then update in-memory/auth headers using the fresh token
            setAuthCookie(res.jwt);
            this.#setAuthInfo({rawCookie: res.jwt, sharedKey});

            if (showToast) {
                try {
                    toast("loggedIn");
                } catch {
                }
            }

            // Handle language persistence and redirection using decoded currentLanguage
            const lang = getClientCurrentLanguage();

            // Only write cookie if changed to avoid duplicate cookie writes
            try {
                const currentCookie = document.cookie;
                const marker = `${LANGUAGE_COOKIE}=`;
                const existing = currentCookie
                    .split("; ")
                    .find((p) => p.startsWith(marker))?.slice(marker.length);
                if (existing !== lang) {
                    document.cookie = `${LANGUAGE_COOKIE}=${lang}; path=/`;
                }
            } catch {
                document.cookie = `${LANGUAGE_COOKIE}=${lang}; path=/`;
            }

            // Precompiled language pattern stored on class; fallback to compute if not present
            const langsPattern = UserService.langsPattern || `(?:${VALID_LANGUAGES.join('|')})`;
            const cleanPath = window.location.pathname.replace(new RegExp(`^/` + langsPattern + `\\b`), "");
            // Only redirect if needed
            const targetPath = `/${lang}${cleanPath}`;
            if (window.location.pathname !== targetPath) {
                // Use assign to record in history; avoid loops because we compare full path
                window.location.assign(targetPath);
            }
        } else {
            // Server-side or raw cookie string path
            this.#setAuthInfo({rawCookie: typeof res === 'string' ? res : "", sharedKey});
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
            // Only navigate in browser contexts
            location.replace("/");
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

    #setAuthInfo(opts: { rawCookie?: string; sharedKey?: string } = {},
    ) {
        const {rawCookie = "", sharedKey = ""} = opts;
        const cookieAuth = isBrowser() ? cookie.parse(document.cookie)[authCookieName] : undefined;
        const auth = cookieAuth || rawCookie;

        // Memoization: if same token as already set, only update sharedKey if changed
        if (this.authInfo?.auth && auth === this.authInfo.auth) {
            if (sharedKey && sharedKey !== this.authInfo.sharedKey) {
                this.authInfo = {...this.authInfo, sharedKey};
            }
            return;
        }

        if (!auth) {
            (HttpService.client as any).removeHeader?.("Authorization");
            this.authInfo = undefined;
            return;
        }

        HttpService.client.setHeaders({Authorization: `Bearer ${auth}`});
        let claims: Claims | undefined = undefined;
        try {
            claims = jwtDecode<Claims>(auth);
        } catch (_e) {
            // If decode fails, keep minimal auth to not break all flows
        }
        this.authInfo = {auth, claims, sharedKey};

        // Update derived fields with fallbacks
        const langFromToken = claims?.lang;
        this.currentLanguage = VALID_LANGUAGES.includes(String(langFromToken)) ? String(langFromToken) : this.currentLanguage || VALID_LANGUAGES[0];
        this.applicationPending = claims ? !claims.accepted_application : this.applicationPending;
    }
}
