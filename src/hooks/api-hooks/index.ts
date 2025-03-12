import { axiosPrivate, axiosPublic } from "./../../lib/axios";
import type { AxiosError } from "axios";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

// Public GET
export const usePublicFetch = <T>(url: string | null) => {
  return useSWR<T, AxiosError>(
    url,
    async (url: string) => (await axiosPublic.get<T>(url)).data
  );
};

// Public POST
export const usePublicPost = <T, D = unknown>(url: string) => {
  return useSWRMutation<T, AxiosError, string, D>(
    url,
    async (url, { arg }) => (await axiosPublic.post<T>(url, arg)).data
  );
};

// Public PUT
export const usePublicPut = <T, D = unknown>(url: string) => {
  return useSWRMutation<T, AxiosError, string, D>(
    url,
    async (url, { arg }) => (await axiosPublic.put<T>(url, arg)).data
  );
};

// Public DELETE
export const usePublicDelete = <T>(url: string) => {
  return useSWRMutation<T, AxiosError, string>(url, async (url: string) => {
    const response = await axiosPublic.delete<T>(url);
    return response.data;
  });
};

// Private GET
export const usePrivateFetch = <T>(url: string | null) => {
  return useSWR<T, AxiosError>(
    url,
    async (url: string) => (await axiosPrivate.get<T>(url)).data
  );
};

// Private POST
export const usePrivatePost = <T, D = unknown>(url: string) => {
  return useSWRMutation<T, AxiosError, string, D>(
    url,
    async (url, { arg }) => (await axiosPrivate.post<T>(url, arg)).data
  );
};

// Private PUT
export const usePrivatePut = <T, D = unknown>(url: string) => {
  return useSWRMutation<T, AxiosError, string, D>(
    url,
    async (url, { arg }) => (await axiosPrivate.put<T>(url, arg)).data
  );
};

// Private DELETE
export const usePrivateDelete = <T>(url: string) => {
  return useSWRMutation<T, AxiosError, string>(url, async (url: string) => {
    const response = await axiosPrivate.delete<T>(url);
    return response.data;
  });
};
