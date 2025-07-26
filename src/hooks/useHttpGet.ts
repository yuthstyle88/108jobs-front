import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import {
  callHttp,
  RequestState,
  WrappedLemmyHttp,
  Payload,
  EMPTY_REQUEST,
  REQUEST_STATE,
} from "@/services/HttpService";

/**
 * Hook สำหรับยิง GET โดยใช้ SWR
 * อินเตอร์เฟซผลลัพธ์ให้เหมือน useHttpPost
 *
 * @example
 * const { data, state, isMutating, execute } = useHttpGet("getProfile", [123]);
 */
export const useHttpGet = <K extends keyof WrappedLemmyHttp>(
  method: K,
  args: Parameters<WrappedLemmyHttp[K]> = [] as unknown as Parameters<
    WrappedLemmyHttp[K]
  >,
  options?: SWRConfiguration<RequestState<Payload<K>>, Error>,
) => {
  /* ---------- key / fetcher ---------- */
  const key = [method, ...args] as const;

  const fetcher = async () => {
    try {
      return (await callHttp(
        method,
        ...args,
      )) as RequestState<Payload<K>>;
    } catch (err) {
      return {
        state: REQUEST_STATE.FAILED,
        err: err instanceof Error ? err : new Error("Unknown error"),
      } as RequestState<Payload<K>>;
    }
  };

  /* ---------- swr ---------- */
  const swr = useSWR<RequestState<Payload<K>>, Error>(key, fetcher, {
    keepPreviousData: true,
    ...options,
  });

  /* ---------- mapping ---------- */
  const state: RequestState<Payload<K>> = swr.data ?? EMPTY_REQUEST;
  const data =
    state.state === REQUEST_STATE.SUCCESS ? (state.data as Payload<K>) : null;

  const execute = () => swr.mutate();
  const isMutating = swr.isValidating; // ⚡️ ให้ผลเหมือน useHttpPost

  /* ---------- return ---------- */
  return {
    state,   // เหมือน useHttpGet
    data,    // data ที่สกัดออกเมื่อ success
    execute, // เรียกใช้งาน API
    isMutating,
  };
};