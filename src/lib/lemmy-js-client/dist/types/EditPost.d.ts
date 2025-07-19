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
     * An optional alt_text, usable for image posts.
     */
    alt_text?: string;
    nsfw?: boolean;
    language_id?: LanguageId;
    /**
     * Instead of fetching a thumbnail, use a custom one.
     */
    custom_thumbnail?: string;
    /**
     * Time when this post should be scheduled. Null means publish immediately.
     */
    scheduled_publish_time_at?: number;
    tags?: Array<TagId>;
};
