import type { ModLockPostId } from "./ModLockPostId";
import type { PersonId } from "./PersonId";
import type { PostId } from "./PostId";
/**
 * When a moderator locks a post (prevents new comments being made).
 */
export type ModLockPost = {
    id: ModLockPostId;
    modPersonId: PersonId;
    postId: PostId;
    locked: boolean;
    publishedAt: string;
    reason?: string;
};
