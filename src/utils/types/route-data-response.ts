import {RequestState} from "@/lib/services/HttpService";

export type RouteDataResponse<T extends Record<string, any>> = {
  [K in keyof T]: RequestState<T[K]>;
};
