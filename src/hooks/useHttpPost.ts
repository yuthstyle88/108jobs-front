import useSWRMutation, {
  SWRMutationConfiguration,
  SWRMutationResponse,
} from "swr/mutation";
import { callHttp, RequestState, WrappedLemmyHttp } from "@/services/HttpService";

/* ดึง payload ที่อยู่ข้างใน RequestState */
type Payload<K extends keyof WrappedLemmyHttp> =
  Awaited<ReturnType<WrappedLemmyHttp[K]>> extends RequestState<infer D>
    ? D
    : never;

/* ---------------- PUT / PATCH / POST ---------------- */
export const useHttpPost = <K extends keyof WrappedLemmyHttp>(
  method: K,
  options?: SWRMutationConfiguration<
    RequestState<Payload<K>>,
    Error,
    readonly [K],
    Parameters<WrappedLemmyHttp[K]>
  >
): SWRMutationResponse<
  RequestState<Payload<K>>,
  Error,
  readonly [K],
  Parameters<WrappedLemmyHttp[K]>
> & {
  execute: (
    ...args: Parameters<WrappedLemmyHttp[K]>
  ) => Promise<RequestState<Payload<K>>>;
} => {
  /* key เป็น tuple เพื่อไม่ชน hook อื่น */
  const key = [method] as const;

  /* mutator ต้องรับ key + { arg } */
  const mutator = async (
    _key: readonly [K],
    { arg }: { arg: Parameters<WrappedLemmyHttp[K]> }
  ): Promise<RequestState<Payload<K>>> =>
    callHttp(method, ...arg) as Promise<RequestState<Payload<K>>>;

  const mutRes = useSWRMutation(key, mutator, options);

  /* ยืนยันชนิดของ trigger แล้วห่อเป็น execute */
  const execute = (
    ...args: Parameters<WrappedLemmyHttp[K]>
  ): Promise<RequestState<Payload<K>>> => {
    /* narrowing ชนิดของ trigger ให้รับ arg ชนิดเดียวที่เราต้องการ */
    const safeTrigger = mutRes.trigger as unknown as (
      arg: Parameters<WrappedLemmyHttp[K]>
    ) => Promise<RequestState<Payload<K>>>;
    return safeTrigger(args);
  };

  return {
    ...mutRes,
    execute,
  };
};