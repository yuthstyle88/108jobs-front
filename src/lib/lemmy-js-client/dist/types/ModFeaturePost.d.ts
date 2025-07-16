import type { ModFeaturePostId } from "./ModFeaturePostId";
import type { PersonId } from "./PersonId";
import type { PostId } from "./PostId";
/**
 * When a moderator features a post on a community (pins it to the top).
 */
export type ModFeaturePost = {
    id: ModFeaturePostId;
    modPersonId: PersonId;
    postId: PostId;
    featured: boolean;
    publishedAt: string;
    isFeaturedCommunity: boolean;
};
