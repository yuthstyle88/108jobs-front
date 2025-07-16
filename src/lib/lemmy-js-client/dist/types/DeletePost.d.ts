import type { PostId } from "./PostId";
/**
 * Delete a post.
 */
export type DeletePost = {
    postId: PostId;
    deleted: boolean;
};
