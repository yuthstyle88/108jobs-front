/**
 * Create a custom emoji.
 */
export type CreateCustomEmoji = {
    category: string;
    shortcode: string;
    imageUrl: string;
    altText: string;
    keywords: Array<string>;
};
