import { CommunityModeratorView } from "lemmy-js-client";
import {UserService} from "@/lib/services";


export default function amTopMod(
  mods: CommunityModeratorView[],
  myUserInfo = UserService.Instance.myUserInfo,
): boolean {
  return mods.at(0)?.moderator.id === myUserInfo?.local_user_view.person.id;
}
