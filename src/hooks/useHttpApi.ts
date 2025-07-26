"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  EMPTY_REQUEST,
  RequestState,
  isSuccess,
  WrappedLemmyHttp,
  callHttp,
} from "@/services/HttpService";

/* ---------- utility types ---------- */
type Payload<K extends keyof WrappedLemmyHttp> =
  Awaited<ReturnType<WrappedLemmyHttp[K]>> extends RequestState<infer D>
    ? D
    : never;

/* ---------- main hook ---------- */
export const useHttpApi = <K extends keyof WrappedLemmyHttp>(method: K) => {
  /* local state (ยังคงไว้) */
  const [state, setState] = useState<RequestState<Payload<K>>>(EMPTY_REQUEST);

  /* สร้างฟังก์ชันกลางด้วย useCallback เพื่อให้ reference คงที่ */
  const doCall = useCallback(
    (...args: Parameters<WrappedLemmyHttp[K]>) => callHttp(method, ...args),
    [method],
  );

  const isGet = (method as string).startsWith("get");

  /* ---------- GET ---------- */
  const {
    data: swrState = EMPTY_REQUEST as RequestState<Payload<K>>,
    ...swrRest
  } = useSWR<RequestState<Payload<K>>>(isGet ? [method] : null, () =>
    // ส่งอาร์กิวเมนต์ว่าง ๆ ให้ถูกชนิด
    doCall(...([] as unknown as Parameters<WrappedLemmyHttp[K]>)),
  );

  /* ---------- MUTATION ---------- */
  const mutRes = useSWRMutation<
    RequestState<Payload<K>>,
    Error,
    readonly [K],
    Parameters<WrappedLemmyHttp[K]>
  >([method], (_key, { arg }) => doCall(...arg));

  /* ---------- execute ---------- */
  const execute = useCallback(
    async (...args: Parameters<WrappedLemmyHttp[K]>) => {
      // ✨ GET → เรียกตามปกติ
      if (isGet) {
        return doCall(...args);
      }

      // ✨ POST / PUT ฯลฯ → แคบประเภทของ trigger ก่อน
      const triggerWithArgs = mutRes.trigger as unknown as (
        ...a: Parameters<WrappedLemmyHttp[K]>
      ) => Promise<RequestState<Payload<K>>>;

      return await triggerWithArgs(...args);
    },
    [isGet, doCall, mutRes]
  );

  /* ---------- pick data ---------- */
  const data =
    (isSuccess(state) ? state.data : undefined) ??
    (isSuccess(swrState) ? swrState.data : undefined);

  return {
    data,
    state: isGet ? swrState : state,
    execute,
    isMutating: isGet ? false : mutRes.isMutating,
    ...swrRest,
  } as const;
};