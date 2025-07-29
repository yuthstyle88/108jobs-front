import { useMemo } from "react";
import useSWRMutation from "swr/mutation";
import {
  EMPTY_REQUEST,
  REQUEST_STATE,
  RequestState,
  WrappedLemmyHttp,
  Payload,
  callHttp,
} from "@/services/HttpService";
import { useGlobalLoader } from "@/contexts/GlobalLoaderContext";

/**
 * Hook สำหรับเรียก API แบบ imperative (POST / PUT / PATCH / DELETE)
 * พร้อมการผนวก Global Loading
 *
 * @example
 * const { execute, data, isMutating } = useHttpPost("uploadImage");
 * await execute({ file });
 */
export const useHttpPost = <K extends keyof WrappedLemmyHttp>(method: K) => {
  /** ใช้ GlobalLoaderContext */
  const { setLoading } = useGlobalLoader();

  /** SWR Mutation */
  const {
    trigger, // ฟังก์ชันที่ใช้ยิง API
    data: state = EMPTY_REQUEST, // State ที่ SWR เก็บให้
    isMutating, // กำลัง execute request หรือไม่
  } = useSWRMutation<
    RequestState<Payload<K>>, // ค่า State ที่ SWR เก็บ
    Error, // ประเภท Error
    string, // Key ที่เป็น string
    Parameters<WrappedLemmyHttp[K]> // Argument (Tuple) ที่จะส่งไป
  >(
    `${String(method)}-http-post`, // ใช้ชื่อเมธอดเป็น Key เพื่อไม่ชน Cache ของตัวอื่น
    async (_key, { arg }) => {
      setLoading(true); // เริ่มแสดง Global Loader
      try {
        // เรียก API ผ่าน callHttp
        return await (callHttp(method, ...arg) as Promise<
          RequestState<Payload<K>>
        >);
      } catch (e) {
        // ดักจับและแปลงข้อผิดพลาดให้อยู่ในรูป RequestState
        return {
          state: REQUEST_STATE.FAILED,
          err: e instanceof Error ? e : new Error("Unknown error"),
        } as RequestState<Payload<K>>;
      } finally {
        setLoading(false); // ซ่อน Global Loader
      }
    },
    {
      revalidate: false, // ไม่ต้อง revalidate อัตโนมัติหลัง mutation
    },
  );

  /** data ที่สกัดจาก SUCCESS State */
  const data = useMemo(
    () =>
      state.state === REQUEST_STATE.SUCCESS
        ? (state.data as Payload<K>)
        : null,
    [state],
  );

  /** Execute Function (Trigger API) */
  const execute = (...args: Parameters<WrappedLemmyHttp[K]>) => {
    if (args.length === 0) {
      /* ❱ ใช้ trigger แบบไม่มี Argument */
      return (trigger as () => Promise<RequestState<Payload<K>>> )();
    }

    /* ❱ ใช้ trigger แบบมี Argument */
    type TriggerWithArgs = (
      arg: Parameters<WrappedLemmyHttp[K]>,
      options?: unknown
    ) => Promise<RequestState<Payload<K>>>;

    return (trigger as TriggerWithArgs)(args);
  };

  return {
    state, // เก็บ State ทั้งหมด (empty / loading / failed / success)
    data, // Data ที่แปะออกเมื่อ Success
    execute, // ฟังก์ชันที่ใช้ยิง Request
    isMutating, // กำลังยิง Request อยู่หรือไม่
  };
};