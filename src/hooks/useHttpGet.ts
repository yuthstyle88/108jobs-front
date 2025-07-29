import { useGlobalLoader } from "@/contexts/GlobalLoaderContext";
import useSWR, { SWRConfiguration } from "swr";
import {
  RequestState,
  WrappedLemmyHttp,
  Payload,
  EMPTY_REQUEST,
  REQUEST_STATE,
  callHttp,
} from "@/services/HttpService";

/* ---------- implementation ---------- */
export function useHttpGet<K extends keyof WrappedLemmyHttp>(
  method: K,
  argsOrOptions?:
    | Parameters<WrappedLemmyHttp[K]>
    | SWRConfiguration<RequestState<Payload<K>>, Error>,
  maybeOptions?: SWRConfiguration<RequestState<Payload<K>>, Error>,
) {
  const { setLoading } = useGlobalLoader(); // ใช้ Loader

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
    setLoading(true); // แสดง Loader
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
    } finally {
      setLoading(false); // ปิด Loader
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