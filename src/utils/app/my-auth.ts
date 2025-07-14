
// Warning, do not use this in fetchInitialData
import {UserService} from "@/lib/services";

export default function myAuth(): string | undefined {
  return UserService.Instance.auth();
}
