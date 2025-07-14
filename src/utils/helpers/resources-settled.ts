import {RequestState} from "@/lib/services/HttpService";

export default function resourcesSettled(resources: RequestState<any>[]) {
  return resources.every(r => r.state === "success" || r.state === "failed");
}
