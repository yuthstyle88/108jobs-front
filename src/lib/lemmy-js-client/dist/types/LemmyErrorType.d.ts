import type { FederationError } from "./FederationError";
export type LemmyErrorType = {
    error: "blockKeywordTooShort";
} | {
    error: "blockKeywordTooLong";
} | {
    error: "couldntUpdateKeywords";
} | {
    error: "reportReasonRequired";
} | {
    error: "reportTooLong";
} | {
    error: "notAModerator";
} | {
    error: "notAnAdmin";
} | {
    error: "cantBlockYourself";
} | {
    error: "cantNoteYourself";
} | {
    error: "cantBlockAdmin";
} | {
    error: "couldntUpdateUser";
} | {
    error: "passwordsDoNotMatch";
} | {
    error: "emailNotVerified";
} | {
    error: "emailRequired";
} | {
    error: "couldntUpdateComment";
} | {
    error: "cannotLeaveAdmin";
} | {
    error: "pictrsResponseError";
    message: string;
} | {
    error: "pictrsPurgeResponseError";
    message: string;
} | {
    error: "imageUrlMissingPathSegments";
} | {
    error: "imageUrlMissingLastPathSegment";
} | {
    error: "pictrsApiKeyNotProvided";
} | {
    error: "noContentTypeHeader";
} | {
    error: "notAnImageType";
} | {
    error: "invalidImageUpload";
} | {
    error: "imageUploadDisabled";
} | {
    error: "notAModOrAdmin";
} | {
    error: "notTopMod";
} | {
    error: "notLoggedIn";
} | {
    error: "notHigherMod";
} | {
    error: "notHigherAdmin";
} | {
    error: "siteBan";
} | {
    error: "deleted";
} | {
    error: "personIsBlocked";
} | {
    error: "communityIsBlocked";
} | {
    error: "instanceIsBlocked";
} | {
    error: "instanceIsPrivate";
} | {
    error: "invalidPassword";
} | {
    error: "siteDescriptionLengthOverflow";
} | {
    error: "honeypotFailed";
} | {
    error: "registrationApplicationIsPending";
} | {
    error: "locked";
} | {
    error: "couldntCreateComment";
} | {
    error: "maxCommentDepthReached";
} | {
    error: "noCommentEditAllowed";
} | {
    error: "onlyAdminsCanCreateCommunities";
} | {
    error: "communityAlreadyExists";
} | {
    error: "languageNotAllowed";
} | {
    error: "couldntUpdateLanguages";
} | {
    error: "couldntUpdatePost";
} | {
    error: "noPostEditAllowed";
} | {
    error: "nsfwNotAllowed";
} | {
    error: "editPrivateMessageNotAllowed";
} | {
    error: "siteAlreadyExists";
} | {
    error: "applicationQuestionRequired";
} | {
    error: "invalidDefaultPostListingType";
} | {
    error: "registrationClosed";
} | {
    error: "registrationApplicationAnswerRequired";
} | {
    error: "registrationUsernameRequired";
} | {
    error: "emailAlreadyExists";
} | {
    error: "usernameAlreadyExists";
} | {
    error: "personIsBannedFromCommunity";
} | {
    error: "noIdGiven";
} | {
    error: "incorrectLogin";
} | {
    error: "noEmailSetup";
} | {
    error: "localSiteNotSetup";
} | {
    error: "invalidEmailAddress";
    message: string;
} | {
    error: "invalidName";
} | {
    error: "invalidCodeVerifier";
} | {
    error: "invalidDisplayName";
} | {
    error: "invalidMatrixId";
} | {
    error: "invalidPostTitle";
} | {
    error: "invalidBodyField";
} | {
    error: "bioLengthOverflow";
} | {
    error: "altTextLengthOverflow";
} | {
    error: "missingTotpToken";
} | {
    error: "missingTotpSecret";
} | {
    error: "incorrectTotpToken";
} | {
    error: "couldntParseTotpSecret";
} | {
    error: "couldntGenerateTotp";
} | {
    error: "totpAlreadyEnabled";
} | {
    error: "couldntLikeComment";
} | {
    error: "couldntSaveComment";
} | {
    error: "couldntCreateReport";
} | {
    error: "couldntResolveReport";
} | {
    error: "communityModeratorAlreadyExists";
} | {
    error: "communityUserAlreadyBanned";
} | {
    error: "communityBlockAlreadyExists";
} | {
    error: "communityFollowerAlreadyExists";
} | {
    error: "personBlockAlreadyExists";
} | {
    error: "couldntLikePost";
} | {
    error: "couldntSavePost";
} | {
    error: "couldntMarkPostAsRead";
} | {
    error: "couldntUpdateReadComments";
} | {
    error: "couldntHidePost";
} | {
    error: "couldntUpdateCommunity";
} | {
    error: "couldntCreatePersonCommentMention";
} | {
    error: "couldntUpdatePersonCommentMention";
} | {
    error: "couldntCreatePersonPostMention";
} | {
    error: "couldntUpdatePersonPostMention";
} | {
    error: "couldntCreatePost";
} | {
    error: "couldntCreatePrivateMessage";
} | {
    error: "couldntUpdatePrivateMessage";
} | {
    error: "blockedUrl";
} | {
    error: "invalidUrl";
} | {
    error: "emailSendFailed";
} | {
    error: "slurs";
} | {
    error: "registrationDenied";
    message: {
        reason?: string;
    };
} | {
    error: "siteNameRequired";
} | {
    error: "siteNameLengthOverflow";
} | {
    error: "permissiveRegex";
} | {
    error: "invalidRegex";
} | {
    error: "captchaIncorrect";
} | {
    error: "couldntCreateAudioCaptcha";
} | {
    error: "couldntCreateImageCaptcha";
} | {
    error: "invalidUrlScheme";
} | {
    error: "couldntSendWebmention";
} | {
    error: "contradictingFilters";
} | {
    error: "instanceBlockAlreadyExists";
} | {
    error: "tooManyItems";
} | {
    error: "banExpirationInPast";
} | {
    error: "invalidUnixTime";
} | {
    error: "invalidBotAction";
} | {
    error: "invalidTagName";
} | {
    error: "tagNotInCommunity";
} | {
    error: "cantBlockLocalInstance";
} | {
    error: "unknown";
    message: string;
} | {
    error: "urlLengthOverflow";
} | {
    error: "oauthAuthorizationInvalid";
} | {
    error: "oauthLoginFailed";
} | {
    error: "oauthRegistrationClosed";
} | {
    error: "couldntCreateOauthProvider";
} | {
    error: "couldntUpdateOauthProvider";
} | {
    error: "notFound";
} | {
    error: "communityHasNoFollowers";
} | {
    error: "postScheduleTimeMustBeInFuture";
} | {
    error: "tooManyScheduledPosts";
} | {
    error: "cannotCombineFederationBlocklistAndAllowlist";
} | {
    error: "federationError";
    message: {
        error?: FederationError;
    };
} | {
    error: "couldntParsePaginationToken";
} | {
    error: "pluginError";
    message: string;
} | {
    error: "invalidFetchLimit";
} | {
    error: "couldntCreateCommentReply";
} | {
    error: "couldntUpdateCommentReply";
} | {
    error: "couldntMarkCommentReplyAsRead";
} | {
    error: "couldntCreateEmoji";
} | {
    error: "couldntUpdateEmoji";
} | {
    error: "couldntCreatePerson";
} | {
    error: "couldntUpdatePerson";
} | {
    error: "couldntCreateModlog";
} | {
    error: "couldntUpdateModlog";
} | {
    error: "couldntCreateSite";
} | {
    error: "couldntUpdateSite";
} | {
    error: "couldntCreateRegistrationApplication";
} | {
    error: "couldntUpdateRegistrationApplication";
} | {
    error: "couldntCreateTag";
} | {
    error: "couldntUpdateTag";
} | {
    error: "couldntCreatePostTag";
} | {
    error: "couldntUpdatePostTag";
} | {
    error: "couldntCreateTagline";
} | {
    error: "couldntUpdateTagline";
} | {
    error: "couldntCreateImage";
} | {
    error: "couldntAllowInstance";
} | {
    error: "couldntBlockInstance";
} | {
    error: "couldntInsertActivity";
} | {
    error: "couldntCreateRateLimit";
} | {
    error: "couldntCreateCaptchaAnswer";
} | {
    error: "couldntUpdateFederationQueueState";
} | {
    error: "couldntCreateOauthAccount";
} | {
    error: "couldntCreatePasswordResetRequest";
} | {
    error: "couldntCreateLoginToken";
} | {
    error: "couldntUpdateLocalSiteUrlBlocklist";
} | {
    error: "couldntCreateEmailVerification";
} | {
    error: "emailNotificationsDisabled";
} | {
    error: "multiCommunityUpdateWrongUser";
} | {
    error: "cannotCombineCommunityIdAndMultiCommunityId";
} | {
    error: "multiCommunityEntryLimitReached";
};
