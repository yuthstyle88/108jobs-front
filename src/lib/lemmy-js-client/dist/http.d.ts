import { Controller } from "@tsoa/runtime";
import { AdminListUsersI, CommunityIdQueryI, DeleteImageParamsI, GetCommentI, GetCommentsI, GetCommunityI, GetCommunityPendingFollowsCountI, GetModlogI, GetMultiCommunityI, GetPersonDetailsI, GetPostI, GetPostsI, GetRandomCommunityI, GetRegistrationApplicationI, GetReportCountI, GetSiteMetadataI, ListCommentLikesI, ListCommunitiesI, ListCommunityPendingFollowsI, ListCustomEmojisI, ListInboxI, ListMediaI, ListMultiCommunitiesI, ListPersonContentI, ListPersonHiddenI, ListPersonLikedI, ListPersonReadI, ListPersonSavedI, ListPostLikesI, ListRegistrationApplicationsI, ListReportsI, ListTaglinesI, ResolveObjectI, SearchI, UploadImage } from "./other_types";
import { AddAdmin } from "./types/AddAdmin";
import { AddAdminResponse } from "./types/AddAdminResponse";
import { AddModToCommunity } from "./types/AddModToCommunity";
import { AddModToCommunityResponse } from "./types/AddModToCommunityResponse";
import { ApproveRegistrationApplication } from "./types/ApproveRegistrationApplication";
import { BanFromCommunity } from "./types/BanFromCommunity";
import { BanFromCommunityResponse } from "./types/BanFromCommunityResponse";
import { MarkManyPostsAsRead } from "./types/MarkManyPostsAsRead";
import { BanPerson } from "./types/BanPerson";
import { BanPersonResponse } from "./types/BanPersonResponse";
import { BlockCommunity } from "./types/BlockCommunity";
import { BlockCommunityResponse } from "./types/BlockCommunityResponse";
import { BlockPerson } from "./types/BlockPerson";
import { BlockPersonResponse } from "./types/BlockPersonResponse";
import { ChangePassword } from "./types/ChangePassword";
import { CommentReportResponse } from "./types/CommentReportResponse";
import { CommentResponse } from "./types/CommentResponse";
import { CommunityReportResponse } from "./types/CommunityReportResponse";
import { CommunityResponse } from "./types/CommunityResponse";
import { CreateComment } from "./types/CreateComment";
import { CreateCommentLike } from "./types/CreateCommentLike";
import { CreateCommentReport } from "./types/CreateCommentReport";
import { CreateCommunity } from "./types/CreateCommunity";
import { CreateCommunityReport } from "./types/CreateCommunityReport";
import { CreateCommunityTag } from "./types/CreateCommunityTag";
import { CreateCustomEmoji } from "./types/CreateCustomEmoji";
import { CreateOAuthProvider } from "./types/CreateOAuthProvider";
import { CreatePost } from "./types/CreatePost";
import { CreatePostLike } from "./types/CreatePostLike";
import { CreatePostReport } from "./types/CreatePostReport";
import { CreatePrivateMessage } from "./types/CreatePrivateMessage";
import { CreatePrivateMessageReport } from "./types/CreatePrivateMessageReport";
import { CreateSite } from "./types/CreateSite";
import { CustomEmojiResponse } from "./types/CustomEmojiResponse";
import { DeleteAccount } from "./types/DeleteAccount";
import { DeleteComment } from "./types/DeleteComment";
import { DeleteCommunity } from "./types/DeleteCommunity";
import { DeleteCommunityTag } from "./types/DeleteCommunityTag";
import { DeleteCustomEmoji } from "./types/DeleteCustomEmoji";
import { DeleteOAuthProvider } from "./types/DeleteOAuthProvider";
import { DeletePost } from "./types/DeletePost";
import { DeletePrivateMessage } from "./types/DeletePrivateMessage";
import { DistinguishComment } from "./types/DistinguishComment";
import { EditComment } from "./types/EditComment";
import { EditCommunity } from "./types/EditCommunity";
import { EditCustomEmoji } from "./types/EditCustomEmoji";
import { EditOAuthProvider } from "./types/EditOAuthProvider";
import { EditPost } from "./types/EditPost";
import { EditPrivateMessage } from "./types/EditPrivateMessage";
import { EditSite } from "./types/EditSite";
import { OAuthProvider } from "./types/OAuthProvider";
import { FeaturePost } from "./types/FeaturePost";
import { FollowCommunity } from "./types/FollowCommunity";
import { GetCaptchaResponse } from "./types/GetCaptchaResponse";
import { GetCommentsResponse } from "./types/GetCommentsResponse";
import { GetCommunityResponse } from "./types/GetCommunityResponse";
import { GetFederatedInstancesResponse } from "./types/GetFederatedInstancesResponse";
import { GetModlogResponse } from "./types/GetModlogResponse";
import { GetPersonDetailsResponse } from "./types/GetPersonDetailsResponse";
import { GetPostResponse } from "./types/GetPostResponse";
import { GetPostsResponse } from "./types/GetPostsResponse";
import { GetReportCountResponse } from "./types/GetReportCountResponse";
import { GetSiteMetadataResponse } from "./types/GetSiteMetadataResponse";
import { GetSiteResponse } from "./types/GetSiteResponse";
import { GetUnreadCountResponse } from "./types/GetUnreadCountResponse";
import { GetUnreadRegistrationApplicationCountResponse } from "./types/GetUnreadRegistrationApplicationCountResponse";
import { ListCommunitiesResponse } from "./types/ListCommunitiesResponse";
import { ListRegistrationApplicationsResponse } from "./types/ListRegistrationApplicationsResponse";
import { LockPost } from "./types/LockPost";
import { Login } from "./types/Login";
import { LoginResponse } from "./types/LoginResponse";
import { MarkCommentReplyAsRead } from "./types/MarkCommentReplyAsRead";
import { MarkPostAsRead } from "./types/MarkPostAsRead";
import { MarkPrivateMessageAsRead } from "./types/MarkPrivateMessageAsRead";
import { PasswordChangeAfterReset } from "./types/PasswordChangeAfterReset";
import { PasswordReset } from "./types/PasswordReset";
import { PostReportResponse } from "./types/PostReportResponse";
import { PostResponse } from "./types/PostResponse";
import { PrivateMessageReportResponse } from "./types/PrivateMessageReportResponse";
import { PrivateMessageResponse } from "./types/PrivateMessageResponse";
import { PurgeComment } from "./types/PurgeComment";
import { PurgeCommunity } from "./types/PurgeCommunity";
import { PurgePerson } from "./types/PurgePerson";
import { PurgePost } from "./types/PurgePost";
import { Register } from "./types/Register";
import { RegistrationApplicationResponse } from "./types/RegistrationApplicationResponse";
import { RemoveComment } from "./types/RemoveComment";
import { RemoveCommunity } from "./types/RemoveCommunity";
import { RemovePost } from "./types/RemovePost";
import { ResolveCommentReport } from "./types/ResolveCommentReport";
import { ResolveCommunityReport } from "./types/ResolveCommunityReport";
import { ResolvePostReport } from "./types/ResolvePostReport";
import { ResolvePrivateMessageReport } from "./types/ResolvePrivateMessageReport";
import { SaveComment } from "./types/SaveComment";
import { SavePost } from "./types/SavePost";
import { SaveUserSettings } from "./types/SaveUserSettings";
import { SearchResponse } from "./types/SearchResponse";
import { SiteResponse } from "./types/SiteResponse";
import { TransferCommunity } from "./types/TransferCommunity";
import { UpdateCommunityTag } from "./types/UpdateCommunityTag";
import { VerifyEmail } from "./types/VerifyEmail";
import { HideCommunity } from "./types/HideCommunity";
import { GenerateTotpSecretResponse } from "./types/GenerateTotpSecretResponse";
import { UpdateTotp } from "./types/UpdateTotp";
import { UpdateTotpResponse } from "./types/UpdateTotpResponse";
import { SuccessResponse } from "./types/SuccessResponse";
import { ListPostLikesResponse } from "./types/ListPostLikesResponse";
import { ListCommentLikesResponse } from "./types/ListCommentLikesResponse";
import { HidePost } from "./types/HidePost";
import { ListMediaResponse } from "./types/ListMediaResponse";
import { AuthenticateWithOauth } from "./types/AuthenticateWithOauth";
import { CreateTagline } from "./types/CreateTagline";
import { TaglineResponse } from "./types/TaglineResponse";
import { UpdateTagline } from "./types/UpdateTagline";
import { DeleteTagline } from "./types/DeleteTagline";
import { ListTaglinesResponse } from "./types/ListTaglinesResponse";
import { ListCustomEmojisResponse } from "./types/ListCustomEmojisResponse";
import { ApproveCommunityPendingFollower } from "./types/ApproveCommunityPendingFollower";
import { GetCommunityPendingFollowsCountResponse } from "./types/GetCommunityPendingFollowsCountResponse";
import { ListCommunityPendingFollowsResponse } from "./types/ListCommunityPendingFollowsResponse";
import { ListReportsResponse } from "./types/ListReportsResponse";
import { MyUserInfo } from "./types/MyUserInfo";
import { UserBlockInstanceParams } from "./types/UserBlockInstanceParams";
import { AdminAllowInstanceParams } from "./types/AdminAllowInstanceParams";
import { AdminBlockInstanceParams } from "./types/AdminBlockInstanceParams";
import { ListPersonContentResponse } from "./types/ListPersonContentResponse";
import { ListPersonSavedResponse } from "./types/ListPersonSavedResponse";
import { UploadImageResponse } from "./types/UploadImageResponse";
import { ListInboxResponse } from "./types/ListInboxResponse";
import { MarkPersonCommentMentionAsRead } from "./types/MarkPersonCommentMentionAsRead";
import { MarkPersonPostMentionAsRead } from "./types/MarkPersonPostMentionAsRead";
import { GetCommentsSlimResponse } from "./types/GetCommentsSlimResponse";
import { Tag } from "./types/Tag";
import { ResendVerificationEmail } from "./types/ResendVerificationEmail";
import { ListPersonReadResponse } from "./types/ListPersonReadResponse";
import { ListPersonHiddenResponse } from "./types/ListPersonHiddenResponse";
import { CommunityIdQuery } from "./types/CommunityIdQuery";
import { CreateMultiCommunity } from "./types/CreateMultiCommunity";
import { UpdateMultiCommunity } from "./types/UpdateMultiCommunity";
import { ListMultiCommunitiesResponse } from "./types/ListMultiCommunitiesResponse";
import { AdminListUsersResponse } from "./types/AdminListUsersResponse";
import { CreateOrDeleteMultiCommunityEntry } from "./types/CreateOrDeleteMultiCommunityEntry";
import { GetMultiCommunityResponse } from "./types/GetMultiCommunityResponse";
import { FollowMultiCommunity } from "./types/FollowMultiCommunity";
import { ListLoginsResponse } from "./types/ListLoginsResponse";
import { ListPersonLikedResponse } from "./types/ListPersonLikedResponse";
type RequestOptions = Pick<RequestInit, "signal">;
/**
 * Helps build lemmy HTTP requests.
 */
export declare class LemmyHttp extends Controller {
    #private;
    /**
     * Generates a new instance of LemmyHttp.
     * @param baseUrl the base url, without the vX version: https://lemmy.ml -> goes to https://lemmy.ml/api/vX
     * @param headers optional headers. Should contain `x-real-ip` and `x-forwarded-for` .
     */
    constructor(baseUrl: string, options?: {
        fetchFunction?: typeof fetch;
        headers?: {
            [key: string]: string;
        };
    });
    /**
     * @summary Gets the site, and your user data.
     */
    getSite(options?: RequestOptions): Promise<GetSiteResponse>;
    /**
     * @summary Create your site.
     */
    createSite(form: CreateSite, options?: RequestOptions): Promise<SiteResponse>;
    /**
     * @summary Edit your site.
     */
    editSite(form: EditSite, options?: RequestOptions): Promise<SiteResponse>;
    /**
     * @summary Leave the Site admins.
     */
    leaveAdmin(options?: RequestOptions): Promise<GetSiteResponse>;
    /**
     * @summary Generate a TOTP / two-factor secret.
     *
     * Generate a TOTP / two-factor secret.
     * Afterwards you need to call `/account/auth/totp/update` with a valid token to enable it.
     */
    generateTotpSecret(options?: RequestOptions): Promise<GenerateTotpSecretResponse>;
    /**
     * @summary Get data of current user.
     */
    getMyUser(options?: RequestOptions): Promise<MyUserInfo>;
    /**
     * @summary Export a backup of your user settings.
     *
     * Export a backup of your user settings, including your saved content,
     * followed communities, and blocks.
     */
    exportSettings(options?: RequestOptions): Promise<string>;
    /**
     * @summary Import a backup of your user settings.
     */
    importSettings(form: any, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary List login tokens for your user
     */
    listLogins(options?: RequestOptions): Promise<ListLoginsResponse>;
    /**
     * @summary Returns an error message if your auth token is invalid
     */
    validateAuth(options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary List all the media for your account.
     */
    listMedia(form?: ListMediaI, options?: RequestOptions): Promise<ListMediaResponse>;
    /**
     * @summary Delete media for your account.
     */
    deleteMedia(form: DeleteImageParamsI, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Delete any media. (Admin only)
     */
    deleteMediaAdmin(form: DeleteImageParamsI, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary List all the media known to your instance.
     */
    listMediaAdmin(form?: ListMediaI, options?: RequestOptions): Promise<ListMediaResponse>;
    /**
     * @summary Enable / Disable TOTP / two-factor authentication.
     *
     * To enable, you need to first call `/account/auth/totp/generate` and then pass a valid token to this.
     *
     * Disabling is only possible if 2FA was previously enabled. Again it is necessary to pass a valid token.
     */
    updateTotp(form: UpdateTotp, options?: RequestOptions): Promise<UpdateTotpResponse>;
    /**
     * @summary Get the modlog.
     */
    getModlog(form?: GetModlogI, options?: RequestOptions): Promise<GetModlogResponse>;
    /**
     * @summary Search lemmy. If `searchTerm` is a url it also attempts to fetch it, just like `resolveObject`.
     */
    search(form: SearchI, options?: RequestOptions): Promise<SearchResponse>;
    /**
     * @summary Fetch a non-local / federated object.
     */
    resolveObject(form: ResolveObjectI, options?: RequestOptions): Promise<SearchResponse>;
    /**
     * @summary Create a new community.
     */
    createCommunity(form: CreateCommunity, options?: RequestOptions): Promise<CommunityResponse>;
    /**
     * @summary Get / fetch a community.
     */
    getCommunity(form?: GetCommunityI, options?: RequestOptions): Promise<GetCommunityResponse>;
    /**
     * @summary Edit a community.
     */
    editCommunity(form: EditCommunity, options?: RequestOptions): Promise<CommunityResponse>;
    /**
     * @summary List communities, with various filters.
     */
    listCommunities(form?: ListCommunitiesI, options?: RequestOptions): Promise<ListCommunitiesResponse>;
    /**
     * @summary Follow / subscribe to a community.
     */
    followCommunity(form: FollowCommunity, options?: RequestOptions): Promise<CommunityResponse>;
    /**
     * @summary Get a community's pending follows count.
     */
    getCommunityPendingFollowsCount(form: GetCommunityPendingFollowsCountI, options?: RequestOptions): Promise<GetCommunityPendingFollowsCountResponse>;
    /**
     * @summary Get a community's pending followers.
     */
    listCommunityPendingFollows(form: ListCommunityPendingFollowsI, options?: RequestOptions): Promise<ListCommunityPendingFollowsResponse>;
    /**
     * @summary Approve a community pending follow request.
     */
    approveCommunityPendingFollow(form: ApproveCommunityPendingFollower, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Block a community.
     */
    blockCommunity(form: BlockCommunity, options?: RequestOptions): Promise<BlockCommunityResponse>;
    /**
     * @summary Delete a community.
     */
    deleteCommunity(form: DeleteCommunity, options?: RequestOptions): Promise<CommunityResponse>;
    /**
     * @summary Hide a community from public / "All" view. Admins only.
     */
    hideCommunity(form: HideCommunity, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary A moderator remove for a community.
     */
    removeCommunity(form: RemoveCommunity, options?: RequestOptions): Promise<CommunityResponse>;
    /**
     * @summary Transfer your community to an existing moderator.
     */
    transferCommunity(form: TransferCommunity, options?: RequestOptions): Promise<GetCommunityResponse>;
    /**
     * @summary Ban a user from a community.
     */
    banFromCommunity(form: BanFromCommunity, options?: RequestOptions): Promise<BanFromCommunityResponse>;
    /**
     * @summary Add a moderator to your community.
     */
    addModToCommunity(form: AddModToCommunity, options?: RequestOptions): Promise<AddModToCommunityResponse>;
    /**
     * @summary Get a random community.
     */
    getRandomCommunity(form: GetRandomCommunityI, options?: RequestOptions): Promise<CommunityResponse>;
    /**
     * @summary Create a report for a community.
     */
    createCommunityReport(form: CreateCommunityReport, options?: RequestOptions): Promise<CommunityReportResponse>;
    /**
     * @summary Resolve a report for a private message.
     */
    resolveCommunityReport(form: ResolveCommunityReport, options?: RequestOptions): Promise<CommunityReportResponse>;
    /**
     * @summary Create a post.
     */
    createPost(form: CreatePost, options?: RequestOptions): Promise<PostResponse>;
    /**
     * @summary Get / fetch a post.
     */
    getPost(form?: GetPostI, options?: RequestOptions): Promise<GetPostResponse>;
    /**
     * @summary Edit a post.
     */
    editPost(form: EditPost, options?: RequestOptions): Promise<PostResponse>;
    /**
     * @summary Delete a post.
     */
    deletePost(form: DeletePost, options?: RequestOptions): Promise<PostResponse>;
    /**
     * @summary A moderator remove for a post.
     */
    removePost(form: RemovePost, options?: RequestOptions): Promise<PostResponse>;
    /**
     * @summary Mark a post as read.
     */
    markPostAsRead(form: MarkPostAsRead, options?: RequestOptions): Promise<PostResponse>;
    /**
     * @summary Mark multiple posts as read.
     */
    markManyPostAsRead(form: MarkManyPostsAsRead, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Hide a post from list views.
     */
    hidePost(form: HidePost, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary A moderator can lock a post ( IE disable new comments ).
     */
    lockPost(form: LockPost, options?: RequestOptions): Promise<PostResponse>;
    /**
     * @summary A moderator can feature a community post ( IE stick it to the top of a community ).
     */
    featurePost(form: FeaturePost, options?: RequestOptions): Promise<PostResponse>;
    /**
     * @summary Get / fetch posts, with various filters.
     */
    getPosts(form?: GetPostsI, options?: RequestOptions): Promise<GetPostsResponse>;
    /**
     * @summary Like / vote on a post.
     */
    likePost(form: CreatePostLike, options?: RequestOptions): Promise<PostResponse>;
    /**
     * @summary List a post's likes. Admin-only.
     */
    listPostLikes(form: ListPostLikesI, options?: RequestOptions): Promise<ListPostLikesResponse>;
    /**
     * @summary Save a post.
     */
    savePost(form: SavePost, options?: RequestOptions): Promise<PostResponse>;
    /**
     * @summary Report a post.
     */
    createPostReport(form: CreatePostReport, options?: RequestOptions): Promise<PostReportResponse>;
    /**
     * @summary Resolve a post report. Only a mod can do this.
     */
    resolvePostReport(form: ResolvePostReport, options?: RequestOptions): Promise<PostReportResponse>;
    /**
     * @summary Fetch metadata for any given site.
     */
    getSiteMetadata(form: GetSiteMetadataI, options?: RequestOptions): Promise<GetSiteMetadataResponse>;
    /**
     * @summary Create a comment.
     */
    createComment(form: CreateComment, options?: RequestOptions): Promise<CommentResponse>;
    /**
     * @summary Edit a comment.
     */
    editComment(form: EditComment, options?: RequestOptions): Promise<CommentResponse>;
    /**
     * @summary Delete a comment.
     */
    deleteComment(form: DeleteComment, options?: RequestOptions): Promise<CommentResponse>;
    /**
     * @summary A moderator remove for a comment.
     */
    removeComment(form: RemoveComment, options?: RequestOptions): Promise<CommentResponse>;
    /**
     * @summary Mark a comment as read.
     */
    markCommentReplyAsRead(form: MarkCommentReplyAsRead, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Like / vote on a comment.
     */
    likeComment(form: CreateCommentLike, options?: RequestOptions): Promise<CommentResponse>;
    /**
     * @summary List a comment's likes. Admin-only.
     */
    listCommentLikes(form: ListCommentLikesI, options?: RequestOptions): Promise<ListCommentLikesResponse>;
    /**
     * @summary Save a comment.
     */
    saveComment(form: SaveComment, options?: RequestOptions): Promise<CommentResponse>;
    /**
     * @summary Distinguishes a comment (speak as moderator)
     */
    distinguishComment(form: DistinguishComment, options?: RequestOptions): Promise<CommentResponse>;
    /**
     * @summary Get / fetch comments.
     */
    getComments(form?: GetCommentsI, options?: RequestOptions): Promise<GetCommentsResponse>;
    /**
     * @summary Get / fetch comments, but without the post or community.
     */
    getCommentsSlim(form?: GetCommentsI, options?: RequestOptions): Promise<GetCommentsSlimResponse>;
    /**
     * @summary Get / fetch comment.
     */
    getComment(form: GetCommentI, options?: RequestOptions): Promise<CommentResponse>;
    /**
     * @summary Report a comment.
     */
    createCommentReport(form: CreateCommentReport, options?: RequestOptions): Promise<CommentReportResponse>;
    /**
     * @summary Resolve a comment report. Only a mod can do this.
     */
    resolveCommentReport(form: ResolveCommentReport, options?: RequestOptions): Promise<CommentReportResponse>;
    /**
     * @summary Create a private message.
     */
    createPrivateMessage(form: CreatePrivateMessage, options?: RequestOptions): Promise<PrivateMessageResponse>;
    /**
     * @summary Edit a private message.
     */
    editPrivateMessage(form: EditPrivateMessage, options?: RequestOptions): Promise<PrivateMessageResponse>;
    /**
     * @summary Delete a private message.
     */
    deletePrivateMessage(form: DeletePrivateMessage, options?: RequestOptions): Promise<PrivateMessageResponse>;
    /**
     * @summary Mark a private message as read.
     */
    markPrivateMessageAsRead(form: MarkPrivateMessageAsRead, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Create a report for a private message.
     */
    createPrivateMessageReport(form: CreatePrivateMessageReport, options?: RequestOptions): Promise<PrivateMessageReportResponse>;
    /**
     * @summary Resolve a report for a private message.
     */
    resolvePrivateMessageReport(form: ResolvePrivateMessageReport, options?: RequestOptions): Promise<PrivateMessageReportResponse>;
    /**
     * @summary Register a new user.
     */
    register(form: Register, options?: RequestOptions): Promise<LoginResponse>;
    /**
     * @summary Log into lemmy.
     */
    login(form: Login, options?: RequestOptions): Promise<LoginResponse>;
    /**
     * @summary Invalidate the currently used auth token.
     */
    logout(options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Get the details for a person.
     */
    getPersonDetails(form?: GetPersonDetailsI, options?: RequestOptions): Promise<GetPersonDetailsResponse>;
    /**
     * @summary List the content for a person.
     */
    listPersonContent(form?: ListPersonContentI, options?: RequestOptions): Promise<ListPersonContentResponse>;
    /**
     * @summary Mark a person mention as read.
     */
    markCommentMentionAsRead(form: MarkPersonCommentMentionAsRead, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Mark a person post body mention as read.
     */
    markPostMentionAsRead(form: MarkPersonPostMentionAsRead, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Ban a person from your site.
     */
    banPerson(form: BanPerson, options?: RequestOptions): Promise<BanPersonResponse>;
    /**
     * @summary Get a list of users.
     */
    listUsers(form?: AdminListUsersI, options?: RequestOptions): Promise<AdminListUsersResponse>;
    /**
     * @summary Block a person.
     */
    blockPerson(form: BlockPerson, options?: RequestOptions): Promise<BlockPersonResponse>;
    /**
     * @summary Fetch a Captcha.
     */
    getCaptcha(options?: RequestOptions): Promise<GetCaptchaResponse>;
    /**
     * @summary Delete your account.
     */
    deleteAccount(form: DeleteAccount, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Reset your password.
     */
    passwordReset(form: PasswordReset, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Change your password from an email / token based reset.
     */
    passwordChangeAfterReset(form: PasswordChangeAfterReset, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Mark all replies as read.
     */
    markAllNotificationsAsRead(options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Save your user settings.
     */
    saveUserSettings(form: SaveUserSettings, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Change your user password.
     */
    changePassword(form: ChangePassword, options?: RequestOptions): Promise<LoginResponse>;
    /**
     * @summary Get counts for your reports.
     */
    getReportCount(form: GetReportCountI, options?: RequestOptions): Promise<GetReportCountResponse>;
    /**
     * @summary Get your unread counts.
     */
    getUnreadCount(options?: RequestOptions): Promise<GetUnreadCountResponse>;
    /**
     * @summary Get your inbox (replies, comment mentions, post mentions, and messages)
     */
    listInbox(form: ListInboxI, options?: RequestOptions): Promise<ListInboxResponse>;
    /**
     * @summary Verify your email
     */
    verifyEmail(form: VerifyEmail, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Resend a verification email.
     */
    resendVerificationEmail(form: ResendVerificationEmail, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary List your saved content.
     */
    listPersonSaved(form: ListPersonSavedI, options?: RequestOptions): Promise<ListPersonSavedResponse>;
    /**
     * @summary List your read content.
     */
    listPersonRead(form: ListPersonReadI, options?: RequestOptions): Promise<ListPersonReadResponse>;
    /**
     * @summary List your hidden content.
     */
    listPersonHidden(form: ListPersonHiddenI, options?: RequestOptions): Promise<ListPersonHiddenResponse>;
    /**
     * @summary List your liked content.
     */
    listPersonLiked(form: ListPersonLikedI, options?: RequestOptions): Promise<ListPersonLikedResponse>;
    /**
     * @summary Add an admin to your site.
     */
    addAdmin(form: AddAdmin, options?: RequestOptions): Promise<AddAdminResponse>;
    /**
     * @summary Get the unread registration applications count.
     */
    getUnreadRegistrationApplicationCount(options?: RequestOptions): Promise<GetUnreadRegistrationApplicationCountResponse>;
    /**
     * @summary List the registration applications.
     */
    listRegistrationApplications(form: ListRegistrationApplicationsI, options?: RequestOptions): Promise<ListRegistrationApplicationsResponse>;
    /**
     * @summary Approve a registration application
     */
    approveRegistrationApplication(form: ApproveRegistrationApplication, options?: RequestOptions): Promise<RegistrationApplicationResponse>;
    /**
     * @summary Get the application a user submitted when they first registered their account
     */
    getRegistrationApplication(form: GetRegistrationApplicationI, options?: RequestOptions): Promise<RegistrationApplicationResponse>;
    /**
     * @summary Purge / Delete a person from the database.
     */
    purgePerson(form: PurgePerson, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Purge / Delete a community from the database.
     */
    purgeCommunity(form: PurgeCommunity, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Purge / Delete a post from the database.
     */
    purgePost(form: PurgePost, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Purge / Delete a comment from the database.
     */
    purgeComment(form: PurgeComment, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Create a new custom emoji.
     */
    createCustomEmoji(form: CreateCustomEmoji, options?: RequestOptions): Promise<CustomEmojiResponse>;
    /**
     * @summary Edit an existing custom emoji.
     */
    editCustomEmoji(form: EditCustomEmoji, options?: RequestOptions): Promise<CustomEmojiResponse>;
    /**
     * @summary Delete a custom emoji.
     */
    deleteCustomEmoji(form: DeleteCustomEmoji, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary List custom emojis
     */
    listCustomEmojis(form: ListCustomEmojisI, options?: RequestOptions): Promise<ListCustomEmojisResponse>;
    /**
     * @summary Create a new tagline
     */
    createTagline(form: CreateTagline, options?: RequestOptions): Promise<TaglineResponse>;
    /**
     * @summary Edit an existing tagline
     */
    editTagline(form: UpdateTagline, options?: RequestOptions): Promise<TaglineResponse>;
    /**
     * @summary Delete a tagline
     */
    deleteTagline(form: DeleteTagline, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary List taglines.
     */
    listTaglines(form: ListTaglinesI, options?: RequestOptions): Promise<ListTaglinesResponse>;
    /**
     * @summary Create a community post tag.
     */
    createCommunityTag(form: CreateCommunityTag, options?: RequestOptions): Promise<Tag>;
    /**
     * @summary Update a community post tag.
     */
    updateCommunityTag(form: UpdateCommunityTag, options?: RequestOptions): Promise<Tag>;
    /**
     * @summary Delete a post tag in a community.
     */
    deleteCommunityTag(form: DeleteCommunityTag, options?: RequestOptions): Promise<Tag>;
    /**
     * @summary Create a new oauth provider method
     */
    createOAuthProvider(form: CreateOAuthProvider, options?: RequestOptions): Promise<OAuthProvider>;
    /**
     * @summary Edit an existing oauth provider method
     */
    editOAuthProvider(form: EditOAuthProvider, options?: RequestOptions): Promise<OAuthProvider>;
    /**
     * @summary Delete an oauth provider method
     */
    deleteOAuthProvider(form: DeleteOAuthProvider, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Authenticate with OAuth
     */
    authenticateWithOAuth(form: AuthenticateWithOauth, options?: RequestOptions): Promise<LoginResponse>;
    /**
     * @summary Fetch federated instances.
     */
    getFederatedInstances(options?: RequestOptions): Promise<GetFederatedInstancesResponse>;
    /**
     * @summary List user reports.
     */
    listReports(form: ListReportsI, options?: RequestOptions): Promise<ListReportsResponse>;
    /**
     * @summary Block an instance as user.
     */
    userBlockInstance(form: UserBlockInstanceParams, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Globally block an instance as admin.
     */
    adminBlockInstance(form: AdminBlockInstanceParams, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Globally allow an instance as admin.
     */
    adminAllowInstance(form: AdminAllowInstanceParams, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Upload new user avatar.
     */
    uploadUserAvatar(image: UploadImage, options?: RequestOptions): Promise<UploadImageResponse>;
    /**
     * @summary Delete the user avatar.
     */
    deleteUserAvatar(options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Upload new user banner.
     */
    uploadUserBanner(image: UploadImage, options?: RequestOptions): Promise<UploadImageResponse>;
    /**
     * @summary Delete the user banner.
     */
    deleteUserBanner(options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Upload new community icon.
     */
    uploadCommunityIcon(query: CommunityIdQueryI, image: UploadImage, options?: RequestOptions): Promise<UploadImageResponse>;
    /**
     * @summary Delete the community icon.
     */
    deleteCommunityIcon(form: CommunityIdQuery, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Upload new community banner.
     */
    uploadCommunityBanner(query: CommunityIdQueryI, image: UploadImage, options?: RequestOptions): Promise<UploadImageResponse>;
    /**
     * @summary Delete the community banner.
     */
    deleteCommunityBanner(form: CommunityIdQuery, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Upload new site icon.
     */
    uploadSiteIcon(image: UploadImage, options?: RequestOptions): Promise<UploadImageResponse>;
    /**
     * @summary Delete the site icon.
     */
    deleteSiteIcon(options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Upload new site banner.
     */
    uploadSiteBanner(image: UploadImage, options?: RequestOptions): Promise<UploadImageResponse>;
    /**
     * @summary Delete the site banner.
     */
    deleteSiteBanner(options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * @summary Upload an image to the server.
     */
    uploadImage(image: UploadImage, options?: RequestOptions): Promise<UploadImageResponse>;
    /**
     * @summary Health check for image functionality
     */
    imageHealth(options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * Mark donation dialog as shown, so it isn't displayed anymore.
     */
    donationDialogShown(options?: RequestOptions): Promise<SuccessResponse>;
    createMultiCommunity(form: CreateMultiCommunity, options?: RequestOptions): Promise<GetMultiCommunityResponse>;
    updateMultiCommunity(form: UpdateMultiCommunity, options?: RequestOptions): Promise<SuccessResponse>;
    getMultiCommunity(form: GetMultiCommunityI, options?: RequestOptions): Promise<GetMultiCommunityResponse>;
    createMultiCommunityEntry(form: CreateOrDeleteMultiCommunityEntry, options?: RequestOptions): Promise<SuccessResponse>;
    deleteMultiCommunityEntry(form: CreateOrDeleteMultiCommunityEntry, options?: RequestOptions): Promise<SuccessResponse>;
    listMultiCommunities(form: ListMultiCommunitiesI, options?: RequestOptions): Promise<ListMultiCommunitiesResponse>;
    followMultiCommunity(form: FollowMultiCommunity, options?: RequestOptions): Promise<SuccessResponse>;
    /**
     * Set the headers (can be used to set the auth header)
     */
    setHeaders(headers: {
        [key: string]: string;
    }): void;
}
/**
 * A Lemmy error type.
 *
 * The name is the i18n translatable error code.
 * The msg is either an empty string, or extra non-translatable info.
 */
export declare class LemmyError extends Error {
    constructor(name: string, msg?: string);
}
export {};
