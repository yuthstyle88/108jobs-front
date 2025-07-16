import type { DbUrl } from "./DbUrl";
export type ImageDetails = {
    link: DbUrl;
    width: number;
    height: number;
    contentType: string;
    blurhash?: string;
};
