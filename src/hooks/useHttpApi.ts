import {
  EMPTY_REQUEST,
  LOADING_REQUEST,
  REQUEST_STATE,
  type RequestState,
} from "@/services/HttpService";
import {useCallback, useEffect, useRef, useState} from "react";
import {callHttp, type WrappedLemmyHttp} from "@/services/HttpService";

/* ---------- overloads (แก้ type ให้ถูกชั้น) ---------------- */
export function useHttpApi<K extends keyof WrappedLemmyHttp>(
  method: K,
): {
  state: RequestState<
    // <--- ดึงชนิดข้อมูลที่ซ่อนอยู่ใน RequestState อีกที
    Awaited<ReturnType<WrappedLemmyHttp[K]>> extends RequestState<infer U>
      ? U
      : never
  >;
  execute: (
    ...args: Parameters<WrappedLemmyHttp[K]>
  ) => Promise<
    RequestState<
      Awaited<ReturnType<WrappedLemmyHttp[K]>> extends RequestState<infer U>
        ? U
        : never
    >
  >;
};

export function useHttpApi<K extends keyof WrappedLemmyHttp>(
  method: K,
  ...initialArgs: Parameters<WrappedLemmyHttp[K]>
): {
  state: RequestState<
    Awaited<ReturnType<WrappedLemmyHttp[K]>> extends RequestState<infer U>
      ? U
      : never
  >;
  execute: (
    ...args: Parameters<WrappedLemmyHttp[K]>
  ) => Promise<
    RequestState<
      Awaited<ReturnType<WrappedLemmyHttp[K]>> extends RequestState<infer U>
        ? U
        : never
    >
  >;
};

/* ---------- implementation --------------------------------- */
export function useHttpApi<K extends keyof WrappedLemmyHttp>(
  method: K,
  ...initialArgs: Parameters<WrappedLemmyHttp[K]>
) {
  type RawReturn = Awaited<ReturnType<WrappedLemmyHttp[K]>>; // RequestState<T>
  type Data = RawReturn extends RequestState<infer U> ? U : never;
  type Resp = RequestState<Data>;

  const [state, setState] = useState<Resp>(EMPTY_REQUEST as Resp);
  const cancelRef = useRef({cancelled: false});

  const execute = useCallback(
    async(...args: Parameters<WrappedLemmyHttp[K]>): Promise<Resp> => {
      cancelRef.current.cancelled = true;
      cancelRef.current = {cancelled: false};

      setState(LOADING_REQUEST as Resp);

      try {
        // callHttp คืนค่ามาเป็น RequestState<Data> อยู่แล้ว
        const result = await callHttp(method,
          ...args) as Resp;

        if (!cancelRef.current.cancelled) setState(result);
        return result;
      } catch (e) {
        const failed: Resp = {
          state: REQUEST_STATE.FAILED,
          err: e as Error,
        };
        if (!cancelRef.current.cancelled) setState(failed);
        return failed;
      }
    },
    [method],
  );

  /* auto-run เมื่อมี initialArgs */
  useEffect(() => {
      if (initialArgs.length) execute(...initialArgs);
      return () => {
        cancelRef.current.cancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []);

  return {state, execute};
}