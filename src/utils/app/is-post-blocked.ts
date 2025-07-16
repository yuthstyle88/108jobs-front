import { MyUserInfo, PostView } from "../../lib/lemmy-js-client";
import {UserService} from "@/services";

export default function isPostBlocked(
  pv: PostView,
  myUserInfo: MyUserInfo | undefined = UserService.Instance.myUserInfo,
): boolean {
  return (
    (myUserInfo?.communityBlocks.some(c => c.id === pv.community.id) ||
      myUserInfo?.personBlocks.some(p => p.id === pv.creator.id)) ??
    false
  );
}
