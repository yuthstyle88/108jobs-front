import { PersonView } from "../../lib/lemmy-js-client";
import {UserService} from "@/services";

export default function amSiteCreator(
  creatorId: number,
  admins?: PersonView[],
  myUserInfo = UserService.Instance.myUserInfo,
): boolean {
  const myId = myUserInfo?.localUserView.person.id;
  return myId === admins?.at(0)?.person.id && myId !== creatorId;
}
