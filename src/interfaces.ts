import { ErrorPageData } from "@/utils/types";
import {
  GetSiteResponse,
} from "lemmy-js-client";
import {RequestState} from "@/lib/services/HttpService";

export type RouteData = Record<string, RequestState<any>>;
/**
 * This contains serialized data, it needs to be deserialized before use.
 */
export interface IsoData<T extends RouteData = any> {
  path: string;
  routeData: T;
  site_res: GetSiteResponse;
  errorPageData?: ErrorPageData;
  showAdultConsentModal: boolean;
  lemmy_external_host: string;
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

export interface PostFormParams {
  name?: string;
  url?: string;
  body?: string;
  nsfw?: boolean;
  language_id?: number;
  community_id?: number;
  custom_thumbnail?: string;
  alt_text?: string;
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
