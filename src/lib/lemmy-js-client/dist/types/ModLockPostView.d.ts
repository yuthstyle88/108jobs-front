import type { Community } from "./Community";
import type { ModLockPost } from "./ModLockPost";
import type { Person } from "./Person";
import type { Post } from "./Post";
/**
 * When a moderator locks a post (prevents new comments being made).
 */
export type ModLockPostView = {
    modLockPost: ModLockPost;
    moderator?: Person;
    otherPerson: Person;
    post: Post;
    community: Community;
};
