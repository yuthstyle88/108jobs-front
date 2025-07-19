import type { PostId } from "./PostId";
/**
 * Remove a post (only doable by mods).
 */
export type RemovePost = {
    postId: PostId;
    removed: boolean;
};
