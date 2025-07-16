import type { CommunityView } from "./CommunityView";
import type { PostView } from "./PostView";
/**
 * The post response.
 */
export type GetPostResponse = {
    postView: PostView;
    communityView: CommunityView;
    /**
     * A list of cross-posts, or other times / communities this link has been posted to.
     */
    crossPosts: Array<PostView>;
};
