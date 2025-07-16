import type { Community } from "./Community";
import type { ModFeaturePost } from "./ModFeaturePost";
import type { Person } from "./Person";
import type { Post } from "./Post";
/**
 * When a moderator features a post on a community (pins it to the top).
 */
export type ModFeaturePostView = {
    modFeaturePost: ModFeaturePost;
    moderator?: Person;
    otherPerson: Person;
    post: Post;
    community: Community;
};
