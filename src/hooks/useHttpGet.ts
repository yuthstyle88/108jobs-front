import useSWR, { SWRConfiguration } from "swr";
import {callHttp, RequestState, WrappedLemmyHttp, Payload} from "@/services/HttpService";



export const useHttpGet = <K extends keyof WrappedLemmyHttp>(
  method: K,
  args: Parameters<WrappedLemmyHttp[K]>,
  options?: SWRConfiguration<RequestState<Payload<K>>, Error>,
) => {
  const key = [method, ...args] as const;

  const fetcher = () =>
    callHttp(method, ...args) as Promise<RequestState<Payload<K>>>;

  /* ใส่ generic <Data, Error> ให้ useSWR ตรง ๆ */
  return useSWR<RequestState<Payload<K>>, Error>(key, fetcher, {
    keepPreviousData: true,
    ...options,
  });
};