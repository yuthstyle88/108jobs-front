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

/* ---------- overloads ---------- */
export function useHttpGet<K extends keyof WrappedLemmyHttp>(
  method: K,
  options?: SWRConfiguration<RequestState<Payload<K>>, Error>,
): {
  state: RequestState<Payload<K>>;
  data: Payload<K> | null;
  execute: () => Promise<RequestState<Payload<K>> | undefined>;
  isMutating: boolean;
};
export function useHttpGet<K extends keyof WrappedLemmyHttp>(
  method: K,
  args: Parameters<WrappedLemmyHttp[K]>,
  options?: SWRConfiguration<RequestState<Payload<K>>, Error>,
): {
  state: RequestState<Payload<K>>;
  data: Payload<K> | null;
  execute: () => Promise<RequestState<Payload<K>> | undefined>;
  isMutating: boolean;
};

/* ---------- implementation ---------- */
export function useHttpGet<K extends keyof WrappedLemmyHttp>(
  method: K,
  argsOrOptions?:
    | Parameters<WrappedLemmyHttp[K]>
    | SWRConfiguration<RequestState<Payload<K>>, Error>,
  maybeOptions?: SWRConfiguration<RequestState<Payload<K>>, Error>,
) {
  /* ---------- resolve param / options ---------- */
  const args = Array.isArray(argsOrOptions)
    ? (argsOrOptions as Parameters<WrappedLemmyHttp[K]>)
    : undefined;

  const options = Array.isArray(argsOrOptions)
    ? maybeOptions
    : (argsOrOptions as SWRConfiguration<
        RequestState<Payload<K>>,
        Error
      > | undefined);

  /* ---------- key / fetcher ---------- */
  const key = [method, ...(args ?? [])] as const;

  const fetcher = async () => {
    try {
      const typedArgs = (args ?? []) as Parameters<WrappedLemmyHttp[K]>;
      return (await callHttp(
        method,
        ...typedArgs,
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
    revalidateOnFocus: false,
    ...options,
  });

  /* ---------- mapping ---------- */
  const state = swr.data ?? EMPTY_REQUEST;
  const data =
    state.state === REQUEST_STATE.SUCCESS ? (state.data as Payload<K>) : null;

  const execute = () => swr.mutate();
  const isMutating = swr.isValidating;

  return { state, data, execute, isMutating };
}