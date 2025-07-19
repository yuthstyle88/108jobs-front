import type { PostId } from "./PostId";
/**
 * Mark several posts as read.
 */
export type MarkManyPostsAsRead = {
    post_ids: Array<PostId>;
};
