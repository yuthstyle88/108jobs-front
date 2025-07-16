import type { PostId } from "./PostId";
/**
 * Lock a post (prevent new comments).
 */
export type LockPost = {
    postId: PostId;
    locked: boolean;
    reason?: string;
};
