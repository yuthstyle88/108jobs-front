import type { PostId } from "./PostId";
/**
 * Purges a post from the database. This will delete all content attached to that post.
 */
export type PurgePost = {
    postId: PostId;
};
