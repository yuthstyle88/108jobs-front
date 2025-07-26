"use client";

import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  EMPTY_REQUEST,
  RequestState,
  isSuccess,
  WrappedLemmyHttp,
  callHttp,
} from "@/services/HttpService";

/* ============================================================
 *  utility – ประเภทข้อมูลผลลัพธ์จริง
 * ========================================================== */
type Payload<K extends keyof WrappedLemmyHttp> =
  Awaited<ReturnType<WrappedLemmyHttp[K]>> extends RequestState<infer D>
    ? D
    : never;

/* ============================================================
 *  utility – trigger function type
 * ========================================================== */
type TriggerFn<K extends keyof WrappedLemmyHttp> = (
  args: Parameters<WrappedLemmyHttp[K]>
) => Promise<RequestState<Payload<K>>>;

/* ============================================================
 *  main hook – รับ **เพียง 1** อาร์กิวเมนต์ (method) เท่านั้น
 * ========================================================== */
export const useHttpApi = <K extends keyof WrappedLemmyHttp>(
  method: K,
) => {
  /* ---------- local state ---------- */
  const [state, setState] = useState<RequestState<Payload<K>>>(
    EMPTY_REQUEST as RequestState<Payload<K>>,
  );

  const isGetMethod = (method as string).startsWith("get");
  const { data: swrData, ...swrRest } = useSWR<RequestState<Payload<K>>>(
    isGetMethod ? [method] : null,
    // 👉 แคสต์ [] ให้ตรงชนิด Tuple ของเมธอดนั้น ๆ
    () => callHttp(method, ...([] as unknown as Parameters<WrappedLemmyHttp[K]>)),
  );

  /* ---------- SWR-Mutation: เรียก “เสมอ” แต่ปิดด้วย key = null ---------- */
  const mutRes = useSWRMutation<
    RequestState<Payload<K>>,
    Error,
    readonly [K],
    Parameters<WrappedLemmyHttp[K]>
  >(
    [method],                                 // ✅ ส่ง key เสมอ
    (_key, { arg }) => callHttp(method, ...arg),
  );

  // map ค่าออกมาให้ API ภายนอกเหมือนเดิม
  const trigger: TriggerFn<K> | undefined = isGetMethod
    ? undefined
    : (mutRes.trigger as TriggerFn<K>);
  const isMutating = isGetMethod ? false : mutRes.isMutating;

  /* ---------- execute ---------- */
  const execute: (...args: Parameters<WrappedLemmyHttp[K]>) => Promise<
    RequestState<Payload<K>>
  > = (...args) =>
    isGetMethod
      ? callHttp(method, ...args)               // ✅ กรณี GET
      : trigger!(args as Parameters<WrappedLemmyHttp[K]>); // ✅ กรณีอื่น ๆ แน่ใจว่าไม่ undefined

  /* ---------- รวมผลลัพธ์ ---------- */
  const swrState: RequestState<Payload<K>> =
    swrData ?? (EMPTY_REQUEST as RequestState<Payload<K>>);

  const data =
    (isSuccess(state) ? state.data : undefined) ??
    (isSuccess(swrState) ? swrState.data : undefined);

  /* ---------- คืนค่า ---------- */
  return {
    data,
    state: isGetMethod ? swrState : state,
    execute,
    isMutating,
    ...swrRest,
  } as const;
};