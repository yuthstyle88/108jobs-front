import axios, {AxiosError} from "axios";
import {jwtDecode, JwtPayload} from "jwt-decode";

let cachedAccessToken: string | null = null;

export const setCachedToken = (token: string | null) => {
  cachedAccessToken = token;
};

export function isTokenExpired(token?: string | null): boolean {
  if (!token) return true;

  try {
    const { exp = 0 } = jwtDecode<JwtPayload>(token);
    return Date.now() >= exp * 1000 - BUFFER_MS;
  } catch {
    return true;
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

