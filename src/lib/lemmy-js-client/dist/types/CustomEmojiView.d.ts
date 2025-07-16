import type { CustomEmoji } from "./CustomEmoji";
import type { CustomEmojiKeyword } from "./CustomEmojiKeyword";
/**
 * A custom emoji view.
 */
export type CustomEmojiView = {
    customEmoji: CustomEmoji;
    keywords: Array<CustomEmojiKeyword>;
};
