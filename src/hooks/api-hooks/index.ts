import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { axiosClient } from "../../lib/axios";

type ApiResponse<T> = T;

const fetcher = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await axiosClient.get<ApiResponse<T>>(url);
  return response.data;
};

export const useFetch = <T>(url: string) => {
  const { data, isLoading, error, mutate } = useSWR<ApiResponse<T>>(url, fetcher<T>);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

type PostData = Record<string, unknown>;

const postFetcher = async <T>(url: string, { arg }: { arg: PostData }): Promise<ApiResponse<T>> => {
  const response = await axiosClient.post<ApiResponse<T>>(url, arg);
  return response.data;
};

export const usePost = <T>(url: string) => {
  const { trigger, isMutating, error } = useSWRMutation<ApiResponse<T>, Error, string, { arg: PostData }>(
    url,
    postFetcher
  );

  return {
    postData: (data: PostData) => trigger({ arg: data }),
    isMutating,
    error,
  };
};

type PutData = Record<string, unknown>;

const putFetcher = async <T>(url: string, { arg }: { arg: PutData }): Promise<ApiResponse<T>> => {
  const response = await axiosClient.put<ApiResponse<T>>(url, arg);
  return response.data;
};

export const usePut = <T>(url: string) => {
  const { trigger, isMutating, error } = useSWRMutation<ApiResponse<T>, Error, string, { arg: PutData }>(
    url,
    putFetcher
  );

  return {
    updateData: (data: PutData) => trigger({ arg: data }),
    isMutating,
    error,
  };
};

const deleteFetcher = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await axiosClient.delete<ApiResponse<T>>(url);
  return response.data;
};

export const useDelete = <T>(url: string) => {
  const { trigger, isMutating, error } = useSWRMutation<ApiResponse<T>, Error>(url, deleteFetcher);

  return {
    deleteData: () => trigger(),
    isMutating,
    error,
  };
};
