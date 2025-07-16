import { BlockCommunityResponse, MyUserInfo } from "../../lib/lemmy-js-client";
import { toast } from "@/toast";
import {UserService} from "@/services";

export default function updateCommunityBlock(
  data: BlockCommunityResponse,
  myUserInfo: MyUserInfo | undefined = UserService.Instance.myUserInfo,
) {
  if (myUserInfo) {
    if (data.blocked) {
      myUserInfo.communityBlocks.push(data.communityView.community);
      toast(
        `blocked ${
          data.communityView.community.name
        }`,
      );
    } else {
      myUserInfo.communityBlocks = myUserInfo.communityBlocks.filter(
        c => c.id !== data.communityView.community.id,
      );
      toast(
        `unblocked ${
          data.communityView.community.name
        }`,
      );
    }
  }
}
