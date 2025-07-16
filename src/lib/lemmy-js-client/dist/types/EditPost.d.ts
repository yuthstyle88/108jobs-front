import type { LanguageId } from "./LanguageId";
import type { PostId } from "./PostId";
import type { TagId } from "./TagId";
/**
 * Edit a post.
 */
export type EditPost = {
    postId: PostId;
    name?: string;
    url?: string;
    /**
     * An optional body for the post in markdown.
     */
    body?: string;
    /**
     * An optional altText, usable for image posts.
     */
    altText?: string;
    nsfw?: boolean;
    languageId?: LanguageId;
    /**
     * Instead of fetching a thumbnail, use a custom one.
     */
    customThumbnail?: string;
    /**
     * Time when this post should be scheduled. Null means publish immediately.
     */
    scheduledPublishTimeAt?: number;
    tags?: Array<TagId>;
};
