import type { PersonId } from "./PersonId";
import type { PostId } from "./PostId";
export type LocalImage = {
    pictrsAlias: string;
    publishedAt: string;
    personId?: PersonId;
    /**
     * This means the image is an auto-generated thumbnail, for a post.
     */
    thumbnailForPostId?: PostId;
};
