import { CommunityModeratorView } from "../../lib/lemmy-js-client";
import {UserService} from "@/services";


export default function amTopMod(
  mods: CommunityModeratorView[],
  myUserInfo = UserService.Instance.myUserInfo,
): boolean {
  return mods.at(0)?.moderator.id === myUserInfo?.localUserView.person.id;
}
