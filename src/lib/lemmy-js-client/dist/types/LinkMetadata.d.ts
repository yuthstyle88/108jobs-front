import type { DbUrl } from "./DbUrl";
/**
 * Site metadata, from its opengraph tags.
 */
export type LinkMetadata = {
    content_type?: string;
    title?: string;
    description?: string;
    image?: DbUrl;
    embed_video_url?: DbUrl;
};
