import axios, {AxiosError, AxiosHeaders, InternalAxiosRequestConfig} from "axios";
import { getSession, signOut } from "next-auth/react";
import {jwtDecode, JwtPayload} from "jwt-decode";

let cachedAccessToken: string | null = null;

const isTokenExpired = (token?: string | null) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return Date.now() >= (exp ?? 0) * 1_000 - 60_000;
  } catch {
    return true;
  }
};

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
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

async function attachToken(
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
  /* 1. Refresh token if absent or near expiry */
  if (isTokenExpired(cachedAccessToken)) {
    const session = await getSession();
    cachedAccessToken = session?.accessToken ?? null;
  }

  /* 2. Append the token (if any) */
  if (cachedAccessToken) {
    // Ensure headers object exists
    config.headers = config.headers ?? {};

    // Compatible with both AxiosHeaders and plain object
    if (typeof (config.headers as any).set === "function") {
      (config.headers as any).set(
        "Authorization",
        `Bearer ${cachedAccessToken}`,
      );
    } else {
      (config.headers as Record<string, string>).Authorization =
        `Bearer ${cachedAccessToken}`;
    }
  }

  return config;
}

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

