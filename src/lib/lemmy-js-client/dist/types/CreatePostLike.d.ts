import type { PostId } from "./PostId";
/**
 * Like a post.
 */
export type CreatePostLike = {
    postId: PostId;
    /**
     * Score must be -1, 0, or 1.
     */
    score: number;
};
