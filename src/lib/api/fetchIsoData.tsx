/**
 * Server-side data fetching function for Next.js
 * 
 * This function fetches initial data for server-side rendering, including:
 * - Site configuration
 * - User information (if authenticated)
 * - Route-specific data based on the current URL
 * 
 * @param url The current URL being rendered
 * @param incomingHeaders HTTP headers from the incoming request
 * @returns An IsoData object containing all necessary data for rendering, or null if an error occurred
 */
import {ErrorPageData, InitialFetchRequest, IsoData, RouteData} from "@/utils/types";
import {Match} from "@/utils/router";
import {routes} from "@/utils/routes";
import {isAuthPath} from "@/utils/app";
import {getErrorPageData, getJwtCookie, matchPath, setForwardedHeaders} from "@/utils/helpers";
import {NextResponse} from "next/server";
import {FailedRequestState, HttpService, RequestState} from "@/services/HttpService";
import {GetSiteResponse, MyUserInfo} from "lemmy-js-client";
import {parsePath} from "history";
import {testHost} from "@/config";
import {IncomingHttpHeaders} from "http";

// Logger that only logs in development mode
const logger = {
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[fetchIsoData] ${message}`, ...args);
    }
  },
  error: (message: string, err?: unknown) => {
    const detail = err instanceof Error ? err.message : String(err);
    console.error(`[fetchIsoData] ${message}: ${detail}`);
  }
};

export default async function fetchIsoData(url: string, incomingHeaders: IncomingHttpHeaders): Promise<IsoData | null> {
  try {
    // Set up headers and authentication
    const headers = setForwardedHeaders(incomingHeaders);
    const auth = getJwtCookie(incomingHeaders);
    HttpService.client.setHeaders(headers);
    
    // Check authentication for protected routes
    if (!auth && isAuthPath(url)) {
      logger.debug(`Redirecting unauthenticated user from protected route: ${url}`);
      return NextResponse.redirect(new URL(`/login?prev=${encodeURIComponent(url)}`, origin)) as any;
    }

    // Fetch site data and user info in parallel for better performance
    logger.debug(`Fetching data for URL: ${url}`);
    const [trySite, tryUser] = await Promise.all([
      HttpService.client.getSite(),
      HttpService.client.getMyUser()
    ]);

    // Initialize data containers
    let siteRes: GetSiteResponse | undefined = undefined;
    let myUserInfo: MyUserInfo | undefined = undefined;
    let routeData: RouteData = {};
    let errorPageData: ErrorPageData | undefined = undefined;
    let match: Match<any> | null | undefined;
    let activeRoute;

    // Handle authentication errors
    if (tryUser.state === "failed" && tryUser.err.message === "not_logged_in") {
      logger.error("Incorrect JWT token, skipping auth so frontend can remove jwt cookie");
      HttpService.client.setHeaders({});
      const retryUser = await HttpService.client.getMyUser();
      if (retryUser.state === "success") {
        myUserInfo = retryUser.data;
      }
    } else if (tryUser.state === "success") {
      myUserInfo = tryUser.data;
    }

    // Process site data and find matching route
    if (trySite.state === "success") {
      siteRes = trySite.data;
      
      // Find the active route for the current URL
      activeRoute = routes.find(
        route => (match = matchPath(route.path, url)),
      );
      
      // Fetch route-specific data if available
      if (siteRes && activeRoute?.fetchInitialData && match) {
        const { search } = parsePath(url);
        const initialFetchReq: InitialFetchRequest<Record<string, any>> = {
          path: url,
          query: activeRoute.getQueryParams?.(search, siteRes) ?? {},
          match,
          site: siteRes,
          headers: headers,
        };

        // Development-only code to test race conditions
        if (process.env.NODE_ENV === "development" && process.env.SIMULATE_RACE_CONDITIONS === "true") {
          setTimeout(() => {
            // Intentionally break things if fetchInitialData tries to use global state
            // after the first await of an unresolved promise.
            myUserInfo = undefined;
          });
        }
        
        try {
          routeData = await activeRoute.fetchInitialData(initialFetchReq);
        } catch (routeError) {
          logger.error(`Error fetching route data for ${url}`, routeError);
          errorPageData = getErrorPageData(
            new Error(`Failed to fetch route data: ${(routeError as Error).message}`), 
            siteRes
          );
        }
      }
    } else if (trySite.state === "failed") {
      logger.error(`Failed to fetch site data: ${trySite.err.message}`);
      errorPageData = getErrorPageData(new Error(trySite.err.message), undefined);
    }

    // Check for errors in route data
    const error = Object.values(routeData).find(
      res => res.state === "failed" && res.err.message !== "couldnt_find_object",
    ) as FailedRequestState | undefined;

    if (error) {
      logger.error(`Error in route data: ${error.err.message}`, error.err);
      errorPageData = getErrorPageData(new Error(error.err.message), siteRes);
      
      // Return partial data with error information instead of null
      return {
        path: url,
        siteRes: siteRes,
        myUserInfo,
        routeData: {}, // Empty route data since there was an error
        errorPageData,
        lemmyExternalHost: process.env.LEMMY_UI_LEMMY_EXTERNAL_HOST ?? testHost,
      };
    }

    // Return the complete data
    return {
      path: url,
      siteRes: siteRes,
      myUserInfo,
      routeData,
      errorPageData,
      lemmyExternalHost: process.env.LEMMY_UI_LEMMY_EXTERNAL_HOST ?? testHost,
    };
  } catch (err) {
    // Log the error and return a structured error response
    logger.error("Unhandled error in fetchIsoData", err);
    
    return {
      path: url,
      siteRes: undefined,
      myUserInfo: undefined,
      routeData: {},
      errorPageData: getErrorPageData(err as Error, undefined),
      lemmyExternalHost: process.env.LEMMY_UI_LEMMY_EXTERNAL_HOST ?? testHost,
    };
  }
}