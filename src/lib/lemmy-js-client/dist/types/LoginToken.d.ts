import type { LocalUserId } from "./LocalUserId";
/**
 * Stores data related to a specific user login session.
 */
export type LoginToken = {
    userId: LocalUserId;
    /**
     * Time of login
     */
    publishedAt: string;
    /**
     * IP address where login was made from, allows invalidating logins by IP address.
     * Could be stored in truncated format, or store derived information for better privacy.
     */
    ip?: string;
    user_agent?: string;
};
