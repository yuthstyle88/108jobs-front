import type { CommunityId } from "./CommunityId";
/**
 * Get a community. Must provide either an id, or a name.
 */
export type GetCommunity = {
    id?: CommunityId;
    /**
     * Example: starTrek , or starTrek@xyz.tld
     */
    name?: string;
};
