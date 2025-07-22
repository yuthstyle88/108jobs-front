// Route definitions for converting Lemmy Inferno Router to Next.js routing structure

// This list maps the routes to their corresponding Next.js page structure (for reference or generation tools)
// Actual pages should be placed under /app or /pages depending on routing mode
import { GetSiteResponse, MyUserInfo } from "lemmy-js-client";
import { InitialFetchRequest, RouteData } from "@/utils/types";
import {LoginForm, getLoginQueryParams} from "@/components/Authentication/LoginForm";
import { LoginFetchConfig } from "@/components/Authentication/LoginForm/interface";

type RouteComponentProps<PathPropsT> = {
  params: PathPropsT;
};

export interface IRoutePropsWithFetch<
  DataT extends RouteData,
  PathPropsT extends Record<string, string>,
  QueryPropsT extends Record<string, any>,
>  {
  fetchInitialData?(
    req: InitialFetchRequest<PathPropsT, QueryPropsT>,
  ): Promise<DataT>;
  getQueryParams?(
    source: string,
    siteRes: GetSiteResponse,
    myUserInfo?: MyUserInfo,
  ): QueryPropsT;
  component: React.ComponentType<RouteComponentProps<PathPropsT> & QueryPropsT>;
  mountedSameRouteNavKey?: string;
}

export const routes: IRoutePropsWithFetch<RouteData, any, any>[] = [
  {
    path: `/login`,
    component: LoginForm,
    getQueryParams: getLoginQueryParams,
  } as LoginFetchConfig,
];