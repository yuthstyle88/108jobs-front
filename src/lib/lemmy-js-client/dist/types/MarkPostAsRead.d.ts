import type { PostId } from "./PostId";
/**
 * Mark a post as read.
 */
export type MarkPostAsRead = {
    postId: PostId;
    read: boolean;
};
