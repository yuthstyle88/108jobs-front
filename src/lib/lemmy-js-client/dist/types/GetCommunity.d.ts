import type { CommunityId } from "./CommunityId";
/**
 * Get a community. Must provide either an id, or a name.
 */
export type GetCommunity = {
    id?: CommunityId;
    /**
     * Example: star_trek , or star_trek@xyz.tld
     */
    name?: string;
};
