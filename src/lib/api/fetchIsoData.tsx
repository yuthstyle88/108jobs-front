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
import {isAuthPath} from "@/utils/app";
import {getJwtCookie, setForwardedHeaders} from "@/utils/helpers";
import {ErrorPageData, IsoData, RouteData} from "@/utils/types";
import {IncomingHttpHeaders} from "http";
import {GetSiteResponse, MyUserInfo} from "lemmy-js-client";
import {NextResponse} from "next/server";
import {HttpService} from "@/services";
import {REQUEST_STATE} from "@/services/HttpService";
import {testHost} from "@/utils/config";

/**
 * Optimized logger that conditionally logs based on environment
 * - In development: Provides detailed logs for debugging
 * - In production: Minimizes logging to improve performance
 */
const logger = {
  /**
   * Log debug messages (development only)
   */
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[fetchIsoData] ${message}`,
        ...args);
    }
  },

  /**
   * Log error messages with improved type safety and clarity.
   * - In development: Use console.error with detailed info and error object.
   * - In production: Use console.warn with minimal info.
   */
  error: (message: string, err?: unknown) => {
    const prefix = `[fetchIsoData] ${message}`;
    const isDev = process.env.NODE_ENV === "development";

    if (!err) {
      if (isDev) {
        console.error(prefix);
      } else {
        console.warn(prefix);
        return;
      }
      return;
    }

    const detail = err instanceof Error
      ? err.message.trim()
      : typeof err === "string"
        ? err.trim()
        : JSON.stringify(err);

    const output = detail ? `${prefix}: ${detail}` : prefix;

    if (isDev) {
      console.error(output, err);
    } else {
      console.warn(output);
      return;
    }
  }
};

export default async function fetchIsoData(url: string, incomingHeaders: IncomingHttpHeaders): Promise<IsoData | null> {
  let siteRes: GetSiteResponse; // Declare without `undefined`
  let myUserInfo: MyUserInfo | undefined = undefined;
  const routeData: RouteData = {};
  const errorPageData: ErrorPageData | undefined = undefined;

  try {
    // Set up headers and authentication
    const headers = setForwardedHeaders(incomingHeaders);
    const auth = getJwtCookie(incomingHeaders);
    await HttpService.client.setHeaders(headers);

    // Check authentication for protected routes
    if (!auth && isAuthPath(url)) {
      logger.debug(`Redirecting unauthenticated user from protected route: ${url}`);
      return NextResponse.redirect(new URL(`/login?prev=${encodeURIComponent(url)}`, origin)) as unknown as IsoData;
    }

    // Fetch site data and user data
    const [trySite, tryUser] = await Promise.all([
      HttpService.client.getSite(),
      HttpService.client.getMyUser()
    ]);

    // Ensure `siteRes` is valid and required
    if (trySite.state === REQUEST_STATE.SUCCESS && trySite.data) {
      siteRes = trySite.data;
    } else {
      throw new Error("Failed to fetch required site data."); // Throw error if `siteRes` is not retrieved
    }

    // Optional: Process user data
    if (tryUser.state === REQUEST_STATE.SUCCESS) {
      myUserInfo = tryUser.data;
    }

    return createIsoDataResponse(
      url,
      siteRes, // Pass siteRes (already validated)
      myUserInfo,
      routeData,
      errorPageData
    );

  } catch (err) {
    // Log the error and return a structured error
    logger.error("Unhandled error in fetchIsoData", err);
    return null;
  }

  /**
   * Create a standardized IsoData response object
   */
  function createIsoDataResponse(
    path: string,
    siteRes: GetSiteResponse,
    myUserInfo?: MyUserInfo,
    routeData: RouteData = {},
    errorPageData?: ErrorPageData
  ): IsoData {
    return {
      path,
      siteRes, // Ensure the required variable
      myUserInfo,
      routeData,
      errorPageData,
      lemmyExternalHost: process.env.LEMMY_UI_LEMMY_EXTERNAL_HOST ?? testHost,
    };
  }
}