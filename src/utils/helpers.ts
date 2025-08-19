import {isSuccess, RequestState} from "@/services/HttpService";
import {
    CommunityId,
    CommunityNodeView,
    CommunityResponse,
    GetSiteResponse,
    JobType,
    ListCommunitiesResponse,
    PaginationCursor,
    UploadImageResponse
} from "lemmy-js-client";
import {IncomingHttpHeaders} from "http";
import * as cookie from "cookie";
import {authCookieName} from "@/utils/config";
import {Match} from "@/utils/router";
import {ErrorPageData} from "@/utils/types";

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait = 1000,
    immediate = false
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        const callNow = immediate && !timeout;

        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
                timeout = null;
                if (!immediate) {
                    func.apply(this,
                        args); // ✅ ใช้ this โดยตรงใน arrow function
                }
            },
            wait);

        if (callNow) {
            func.apply(this,
                args); // ✅ ใช้ this โดยตรง
        }
    };
}

type ImmutableListKey =
    | "comment"
    | "commentReply"
    | "personPostMention"
    | "personCommentMention"
    | "community"
    | "privateMessage"
    | "post"
    | "postReport"
    | "commentReport"
    | "privateMessageReport"
    | "registrationApplication";

export function editListImmutable<
    T extends { [key in F]: { id: number } },
    F extends ImmutableListKey,
>(fieldName: F, data: T, list: T[]): T[] {
    return [
        ...list.map(c => (c[fieldName].id === data[fieldName].id ? data : c)),
    ];
}

export function getIdFromString(id?: string): number | undefined {
    return id && id !== "0" && !Number.isNaN(Number(id)) ? Number(id) : undefined;
}

export function getBoolFromString(boolStr?: string): boolean | undefined {
    return boolStr ? boolStr.toLowerCase() === "true" : undefined;
}

export function getPageCursorFromString(
    pageCursor?: string,
): PaginationCursor | undefined {
    return pageCursor ? pageCursor : undefined;
}

type Empty = NonNullable<unknown>;

type QueryMapping<PropsT, FallbacksT extends Empty> = {
    [K in keyof PropsT]-?: (
        input: string | undefined,
        fallback: K extends keyof FallbacksT ? FallbacksT[K] : undefined,
    ) => PropsT[K];
};

export default function getQueryParams<
    PropsT extends Record<string, any>,
    FallbacksT extends Partial<PropsT> = Empty
>(
    processors: QueryMapping<PropsT, FallbacksT>,
    source?: string,
    fallbacks: FallbacksT = {} as FallbacksT,
): PropsT {
    const searchParams = new URLSearchParams(source);
    const ret = {} as PropsT;

    for (const key of Object.keys(processors) as (keyof typeof processors)[]) {
        const processor = processors[key];
        const raw = searchParams.get(key as string) ?? undefined;

        // fallback ต้องกำหนด fallback[key] อย่างระมัดระวัง
        const fallback = (fallbacks?.[key] ?? undefined) as PropsT[typeof key];

        // processor return type ต้องตรงกับ PropsT[key]
        ret[key] = processor(raw,
            fallback);
    }

    return ret;
}

export function getQueryString<T extends Record<string, string | undefined>>(
    obj: T,
) {
    const searchParams = new URLSearchParams();
    Object.entries(obj)
        .filter(([, val]) => val !== undefined && val !== null)
        .forEach(([key, val]) => searchParams.set(key,
            val ?? ""));
    const params = searchParams.toString();
    if (params) {
        return "?" + params;
    }
    return "";
}

export function getRandomCharFromAlphabet(alphabet: string): string {
    return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

export function getRandomFromList<T>(list: T[]): T | undefined {
    return list.length === 0
        ? undefined
        : list.at(Math.floor(Math.random() * list.length));
}

export function groupBy<T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => string,
) {
    return array.reduce(
        (acc, value, index, array) => {
            (acc[predicate(value,
                index,
                array)] ||= []).push(value);
            return acc;
        },
        {} as { [key: string]: T[] },
    );
}

export function hostname(url: string): string {
    const cUrl = new URL(url);
    return cUrl.port ? `${cUrl.hostname}:${cUrl.port}` : `${cUrl.hostname}`;
}

export function hsl(num: number) {
    return `hsla(${num}, 35%, 50%, 0.5)`;
}

const SHORTNUM_SI_FORMAT = new Intl.NumberFormat("en-US",
    {
        maximumSignificantDigits: 3,
        notation: "compact",
        compactDisplay: "short",
    });

export function numToSI(value: number): string {
    return SHORTNUM_SI_FORMAT.format(value);
}

export function sleep(millis: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve,
        millis));
}

/**
 * Polls / repeatedly runs a promise, every X milliseconds
 */
export async function poll(promiseFn: any, millis: number) {
    if (window.document.visibilityState !== "hidden") {
        await promiseFn();
    }
    await sleep(millis);
    return poll(promiseFn,
        millis);
}

const DEFAULT_ALPHABET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function randomStr(
    idDesiredLength = 20,
    alphabet = DEFAULT_ALPHABET,
): string {
    /**
     * Create n-long array and map it to random chars from given alphabet.
     * Then join individual chars as string
     */
    return Array.from({length: idDesiredLength})
        .map(() => {
            return getRandomCharFromAlphabet(alphabet);
        })
        .join("");
}

export function resourcesSettled(resources: RequestState<any>[]) {
    return resources.every(r => r.state === "success" || r.state === "failed");
}

export function validEmail(email: string) {
    const re =
        /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const tldRegex = /([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+/;

export function validInstanceTLD(str: string) {
    return tldRegex.test(str);
}

/*
 * EditForm if the Title is in a valid format:
 *   (?=.*\S.*) checks if the title consists of only whitespace characters
 *   (?=^[^\r\n]+$) checks if the title contains newlines
 */
const validTitleRegex = new RegExp(/(?=(.*\S.*))(?=^[^\r\n]+$)/,
    "g");

export function validTitle(title?: string): boolean {
    // Initial title is null, minimum length is taken care of by textarea's minLength={3}
    if (!title || title.length < 3) return true;

    return validTitleRegex.test(title);
}

export function validURL(str: string) {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

export function dedupByProperty<
    T extends Record<string, any>,
    R extends number | string | boolean,
>(collection: T[], keyFn: (obj: T) => R) {
    return collection.reduce(
        (acc, cur) => {
            const key = keyFn(cur);
            if (!acc.foundSet.has(key)) {
                acc.output.push(cur);
                acc.foundSet.add(key);
            }

            return acc;
        },
        {
            output: [] as T[],
            foundSet: new Set<R>(),
        },
    ).output;
}

export function getApubName({name, ap_id}: { name: string; ap_id: string }) {
    return `${name}@${hostname(ap_id)}`;
}

/**
 * Next.js-style dynamic route matcher (e.g. `/post/[id]`)
 * Optimized with memoization to improve performance for repeated route matching
 */
// Cache for storing the results of matchPath
const matchPathCache = new Map<string, Match<any> | null>();
const CACHE_SIZE_LIMIT = 100;

export function matchPath(
    pathPattern?: string,
    urlPath?: string
): Match<any> | null {
    // Early return for invalid inputs
    if (!pathPattern || !urlPath) return null;

    // Create a cache key
    const cacheKey = `${pathPattern}:${urlPath}`;

    // Check if result is in cache
    if (matchPathCache.has(cacheKey)) {
        return matchPathCache.get(cacheKey)!;
    }

    // Limit cache size to prevent memory leaks
    if (matchPathCache.size >= CACHE_SIZE_LIMIT) {
        // Remove oldest entry (first key in the map)
        const iterator = matchPathCache.keys().next();
        if (!iterator.done) {
            matchPathCache.delete(iterator.value); // iterator.value เป็น string แน่นอน
        }
    }

    const patternParts = pathPattern.split("/").filter(Boolean);
    const urlParts = urlPath.split("/").filter(Boolean);

    if (urlParts.length > patternParts.length) {
        matchPathCache.set(cacheKey,
            null);
        return null;
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
        const pattern = patternParts[i];
        const part = urlParts[i];

        const isOptional = pattern.endsWith("?") || /\[\w+\?\]/.test(pattern);
        const isParam = pattern.startsWith(":") || /^\[\w+\??\]$/.test(pattern);

        if (isParam) {
            const key = pattern
                .replace(/^\:/,
                    "")      // :param → param
                .replace(/^\[|\]$/g,
                    "") // [param] → param
                .replace(/\?$/,
                    "");     // param? → param

            if (part !== undefined) {
                params[key] = decodeURIComponent(part);
            } else if (!isOptional) {
                matchPathCache.set(cacheKey,
                    null);
                return null;
            }
        } else if (pattern !== part) {
            matchPathCache.set(cacheKey,
                null);
            return null;
        }
    }

    const result = {
        params,
        path: urlPath,
        url: urlPath,
        isExact: urlParts.length === patternParts.length,
    } as Match<any>;

    // Cache the result
    matchPathCache.set(cacheKey,
        result);

    return result;
}

export function getJwtCookie(headers: IncomingHttpHeaders): string | undefined {
    return headers.cookie
        ? cookie.parse(headers.cookie)[authCookieName] // This can actually be undefined
        : undefined;
}

export function setForwardedHeaders(headers: IncomingHttpHeaders): {
    [key: string]: string;
} {
    const out: { [key: string]: string } = {};

    if (headers.host) {
        out.host = headers.host;
    }

    const realIp = headers["x-real-ip"];

    if (realIp) {
        out["x-real-ip"] = realIp as string;
    }

    const forwardedFor = headers["x-forwarded-for"];

    if (forwardedFor) {
        out["x-forwarded-for"] = forwardedFor as string;
    }

    const auth = getJwtCookie(headers);

    if (auth) {
        out["Authorization"] = `Bearer ${auth}`;
    }

    return out;
}

/**
 * Creates error page data with improved error handling and null safety
 *
 * @param error The error that occurred
 * @param site Optional site data containing admin information
 * @returns Structured error page data for rendering
 */
export function getErrorPageData(error: Error, site?: GetSiteResponse): ErrorPageData {
    const errorPageData: ErrorPageData = {};

    // Always include error message for better debugging
    errorPageData.error = error?.message || 'Unknown error';

    // Safely extract admin matrix IDs with null checks
    if (site?.admins) {
        const adminMatrixIds = site.admins
            .filter(admin => admin?.person)
            .map(({person}) => person.matrixUserId)
            .filter(Boolean) as string[] | undefined;

        // ใช้ Array.isArray เพื่อยืนยันว่าเป็นอาร์เรย์ก่อนตรวจ length
        if (Array.isArray(adminMatrixIds) && adminMatrixIds.length > 0) {
            errorPageData.adminMatrixIds = adminMatrixIds;
        }
    }

    return errorPageData;
}

/**
 * Converts a string URL, File, or Blob to a Blob object
 *
 * @param src The source (URL string, File, or Blob)
 * @returns A Promise resolving to a Blob
 */
async function toBlob(src: string | File | Blob): Promise<Blob> {
    if (typeof src === "string") {
        return fetch(src).then((r) => r.blob());
    }
    return src;
}

/**
 * Uploads an image and returns the URL of the uploaded image
 *
 * @param selectedImage The image to upload (File or string URL/base64)
 * @param uploadImage Function to handle the actual upload
 * @returns A Promise resolving to the URL of the uploaded image
 * @throws Error if the upload fails
 */
export async function uploadSelectedImage(
    selectedImage: File | string,
    uploadImage: (payload: { image: File }) => Promise<any>
): Promise<string> {
    let file: File;

    if (selectedImage instanceof File) {
        file = selectedImage;
    } else {
        const blob = await toBlob(selectedImage);
        file = new File([blob], "profile.jpg", {
            type: blob.type || "image/jpeg",
        });
    }

    const result = await uploadImage({image: file});

    if (isSuccess(result) && result.data?.imageUrl) {
        return result.data.imageUrl;
    }

    console.error("Upload failed response:", result);
    throw new Error("Image upload failed");
}

export function stripEmpty<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([_, v]) =>
                v !== "" &&
                v !== undefined &&
                v !== null &&
                !(typeof v === "object" && v !== null && Object.keys(v).length === 0)
        )
    ) as Partial<T>;
}

export function assertExists<T>(value: T | null | undefined, message?: string): T {
    if (value == null) throw new Error(message ?? "Expected value to be present but got null or undefined");
    return value;
}

export function toCamelCaseLastSegment(path: string): string {
    const last = path.split('.').pop() || '';
    return last
        .replace(/[_-](\w)/g, (_, c) => c.toUpperCase()) // snake_case → camelCase
        .replace(/^([A-Z])/, (_, c) => c.toLowerCase()); // lowercase first letter if needed
}

export const formatDate = (dateString: string): string => {
    if (!dateString || dateString === "-") return "-";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("th-TH-u-ca-gregory", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return "-";
    }
};

export const formatBudget = (budget: string | number | null | undefined): string => {
    if (!budget) return "-";
    try {
        const amount = parseFloat(String(budget));
        return isNaN(amount) ? "-" : amount.toLocaleString();
    } catch (error) {
        console.error("Error formatting budget:", error);
        return "-";
    }
};

export const getJobTypeLabel = (jobType: string | null | undefined, t: (key: string) => string): string => {
    if (!jobType) return "-";
    const typeMap: Record<string, string> = {
        [JobType.FullTime]: t("profileJob.tableFullTimeLabel"),
        [JobType.PartTime]: t("profileJob.tablePartTimeLabel"),
        [JobType.Contract]: t("profileJob.tableContractLabel"),
        [JobType.Freelance]: t("profileJob.tableFreelanceLabel"),
    };
    return typeMap[jobType] || jobType;
};

export function buildCommunitiesTree(listCommunitiesResponse: ListCommunitiesResponse | undefined) {
    const tree: CommunityNodeView[] = [];
    const map = new Map<CommunityId, CommunityNodeView>();
    listCommunitiesResponse?.communities.forEach(c => {
        map.set(c.community.id, {...c, children: []});
    });

    listCommunitiesResponse?.communities.forEach(c => {
        const node = map.get(c.community.id);
        if (!node) return;


        const pathParts = c.community.path.split('.');

        if (pathParts.length === 2) {
            tree.push(node);
        } else {
            const parentPath = pathParts.slice(0, -1).join('.');
            const parent = Array.from(map.values()).find(
                n => n.community.path === parentPath
            );
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(node);
            }
        }
    });

    return tree;
}

export function getCommunitiesAtLevel(catalogData: ListCommunitiesResponse | undefined, level: number) {
    if (!catalogData || level < 1) {
        return [];
    }

    return catalogData.communities.filter(c => c.community.path.split('.').length === level);
}

