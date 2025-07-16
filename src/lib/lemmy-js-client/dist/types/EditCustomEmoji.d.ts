import type { CustomEmojiId } from "./CustomEmojiId";
/**
 * Edit  a custom emoji.
 */
export type EditCustomEmoji = {
    id: CustomEmojiId;
    category: string;
    imageUrl: string;
    altText: string;
    keywords: Array<string>;
};
