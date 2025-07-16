import { AdminListUsers } from "@/lib/lemmy-js-client";
import { CommunityIdQuery } from "@/lib/lemmy-js-client";
import { DeleteImageParams } from "@/lib/lemmy-js-client";
import { GetComment } from "./types/GetComment";
import { GetComments } from "./types/GetComments";
import { GetCommunity } from "./types/GetCommunity";
import { GetCommunityPendingFollowsCount } from "@/lib/lemmy-js-client";
import { GetModlog } from "./types/GetModlog";
import { GetMultiCommunity } from "@/lib/lemmy-js-client";
import { GetPersonDetails } from "@/lib/lemmy-js-client";
import { GetPost } from "./types/GetPost";
import { GetPosts } from "./types/GetPosts";
import { GetRandomCommunity } from "@/lib/lemmy-js-client";
import { GetRegistrationApplication } from "@/lib/lemmy-js-client";
import { GetReportCount } from "@/lib/lemmy-js-client";
import { GetSiteMetadata } from "@/lib/lemmy-js-client";
import { ListCommentLikes } from "@/lib/lemmy-js-client";
import { ListCommunities } from "@/lib/lemmy-js-client";
import { ListCommunityPendingFollows } from "@/lib/lemmy-js-client";
import { ListCustomEmojis } from "@/lib/lemmy-js-client";
import { ListInbox } from "./types/ListInbox";
import { ListMedia } from "./types/ListMedia";
import { ListMultiCommunities } from "@/lib/lemmy-js-client";
import { ListPersonContent } from "@/lib/lemmy-js-client";
import { ListPersonHidden } from "@/lib/lemmy-js-client";
import { ListPersonLiked } from "@/lib/lemmy-js-client";
import { ListPersonRead } from "@/lib/lemmy-js-client";
import { ListPersonSaved } from "@/lib/lemmy-js-client";
import { ListPostLikes } from "./types/ListPostLikes";
import { ListRegistrationApplications } from "@/lib/lemmy-js-client";
import { ListReports } from "./types/ListReports";
import { ListTaglines } from "./types/ListTaglines";
import { ResolveObject } from "./types/ResolveObject";
import { Search } from "./types/Search";
export declare const VERSION = "v4";
export interface UploadImage {
    image: File | Buffer;
}
export interface ListMediaI extends ListMedia {
}
export interface GetModlogI extends GetModlog {
}
export interface SearchI extends Search {
}
export interface ResolveObjectI extends ResolveObject {
}
export interface GetCommunityI extends GetCommunity {
}
export interface ListCommunitiesI extends ListCommunities {
}
export interface GetCommunityPendingFollowsCountI extends GetCommunityPendingFollowsCount {
}
export interface ListCommunityPendingFollowsI extends ListCommunityPendingFollows {
}
export interface GetRandomCommunityI extends GetRandomCommunity {
}
export interface GetPostI extends GetPost {
}
export interface GetPostsI extends GetPosts {
}
export interface ListPostLikesI extends ListPostLikes {
}
export interface GetSiteMetadataI extends GetSiteMetadata {
}
export interface ListCommentLikesI extends ListCommentLikes {
}
export interface GetCommentsI extends GetComments {
}
export interface GetCommentI extends GetComment {
}
export interface GetPersonDetailsI extends GetPersonDetails {
}
export interface ListPersonContentI extends ListPersonContent {
}
export interface GetReportCountI extends GetReportCount {
}
export interface ListInboxI extends ListInbox {
}
export interface ListPersonSavedI extends ListPersonSaved {
}
export interface ListPersonReadI extends ListPersonRead {
}
export interface ListPersonHiddenI extends ListPersonHidden {
}
export interface ListPersonLikedI extends ListPersonLiked {
}
export interface ListRegistrationApplicationsI extends ListRegistrationApplications {
}
export interface GetRegistrationApplicationI extends GetRegistrationApplication {
}
export interface ListCustomEmojisI extends ListCustomEmojis {
}
export interface ListTaglinesI extends ListTaglines {
}
export interface ListReportsI extends ListReports {
}
export interface DeleteImageParamsI extends DeleteImageParams {
}
export interface AdminListUsersI extends AdminListUsers {
}
export interface CommunityIdQueryI extends CommunityIdQuery {
}
export interface ListMultiCommunitiesI extends ListMultiCommunities {
}
export interface GetMultiCommunityI extends GetMultiCommunity {
}
