import type { PostId } from "./PostId";
/**
 * Mark several posts as read.
 */
export type MarkManyPostsAsRead = {
    postIds: Array<PostId>;
};
