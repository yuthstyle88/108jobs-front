import { ErrorPageData } from "@/utils/types";
import {
  GetSiteResponse,
} from "./lib/lemmy-js-client";
import {RequestState} from "@/services/HttpService";

export type RouteData = Record<string, RequestState<any>>;
/**
 * This contains serialized data, it needs to be deserialized before use.
 */
export interface IsoData<T extends RouteData = any> {
  path: string;
  routeData: T;
  siteRes: GetSiteResponse;
  errorPageData?: ErrorPageData;
  showAdultConsentModal: boolean;
  lemmyExternalHost: string;
}

export type IsoDataOptionalSite<T extends RouteData = any> = Partial<
  IsoData<T>
> &
  Pick<IsoData<T>, Exclude<keyof IsoData<T>, "siteRes">>;

declare global {
  interface Window {
    isoData: IsoData;
    checkLazyScripts?: () => void;
  }
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

declare global {
  interface Window {
    isoData: IsoData;
    checkLazyScripts?: () => void;
  }
}
