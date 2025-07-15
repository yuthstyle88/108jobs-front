import axios, {AxiosError} from "axios";
import {jwtDecode, JwtPayload} from "jwt-decode";

let cachedAccessToken: string | null = null;

export const setCachedToken = (token: string | null) => {
  cachedAccessToken = token;
};

const BUFFER_MS = 60_000;     // 1 min safety-buffer

export function isTokenExpired(token?: string | null): boolean {
  console.log("🔍  raw token:", token);

  if (!token) {
    console.log("❌  token is undefined/null → treat as expired");
    return true;
  }

  try {
    /* ── decode ───────────────────────────────────────────── */
    const payload = jwtDecode<JwtPayload>(token);
    const expSec  = payload.exp ?? 0;          // epoch-seconds (0 = missing)
    const expMs   = expSec * 1_000;            // epoch-milliseconds

    /* ── timestamps ───────────────────────────────────────── */
    const nowMs   = Date.now();
    const nowIso  = new Date(nowMs).toISOString();
    const expIso  = new Date(expMs).toISOString();
    const diffMs  = expMs - nowMs;

    /* ── compare with buffer ─────────────────────────────── */
    const expired = nowMs >= expMs - BUFFER_MS;

    /* ── pretty log table ─────────────────────────────────── */
    console.table({
      nowMs,
      nowIso,
      expSec,
      expIso,
      diffMs,
      bufferMs: BUFFER_MS,
      expired,
    });
   console.log("expired", expired)
    return expired;
  } catch (err) {
    console.error("💥  jwtDecode failed:", err);
    return true;                               // malformed token ⇒ treat expired
  }
}

function createPublic(baseURL: string) {
  return axios.create({
    baseURL,
    timeout: 10_000,
    headers: { "Content-Type": "application/json" },
  });
}

export const axiosPublic   = createPublic(`${process.env.NEXT_PUBLIC_API_BASE_URL}`);
export const axiosPublicV2 = createPublic(`${process.env.NEXT_PUBLIC_API_BASE_URL_V2}`);


export const axiosPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_V2,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const attachToken = (config: any) => {
  const token = sessionStorage.getItem("jwt");
  console.log("expired", token)
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

axiosPrivate.interceptors.request.use(attachToken);
axiosPrivate.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      // if (error.response?.status === 401) {
      //   cachedAccessToken = null;
      //   const url = `${process.env.NEXT_PUBLIC_API_BASE_URL_V2}/account/auth/login`;
      //   await signOut({ callbackUrl: url});
      // }
      return Promise.reject(error);
    },
);

export const axiosFileUpload = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

axiosFileUpload.interceptors.request.use(attachToken);

