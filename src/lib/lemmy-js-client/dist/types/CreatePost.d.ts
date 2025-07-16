import type { CommunityId } from "./CommunityId";
import type { LanguageId } from "./LanguageId";
import type { TagId } from "./TagId";
/**
 * Create a post.
 */
export type CreatePost = {
    name: string;
    communityId: CommunityId;
    url?: string;
    /**
     * An optional body for the post in markdown.
     */
    body?: string;
    /**
     * An optional altText, usable for image posts.
     */
    altText?: string;
    /**
     * A honeypot to catch bots. Should be None.
     */
    honeypot?: string;
    nsfw?: boolean;
    languageId?: LanguageId;
    /**
     * Instead of fetching a thumbnail, use a custom one.
     */
    customThumbnail?: string;
    tags?: Array<TagId>;
    /**
     * Time when this post should be scheduled. Null means publish immediately.
     */
    scheduledPublishTimeAt?: number;
};
