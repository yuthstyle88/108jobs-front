import {UserService} from "@/services";


export default function amAdmin(
  myUserInfo = UserService.Instance.myUserInfo,
): boolean {
  return myUserInfo?.localUserView.localUser.admin ?? false;
}
