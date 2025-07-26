import { useState, useCallback } from "react";
import {
  callHttp,
  RequestState,
  WrappedLemmyHttp,
  Payload,
  LOADING_REQUEST,
  EMPTY_REQUEST, REQUEST_STATE,
} from "@/services/HttpService";

/**
 * Hook สำหรับเรียก API แบบ imperative (POST / PUT / PATCH / DELETE)
 * ผลลัพธ์มีรูปแบบเหมือน useHttpGet
 *
 * @example
 * const { state, data, execute, isMutating } = useHttpApi("updateAvailable");
 * await execute({ available: true });
 */
export const useHttpPost = <K extends keyof WrappedLemmyHttp>(method: K) => {
  const [state, setState] = useState<RequestState<Payload<K>>>(EMPTY_REQUEST);
  const [isMutating, setIsMutating] = useState(false);

  const execute = useCallback(
    async (...args: Parameters<WrappedLemmyHttp[K]>) => {
      try {
        setIsMutating(true);
        setState(LOADING_REQUEST as RequestState<Payload<K>>);

        const res = (await callHttp(
          method,
          ...args,
        )) as RequestState<Payload<K>>;

        setState(res);
        return res;
      } catch (err) {
        const failed: RequestState<Payload<K>> = {
          state: REQUEST_STATE.FAILED,
          err: err instanceof Error ? err : new Error("Unknown error"),
        } as any;
        setState(failed);
        return failed;
      } finally {
        setIsMutating(false);
      }
    },
    [method],
  );

  const data =
    state.state === REQUEST_STATE.SUCCESS ? (state.data as Payload<K>) : null;

  return {
    state,   // เหมือน useHttpGet
    data,    // data ที่สกัดออกเมื่อ success
    execute, // เรียกใช้งาน API
    isMutating,
  };
};