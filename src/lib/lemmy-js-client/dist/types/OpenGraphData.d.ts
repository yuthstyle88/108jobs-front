import type { DbUrl } from "./DbUrl";
/**
 * Site metadata, from its opengraph tags.
 */
export type OpenGraphData = {
    title?: string;
    description?: string;
    image?: DbUrl;
    embedVideoUrl?: DbUrl;
};
