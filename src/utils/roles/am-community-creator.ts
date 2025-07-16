import { CommunityModeratorView } from "../../lib/lemmy-js-client";
import {UserService} from "@/services";


export default function amCommunityCreator(
  creatorId: number,
  mods?: CommunityModeratorView[],
  myUserInfo = UserService.Instance.myUserInfo,
): boolean {
  const myId = myUserInfo?.localUserView.person.id;
  // Don't allow mod actions on yourself
  return myId === mods?.at(0)?.moderator.id && myId !== creatorId;
}
