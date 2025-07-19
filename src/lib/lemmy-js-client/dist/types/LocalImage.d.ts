import type { PersonId } from "./PersonId";
import type { PostId } from "./PostId";
export type LocalImage = {
    pictrsAlias: string;
    publishedAt: string;
    person_id?: PersonId;
    /**
     * This means the image is an auto-generated thumbnail, for a post.
     */
    thumbnail_for_post_id?: PostId;
};
