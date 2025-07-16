import type { CommunityId } from "./CommunityId";
import type { ListingType } from "./ListingType";
import type { PaginationCursor } from "./PaginationCursor";
import type { PersonId } from "./PersonId";
import type { SearchSortType } from "./SearchSortType";
import type { SearchType } from "./SearchType";
/**
 * Searches the site, given a search term, and some optional filters.
 */
export type Search = {
    q: string;
    communityId?: CommunityId;
    communityName?: string;
    creatorId?: PersonId;
    type?: SearchType;
    sort?: SearchSortType;
    /**
     * Filter to within a given time range, in seconds.
     * IE 60 would give results for the past minute.
     */
    timeRangeSeconds?: number;
    listingType?: ListingType;
    titleOnly?: boolean;
    postUrlOnly?: boolean;
    likedOnly?: boolean;
    dislikedOnly?: boolean;
    /**
     * If true, then show the nsfw posts (even if your user setting is to hide them)
     */
    showNsfw?: boolean;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
