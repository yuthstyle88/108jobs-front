import {UserService} from "@/services";


export default function showAvatars(
  myUserInfo = UserService.Instance.myUserInfo,
): boolean {
  return myUserInfo?.localUserView.localUser.showAvatars ?? true;
}
