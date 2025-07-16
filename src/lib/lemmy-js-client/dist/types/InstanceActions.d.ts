export type InstanceActions = {
    /**
     * When the instance was blocked.
     */
    blockedAt?: string;
    /**
     * When this user received a site ban.
     */
    receivedBanAt?: string;
    /**
     * When their ban expires.
     */
    banExpiresAt?: string;
};
