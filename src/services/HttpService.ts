import { LemmyHttp } from "lemmy-js-client";
import { getHttpBase } from "@/utils/env";

/* ---------- static states ----------------------------------- */
export const EMPTY_REQUEST = {
  state: "empty",
} as const;
export type EmptyRequestState = typeof EMPTY_REQUEST;

export const LOADING_REQUEST = {
  state: "loading",
} as const;
type LoadingRequestState = typeof LOADING_REQUEST;

/* ---------- union-state helpers ----------------------------- */
export const REQUEST_STATE = {
  EMPTY: EMPTY_REQUEST.state,        // "empty"
  LOADING: LOADING_REQUEST.state,    // "loading"
  FAILED: "failed",
  SUCCESS: "success",
} as const;
export type RequestStateKey =
  (typeof REQUEST_STATE)[keyof typeof REQUEST_STATE];

/* ---------- concrete states --------------------------------- */
export type FailedRequestState = {
  state: typeof REQUEST_STATE.FAILED;        // <-- ใช้คอนสแตนต์
  err: Error;
};

type SuccessRequestState<T> = {
  state: typeof REQUEST_STATE.SUCCESS;       // <-- ใช้คอนสแตนต์
  data: T;
};

export function isSuccess<T>(
  r: RequestState<T>,
): r is Extract<RequestState<T>, { state: typeof REQUEST_STATE.SUCCESS }> {
  return r.state === REQUEST_STATE.SUCCESS;
}

/**
 * Shows the state of an API request.
 *
 * Can be empty, loading, failed, or success
 */
export type RequestState<T> =
  | EmptyRequestState
  | LoadingRequestState
  | FailedRequestState
  | SuccessRequestState<T>;

/* ============================================================ */

export type WrappedLemmyHttp = WrappedLemmyHttpClient & {
  [K in keyof LemmyHttp]: LemmyHttp[K] extends (...args: any[]) => any
    ? ReturnType<LemmyHttp[K]> extends Promise<infer U>
      ? (...args: Parameters<LemmyHttp[K]>) => Promise<RequestState<U>>
      : (...args: Parameters<LemmyHttp[K]>) => Promise<RequestState<LemmyHttp[K]>>
    : LemmyHttp[K];
};

class WrappedLemmyHttpClient {
  rawClient: LemmyHttp;
  [prop: string]: any;

  constructor(client: LemmyHttp) {
    this.rawClient = client;

    for (const key of Object.getOwnPropertyNames(
      Object.getPrototypeOf(this.rawClient),
    )) {
      if (key !== "constructor") {
        this[key] = async (
          ...args: Parameters<LemmyHttp[keyof LemmyHttp]>
        ) => {
          /* -- return loading state first --------------------- */
          const loadingPromise = Promise.resolve(LOADING_REQUEST);

          /* -- actual request -------------------------------- */
          const resultPromise = (async () => {
            try {
              const res = await (this.rawClient as any)[key](...args);
              return {
                data: res,
                state:
                  res !== undefined && res !== null
                    ? REQUEST_STATE.SUCCESS
                    : REQUEST_STATE.EMPTY,
              };
            } catch (error) {
              return {
                state: REQUEST_STATE.FAILED,
                err: error as Error,
              };
            }
          })();

          return loadingPromise.then(() => resultPromise);
        };
      }
    }
  }
}

/* ------------------ public helpers -------------------------- */
export function wrapClient(client: LemmyHttp) {
  return new WrappedLemmyHttpClient(client) as unknown as WrappedLemmyHttp;
}

export class HttpService {
  static #_instance: HttpService;
  #client: WrappedLemmyHttp;

  private constructor() {
    const lemmyHttp = new LemmyHttp(getHttpBase());
    this.#client = wrapClient(lemmyHttp);
  }

  static get #Instance() {
    return this.#_instance ?? (this.#_instance = new this());
  }

  public static get client() {
    return this.#Instance.#client;
  }
}

/* ===== Generic helper ======================================= */
export function callHttp<
  K extends keyof WrappedLemmyHttp,
>(
  method: K,
  ...args: Parameters<WrappedLemmyHttp[K]>
): ReturnType<WrappedLemmyHttp[K]> {
  return HttpService.client[method](...args) as ReturnType<
    WrappedLemmyHttp[K]
  >;
}