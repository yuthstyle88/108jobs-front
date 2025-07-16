import type { DbUrl } from "./DbUrl";
/**
 * Site metadata, from its opengraph tags.
 */
export type LinkMetadata = {
    contentType?: string;
    title?: string;
    description?: string;
    image?: DbUrl;
    embedVideoUrl?: DbUrl;
};
