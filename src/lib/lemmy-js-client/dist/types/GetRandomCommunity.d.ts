import type { ListingType } from "./ListingType";
/**
 * Fetches a random community
 */
export type GetRandomCommunity = {
    type_?: ListingType;
    show_nsfw?: boolean;
};
