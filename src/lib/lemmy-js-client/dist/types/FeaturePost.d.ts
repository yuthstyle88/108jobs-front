import type { PostFeatureType } from "./PostFeatureType";
import type { PostId } from "./PostId";
/**
 * Feature a post (stickies / pins to the top).
 */
export type FeaturePost = {
    postId: PostId;
    featured: boolean;
    featureType: PostFeatureType;
};
