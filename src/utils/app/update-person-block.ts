import { BlockPersonResponse, MyUserInfo } from "lemmy-js-client";

import { toast } from "@/toast";
import {UserService} from "@/lib/services";

export default function updatePersonBlock(
  data: BlockPersonResponse,
  myUserInfo: MyUserInfo | undefined = UserService.Instance.myUserInfo,
) {
  if (myUserInfo) {
    if (data.blocked) {
      myUserInfo.person_blocks.push(data.person_view.person);
      toast(
        `blocked ${data.person_view.person.name}`,
      );
    } else {
      myUserInfo.person_blocks = myUserInfo.person_blocks.filter(
        p => p.id !== data.person_view.person.id,
      );
      toast(
        `unblocked ${data.person_view.person.name}`,
      );
    }
  }
}
