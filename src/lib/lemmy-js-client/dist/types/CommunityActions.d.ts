import type { CommunityFollowerState } from "./CommunityFollowerState";
export type CommunityActions = {
    /**
     * When the community was followed.
     */
    followedAt?: string;
    /**
     * The state of the community follow.
     */
    followState?: CommunityFollowerState;
    /**
     * When the community was blocked.
     */
    blockedAt?: string;
    /**
     * When this user became a moderator.
     */
    becameModeratorAt?: string;
    /**
     * When this user received a ban.
     */
    receivedBanAt?: string;
    /**
     * When their ban expires.
     */
    banExpiresAt?: string;
};
