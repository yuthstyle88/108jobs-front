import type { Community } from "./Community";
import type { CommunityActions } from "./CommunityActions";
import type { InstanceActions } from "./InstanceActions";
import type { TagsView } from "./TagsView";
/**
 * A community view.
 */
export type CommunityView = {
    community: Community;
    communityActions?: CommunityActions;
    instanceActions?: InstanceActions;
    canMod: boolean;
    postTags: TagsView;
};
