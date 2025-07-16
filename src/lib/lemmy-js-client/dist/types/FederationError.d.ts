/**
 * Federation related errors, these dont need to be translated.
 */
export type FederationError = "InvalidCommunity" | "CannotCreatePostOrCommentInDeletedOrRemovedCommunity" | "CannotReceivePage" | "OnlyLocalAdminCanRemoveCommunity" | "OnlyLocalAdminCanRestoreCommunity" | "PostIsLocked" | {
    PersonIsBannedFromSite: string;
} | "InvalidVoteValue" | "PageDoesNotSpecifyCreator" | "CouldntGetComments" | "CouldntGetPosts" | "FederationDisabled" | {
    DomainBlocked: string;
} | {
    DomainNotInAllowList: string;
} | "FederationDisabledByStrictAllowList" | "ContradictingFilters" | "UrlWithoutDomain" | "InboxTimeout" | "CantDeleteSite" | "ObjectIsNotPublic" | "ObjectIsNotPrivate" | "PlatformLackingPrivateCommunitySupport" | "Unreachable";
