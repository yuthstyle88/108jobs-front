export type PersonActions = {
    /**
       * When the person was blocked.
       */
    blocked_at?: string;
    /**
     * When the person was noted.
     */
    noted_at?: string;
    /**
     * A note about the person.
     */
    note?: string;
    /**
     * When the person was voted on.
     */
    voted_at?: string;
    /**
     * A total of upvotes given to this person
     */
    upvotes?: number;
    /**
     * A total of downvotes given to this person
     */
    downvotes?: number;
};
