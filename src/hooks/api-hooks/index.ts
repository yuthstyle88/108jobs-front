import {
  axiosFileUpload,
  axiosPrivate,
  axiosPublic,
  axiosPublicV2,
} from "./../../lib/axios";
import type { AxiosError } from "axios";
import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";

type DynamicPutArgs<D> = {
  url: string;
  data: D;
};

// Public GET
export const usePublicFetch = <T>(url: string | null) => {
  return useSWR<T, AxiosError>(
    url,
    async (url: string) => (await axiosPublic.get<T>(url)).data,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      errorRetryCount: 3,
    }
  );
};
// Public GET V2
export const usePublicFetchV2 = <T>(url: string | null) => {
  const swr = useSWR<T, AxiosError>(
    url,
    async (url: string) => (await axiosPublicV2.get<T>(url)).data,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      errorRetryCount: 3,
    }
  );

  return {
    ...swr,
    refetch: swr.mutate,
  };
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
export const usePrivateFetch = <T>(
  url: string | null,
  options?: SWRConfiguration & { enabled?: boolean }
) => {
  const { enabled = true, ...restOptions } = options || {};

  return useSWR<T, AxiosError>(
    url && enabled ? url : null,
    url && enabled
      ? async (url: string) => (await axiosPrivate.get<T>(url)).data
      : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      keepPreviousData: true,
      ...restOptions,
    }
  );
};

// Private GET with params
export const usePrivateFetchParams = <T>(
  url: string | null,
  options?: SWRConfiguration
) => {
  const fetcher = async (url: string) => {
    const response = await axiosPrivate.get<T>(url);
    return response.data;
  };

  return useSWR<T, AxiosError>(url, url ? fetcher : null, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    keepPreviousData: true,
    ...options,
  });
};

// Private POST
export const usePrivatePost = <T, D = unknown>(url: string) => {
  return useSWRMutation<T, AxiosError, string, D>(
    url,
    async (url, { arg }) => (await axiosPrivate.post<T>(url, arg)).data
  );
};
export const usePrivateImagePost = <T, D = unknown>(url: string) => {
  return useSWRMutation<T, AxiosError, string, D>(
    url,
    async (url, { arg }) =>
      (
        await axiosFileUpload.post<T>(url, arg, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).data
  );
};

// Private PUT
export const usePrivatePut = <T, D = unknown>(url: string) => {
  return useSWRMutation<T, AxiosError, string, D>(
    url,
    async (url, { arg }) => (await axiosPrivate.put<T>(url, arg)).data
  );
};

export const useDynamicPrivatePut = <T = void, D = unknown>() => {
  return useSWRMutation<T, AxiosError, string, DynamicPutArgs<D>>(
    "dynamic-private-put", // key chỉ để định danh mutation, không ảnh hưởng
    async (_key, { arg }) => {
      const { url, data } = arg;
      const res = await axiosPrivate.put<T>(url, data);
      return res.data;
    }
  );
};

// Private DELETE
export const usePrivateDelete = <T, D = unknown>(url: string) => {
  return useSWRMutation<T, AxiosError, string, D>(
    url,
    async (url, { arg }) =>
      (await axiosPrivate.delete<T>(url, { data: arg })).data
  );
};
