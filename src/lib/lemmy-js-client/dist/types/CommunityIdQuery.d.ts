import type { CommunityId } from "./CommunityId";
/**
 * Parameter for setting community icon or banner. Can't use POST data here as it already contains
 * the image data.
 */
export type CommunityIdQuery = {
    id: CommunityId;
};
