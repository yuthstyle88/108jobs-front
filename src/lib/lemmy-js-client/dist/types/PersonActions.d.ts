export type PersonActions = {
    /**
     * When the person was blocked.
     */
    blockedAt?: string;
    /**
     * When the person was noted.
     */
    notedAt?: string;
    /**
     * A note about the person.
     */
    note?: string;
    /**
     * When the person was voted on.
     */
    votedAt?: string;
    /**
     * A total of upvotes given to this person
     */
    upvotes?: number;
    /**
     * A total of downvotes given to this person
     */
    downvotes?: number;
};
