// lib/fetchIsoData.ts
import {cookies} from "next/headers";
import {ErrorPageData, InitialFetchRequest, IsoData, RouteData} from "@/utils/types";
import {Match,} from "@/utils/router";
import {routes,} from "@/utils/routes";
import {communityToChoice, isAuthPath} from "@/utils/app";
import {getErrorPageData, getJwtCookie, matchPath, setForwardedHeaders} from "@/utils/helpers";
import {NextRequest, NextResponse} from "next/server";
import {FailedRequestState, wrapClient,} from "@/services/HttpService";
import {getHttpBaseInternal} from "@/utils/env";
import {GetSiteResponse, LemmyHttp, MyUserInfo} from "lemmy-js-client";
import {parsePath} from "history";
import {testHost} from "@/config";
import {IncomingHttpHeaders} from "http";

export default async function fetchIsoData(path: string, url: string,incomingHeaders: IncomingHttpHeaders): Promise<IsoData | null> {
  try {
    const cookieStore = cookies();

    // Example: Read incoming headers from the request
    // const userAgent = req.headers.get("user-agent");
    // const acceptLang = req.headers.get("accept-language");
    // Convert Headers to plain object

    const headers = setForwardedHeaders(incomingHeaders);
    const auth = getJwtCookie(incomingHeaders);
    console.log("headers", headers);
    let match: Match<any> | null | undefined;
    const host = getHttpBaseInternal();
    console.log("host", host);
    const client = wrapClient(
      new LemmyHttp(getHttpBaseInternal(), { headers }),
    );

    let activeRoute;
    const trySite = await client.getSite();
    console.log("trySite", trySite.state);
    if (trySite.state === "success") {
      const { search } = parsePath(url);
      console.log("search", search);
      activeRoute = routes.find(route => {
        const queryParams = route.getQueryParams?.(search, trySite.data);
        console.log("queryParams", queryParams);
        match = matchPath(path, queryParams?.source);
      });
    }


    // Get site data first
    // This bypasses errors, so that the client can hit the error on its own,
    // in order to remove the jwt on the browser. Necessary for wrong jwts
    let siteRes: GetSiteResponse | undefined = undefined;
    let myUserInfo: MyUserInfo | undefined = undefined;
    let routeData : RouteData = {};
    let errorPageData: ErrorPageData | undefined = undefined;
    let tryUser = await client.getMyUser();

    if (!auth && isAuthPath(path)) {
      NextResponse.redirect(new URL(`/login?prev=${encodeURIComponent(url)}`, origin));
      return null;
    }
    console.log("myUserInfo", tryUser.state);
    if (tryUser.state === "failed" && tryUser.err.message === "not_logged_in") {
      console.error(
        "Incorrect JWT token, skipping auth so frontend can remove jwt cookie",
      );
      client.setHeaders({});
      tryUser = await client.getMyUser();
    }

    if (tryUser.state === "success") {
      myUserInfo = tryUser.data;
    }

    if (trySite.state === "success") {
      siteRes = trySite.data;

      if (siteRes && activeRoute?.fetchInitialData && match) {
        const { search } = parsePath(url);
        const initialFetchReq: InitialFetchRequest<Record<string, any>> = {
          path,
          query: activeRoute.getQueryParams?.(search, siteRes) ?? {},
          match,
          site: siteRes,
          headers: forwardedHeaders,
        };

        if (process.env.NODE_ENV === "development") {
          setTimeout(() => {
            // Intentionally (likely) break things if fetchInitialData tries to
            // use global state after the first await of an unresolved promise.
            // This simulates another request entering or leaving this
            // "success" block.
            myUserInfo = undefined;
          });
        }
        routeData = await activeRoute.fetchInitialData(initialFetchReq);
      }
    } else if (trySite.state === "failed") {
      errorPageData = getErrorPageData(new Error(trySite.err.message), siteRes);
    }

    const error = Object.values(routeData).find(
      res =>
        res.state === "failed" && res.err.message !== "couldnt_find_object", // TODO: find a better way of handling errors
    ) as FailedRequestState | undefined;

    if (error) {
      console.error(error.err);
      errorPageData = getErrorPageData(new Error(error.err.message), siteRes);
      return null;
    }

    return {
      path,
      siteRes: siteRes,
      myUserInfo,
      routeData,
      errorPageData,
      lemmyExternalHost: process.env.LEMMY_UI_LEMMY_EXTERNAL_HOST ?? testHost,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}