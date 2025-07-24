import { useCallback, useEffect, useRef, useState } from "react";
import { callHttp, RequestState, WrappedLemmyHttp } from "@/services/HttpService";

/* ====== ➊ ประกาศโอเวอร์โหลดใหม่ =============================== */

/** เรียกโดยไม่ยิงทันที */
export function useHttpApi<
  K extends keyof WrappedLemmyHttp,
>(
  method: K
): {
  state: RequestState<Awaited<ReturnType<WrappedLemmyHttp[K]>>>;
  execute: (
    ...args: Parameters<WrappedLemmyHttp[K]>
  ) => Promise<Awaited<ReturnType<WrappedLemmyHttp[K]>>>;
};

/** เรียกและยิงทันที (รูปแบบเดิม) */
export function useHttpApi<
  K extends keyof WrappedLemmyHttp,
>(
  method: K,
  ...initialArgs: Parameters<WrappedLemmyHttp[K]>
): {
  state: RequestState<Awaited<ReturnType<WrappedLemmyHttp[K]>>>;
  execute: (
    ...args: Parameters<WrappedLemmyHttp[K]>
  ) => Promise<Awaited<ReturnType<WrappedLemmyHttp[K]>>>;
};

/* ====== ➋ อิมพลีเมนเตชันร่วม ================================ */
export function useHttpApi<
  K extends keyof WrappedLemmyHttp,
>(
  method: K,
  ...initialArgs: Parameters<WrappedLemmyHttp[K]>
) {
  type Resp = Awaited<ReturnType<WrappedLemmyHttp[K]>>;

  const [state, setState] = useState<Resp | RequestState<never>>({
    state: "empty",
  } as Resp);

  const cancelRef = useRef<{ cancelled: boolean }>({ cancelled: false });

  const execute = useCallback(
    async (...args: Parameters<WrappedLemmyHttp[K]>) => {
      // ยกเลิกงานก่อนหน้า
      cancelRef.current.cancelled = true;
      cancelRef.current = { cancelled: false };

      setState({ state: "loading" } as Resp);

      try {
        const res = (await callHttp(method, ...args)) as Resp;
        if (!cancelRef.current.cancelled) setState(res);
        return res;
      } catch (err) {
        if (!cancelRef.current.cancelled) {
          setState({ state: "failed", err: err as Error } as unknown as Resp);
        }
        throw err;
      }
    },
    [method],
  );

  useEffect(() => {
    if (initialArgs.length) execute(...initialArgs);
    return () => {
      cancelRef.current.cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { state, execute };
}