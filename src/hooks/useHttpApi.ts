import { EMPTY_REQUEST, LOADING_REQUEST } from "@/services/HttpService";
import { useCallback, useEffect, useRef, useState } from "react";
import { callHttp, WrappedLemmyHttp } from "@/services/HttpService";
import type { RequestState } from "@/services/HttpService";

/* ---------- overloads ---------------------------- */
export function useHttpApi<K extends keyof WrappedLemmyHttp>(
  method: K
): {
  state: RequestState<Awaited<ReturnType<WrappedLemmyHttp[K]>>>;
  execute: (
    ...args: Parameters<WrappedLemmyHttp[K]>
  ) => Promise<RequestState<Awaited<ReturnType<WrappedLemmyHttp[K]>>>>;
};

export function useHttpApi<K extends keyof WrappedLemmyHttp>(
  method: K,
  ...initialArgs: Parameters<WrappedLemmyHttp[K]>
): {
  state: RequestState<Awaited<ReturnType<WrappedLemmyHttp[K]>>>;
  execute: (
    ...args: Parameters<WrappedLemmyHttp[K]>
  ) => Promise<RequestState<Awaited<ReturnType<WrappedLemmyHttp[K]>>>>;
};

/* ---------- implementation ----------------------- */
export function useHttpApi<K extends keyof WrappedLemmyHttp>(
  method: K,
  ...initialArgs: Parameters<WrappedLemmyHttp[K]>
) {
  type Data = Awaited<ReturnType<WrappedLemmyHttp[K]>>;
  type Resp = RequestState<Data>;

  const [state, setState] = useState<Resp>(EMPTY_REQUEST as Resp);
  const cancelRef = useRef({ cancelled: false });

  const execute = useCallback(
    async (...args: Parameters<WrappedLemmyHttp[K]>): Promise<Resp> => {
      cancelRef.current.cancelled = true;
      cancelRef.current = { cancelled: false };

      setState(LOADING_REQUEST as Resp);

      try {
        const data = await callHttp(method, ...args);
        const success: Resp = { state: "success", data };
        if (!cancelRef.current.cancelled) setState(success);
        return success;
      } catch (e) {
        const failed: Resp = { state: "failed", err: e as Error };
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
  }, []);

  return { state, execute };
}