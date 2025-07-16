import { PostView } from "../../lib/lemmy-js-client";
import {UserService} from "@/services";

export default function nsfwCheck(
  pv: PostView,
  myUserInfo = UserService.Instance.myUserInfo,
): boolean {
  const nsfw = pv.post.nsfw || pv.community.nsfw;
  const myShowNsfw = myUserInfo?.localUserView.localUser.showNsfw ?? false;
  return !nsfw || (nsfw && myShowNsfw);
}
