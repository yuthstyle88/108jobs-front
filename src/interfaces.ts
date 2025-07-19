import { ErrorPageData } from "@/utils/types";
import {
  CommentReply,
  CommentView,
  GetSiteResponse,
} from "./lib/lemmy-js-client";
import {RequestState} from "@/services/HttpService";

/**
 * This contains serialized data, it needs to be deserialized before use.
 */
export interface IsoData<T extends RouteData = any> {
  path: string;
  routeData: T;
  siteRes: GetSiteResponse;
  errorPageData?: ErrorPageData;
  lemmyExternalHost: string;
}

export type IsoDataOptionalSite<T extends RouteData = any> = Partial<
  IsoData<T>
> &
  Pick<IsoData<T>, Exclude<keyof IsoData<T>, "site_res">>;

declare global {
  interface Window {
    isoData: IsoData;
    checkLazyScripts?: () => void;
  }
}

export interface InitialFetchRequest<
  P extends Record<string, string> = Record<string, never>,
  T extends Record<string, any> = Record<string, never>,
> {
  path: string;
  query: T;
  params: P;
  site: GetSiteResponse;
  headers: { [key: string]: string };
}

export interface PostFormParams {
  name?: string;
  url?: string;
  body?: string;
  nsfw?: boolean;
  languageId?: number;
  communityId?: number;
  customThumbnail?: string;
  altText?: string;
}

export enum CommentViewType {
  Tree,
  Flat,
}

export enum DataType {
  Post,
  Comment,
}

export enum BanType {
  Community,
  Site,
}

export enum PersonDetailsView {
  Overview = "Overview",
  Comments = "Comments",
  Posts = "Posts",
  Saved = "Saved",
  Uploads = "Uploads",
  Upvoted = "Upvoted",
}

export enum PurgeType {
  Person,
  Community,
  Post,
  Comment,
}

export enum VoteType {
  Upvote,
  Downvote,
}

export enum VoteContentType {
  Post,
  Comment,
}

export type CommentNodeView = Omit<CommentView, "bannedFromCommunity"> &
  Partial<Pick<CommentView, "creatorBannedFromCommunity">> & {
  commentReply?: CommentReply;
};

export interface CommentNodeI {
  commentView: CommentNodeView;
  children: Array<CommentNodeI>;
  depth: number;
}

export type RouteData = Record<string, RequestState<any>>;
