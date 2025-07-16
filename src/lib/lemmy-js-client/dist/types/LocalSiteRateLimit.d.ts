import type { LocalSiteId } from "./LocalSiteId";
/**
 * Rate limits for your site. Given in count / length of time.
 */
export type LocalSiteRateLimit = {
    localSiteId: LocalSiteId;
    messageMaxRequests: number;
    messageIntervalSeconds: number;
    postMaxRequests: number;
    postIntervalSeconds: number;
    registerMaxRequests: number;
    registerIntervalSeconds: number;
    imageMaxRequests: number;
    imageIntervalSeconds: number;
    commentMaxRequests: number;
    commentIntervalSeconds: number;
    searchMaxRequests: number;
    searchIntervalSeconds: number;
    publishedAt: string;
    updatedAt?: string;
    importUserSettingsMaxRequests: number;
    importUserSettingsIntervalSeconds: number;
};
