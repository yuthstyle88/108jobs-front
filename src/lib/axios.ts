import useNotification from "@/hooks/useNotification";
import axios from "axios";
import { getSession } from "next-auth/react";

export const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPrivate.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export const axiosFileUpload = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosFileUpload.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

const handleAxiosError = (error: any) => {
  const { error_message } = useNotification();

  if (error.code === "ECONNABORTED") {
    error_message(null, null, "Connection took too long, please try again.");
  } else if (!error.response) {
    error_message(null, null, "No network connection, please check again.");
  }
  return Promise.reject(error);
};

axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => handleAxiosError(error)
);

axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => handleAxiosError(error)
);

axiosFileUpload.interceptors.response.use(
  (response) => response,
  (error) => handleAxiosError(error)
);
