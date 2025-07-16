import type { CustomEmojiId } from "./CustomEmojiId";
import type { DbUrl } from "./DbUrl";
/**
 * A custom emoji.
 */
export type CustomEmoji = {
    id: CustomEmojiId;
    shortcode: string;
    imageUrl: DbUrl;
    altText: string;
    category: string;
    publishedAt: string;
    updatedAt?: string;
};
