import type { CommunityId } from "./CommunityId";
import type { ListingType } from "./ListingType";
import type { MultiCommunityId } from "./MultiCommunityId";
import type { PaginationCursor } from "./PaginationCursor";
import type { PostSortType } from "./PostSortType";
/**
 * Get a list of posts.
 */
export type GetPosts = {
    type?: ListingType;
    sort?: PostSortType;
    /**
     * Filter to within a given time range, in seconds.
     * IE 60 would give results for the past minute.
     * Use Zero to override the localSite and localUser timeRange.
     */
    timeRangeSeconds?: number;
    communityId?: CommunityId;
    communityName?: string;
    multiCommunityId?: MultiCommunityId;
    showHidden?: boolean;
    /**
     * If true, then show the read posts (even if your user setting is to hide them)
     */
    showRead?: boolean;
    /**
     * If true, then show the nsfw posts (even if your user setting is to hide them)
     */
    showNsfw?: boolean;
    /**
     * If false, then show posts with media attached (even if your user setting is to hide them)
     */
    hideMedia?: boolean;
    /**
     * Whether to automatically mark fetched posts as read.
     */
    markAsRead?: boolean;
    /**
     * If true, then only show posts with no comments
     */
    noCommentsOnly?: boolean;
    pageCursor?: PaginationCursor;
    pageBack?: boolean;
    limit?: number;
};
