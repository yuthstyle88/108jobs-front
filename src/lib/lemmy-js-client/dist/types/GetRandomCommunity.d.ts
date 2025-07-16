import type { ListingType } from "./ListingType";
/**
 * Fetches a random community
 */
export type GetRandomCommunity = {
    type?: ListingType;
    showNsfw?: boolean;
};
