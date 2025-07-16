import type { Community } from "./Community";
import type { ModRemovePost } from "./ModRemovePost";
import type { Person } from "./Person";
import type { Post } from "./Post";
/**
 * When a moderator removes a post.
 */
export type ModRemovePostView = {
    modRemovePost: ModRemovePost;
    moderator?: Person;
    otherPerson: Person;
    post: Post;
    community: Community;
};
