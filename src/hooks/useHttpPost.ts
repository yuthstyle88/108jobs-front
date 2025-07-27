import { useMemo } from "react";
import useSWRMutation from "swr/mutation";
import {
  callHttp,
  EMPTY_REQUEST,
  REQUEST_STATE,
  RequestState,
  WrappedLemmyHttp,
  Payload,
} from "@/services/HttpService";

/**
 * Hook สำหรับเรียก API แบบ imperative (POST / PUT / PATCH / DELETE)
 *   • ย้ายมาใช้ useSWRMutation เพื่อลดโค้ดจัดการ state เอง  
 *   • interface การใช้งาน (execute / isMutating / data) ยังคงเหมือนเดิม
 *
 * @example
 * const { execute, data, isMutating } = useHttpPost("uploadImage");
 * await execute({ file });
 */
export const useHttpPost = <K extends keyof WrappedLemmyHttp>(method: K) => {
  /** SWR Mutation */
  const {
    trigger,                    // ฟังก์ชันยิง request
    data: state = EMPTY_REQUEST, // state (RequestState) ที่ SWR เก็บให้
    isMutating,                 // กำลัง request หรือไม่
  } = useSWRMutation<
    RequestState<Payload<K>>,           // data ที่ SWR เก็บ
    Error,                              // error (เรา wrap ลงใน RequestState อยู่แล้ว)
    string,                             // key ชนิด string
    Parameters<WrappedLemmyHttp[K]>     // arg (tuple ของพารามิเตอร์)
  >(
    // ใช้ method เป็น key เพื่อไม่ชน cache ของ method อื่น
    `${String(method)}-http-post`,
    async (_key, { arg }) => {
      try {
        // callHttp จะคืนค่าเป็น RequestState<Payload<K>>
        return await (callHttp(method, ...arg) as Promise<
          RequestState<Payload<K>>
        >);
      } catch (e) {
        // แปลง error ให้อยู่ในรูป FAILED state
        return {
          state: REQUEST_STATE.FAILED,
          err: e instanceof Error ? e : new Error("Unknown error"),
        } as RequestState<Payload<K>>;
      }
    },
    {
      revalidate: false, // ไม่ต้อง revalidate อัตโนมัติหลัง mutation
    },
  );

  /** data ที่สกัดจาก SUCCESS state */
  const data = useMemo(
    () =>
      state.state === REQUEST_STATE.SUCCESS
        ? (state.data as Payload<K>)
        : null,
    [state],
  );

  /** execute: adapter เพื่อคง signature เดิม (return RequestState) */
  const execute = (...args: Parameters<WrappedLemmyHttp[K]>) => {
    if (args.length === 0) {
      /*  ❱ กรณีเมธอดไม่มีอาร์กิวเมนต์ (tuple = []) */
      return (trigger as () => Promise<RequestState<Payload<K>>> )();
    }

    /*  ❱ กรณีเมธอดมีอาร์กิวเมนต์  
        – สร้าง alias ให้ trigger เป็นฟังก์ชันที่รับ tuple เดียวอย่างชัดเจน
        – ป้องกัน TS2349 caused by ambiguous overload union            */
    type TriggerWithArgs = (
      arg: Parameters<WrappedLemmyHttp[K]>,
      options?: unknown
    ) => Promise<RequestState<Payload<K>>>;

    return (trigger as TriggerWithArgs)(args);
  };

  return {
    state,    // RequestState (empty / loading / failed / success)
    data,     // data ที่แปะออกเมื่อ success
    execute,  // ฟังก์ชันยิง request
    isMutating,
  };
};