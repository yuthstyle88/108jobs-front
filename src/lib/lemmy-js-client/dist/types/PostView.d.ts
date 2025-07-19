import type { Community } from "./Community";
import type { CommunityActions } from "./CommunityActions";
import type { ImageDetails } from "./ImageDetails";
import type { InstanceActions } from "./InstanceActions";
import type { Person } from "./Person";
import type { PersonActions } from "./PersonActions";
import type { Post } from "./Post";
import type { PostActions } from "./PostActions";
import type { TagsView } from "./TagsView";
/**
 * A post view.
 */
export type PostView = {
    post: Post;
    creator: Person;
    community: Community;
    image_details?: ImageDetails;
    community_actions?: CommunityActions;
    person_actions?: PersonActions;
    post_actions?: PostActions;
    instance_actions?: InstanceActions;
    creatorIsAdmin: boolean;
    tags: TagsView;
    canMod: boolean;
    creatorBanned: boolean;
    creatorIsModerator: boolean;
    creatorBannedFromCommunity: boolean;
};
