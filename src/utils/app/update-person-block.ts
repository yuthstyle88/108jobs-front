import { BlockPersonResponse, MyUserInfo } from "../../lib/lemmy-js-client";

import { toast } from "@/toast";
import {UserService} from "@/services";

export default function updatePersonBlock(
  data: BlockPersonResponse,
  myUserInfo: MyUserInfo | undefined = UserService.Instance.myUserInfo,
) {
  if (myUserInfo) {
    if (data.blocked) {
      myUserInfo.personBlocks.push(data.personView.person);
      toast(
        `blocked ${data.personView.person.name}`,
      );
    } else {
      myUserInfo.personBlocks = myUserInfo.personBlocks.filter(
        p => p.id !== data.personView.person.id,
      );
      toast(
        `unblocked ${data.personView.person.name}`,
      );
    }
  }
}
