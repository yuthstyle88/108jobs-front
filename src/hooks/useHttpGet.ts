import useSWR, { SWRConfiguration } from "swr";
import {
  callHttp,
  RequestState,
  WrappedLemmyHttp,
  Payload,
  EMPTY_REQUEST,
  REQUEST_STATE,
} from "@/services/HttpService";

/**
 * Hook ยิง GET (ใช้ SWR) แล้วจัดรูปแบบผลลัพธ์เหมือน useHttpPost
 *
 * @example
 * const { data, state, isMutating, execute } = useHttpGet("getSite", [123]);
 */
export const useHttpGet = <K extends keyof WrappedLemmyHttp>(
  method: K,
  args?: Parameters<WrappedLemmyHttp[K]>,                                 // ✅ เปลี่ยนจาก default value เป็น optional
  options?: SWRConfiguration<RequestState<Payload<K>>, Error>,
) => {
  /* ---------- key / fetcher ---------- */
  const key = [method, ...(args ?? [])] as const;

  const fetcher = async () => {
    try {
      // แปลง args ให้เป็น type ที่เมธอดต้องการเสมอ
      const typedArgs = (args ?? []) as Parameters<WrappedLemmyHttp[K]>;

      return (await callHttp(
        method,
        ...typedArgs
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
  const state = swr.data ?? EMPTY_REQUEST;
  const data =
    state.state === REQUEST_STATE.SUCCESS ? (state.data as Payload<K>) : null;

  /** ดึงข้อมูลใหม่ (revalidate) */
  const execute = () => swr.mutate();

  /** กำหนดให้ชื่อเดียวกับ useHttpPost */
  const isMutating = swr.isValidating;

  /* ---------- return ---------- */
  return {
    state,
    data,
    execute,
    isMutating,
  };
};