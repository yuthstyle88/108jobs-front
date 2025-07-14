import { BlockCommunityResponse, MyUserInfo } from "lemmy-js-client";
import { toast } from "@/toast";
import {UserService} from "@/lib/services";

export default function updateCommunityBlock(
  data: BlockCommunityResponse,
  myUserInfo: MyUserInfo | undefined = UserService.Instance.myUserInfo,
) {
  if (myUserInfo) {
    if (data.blocked) {
      myUserInfo.community_blocks.push(data.community_view.community);
      toast(
        `blocked ${
          data.community_view.community.name
        }`,
      );
    } else {
      myUserInfo.community_blocks = myUserInfo.community_blocks.filter(
        c => c.id !== data.community_view.community.id,
      );
      toast(
        `unblocked ${
          data.community_view.community.name
        }`,
      );
    }
  }
}
