export type PostActions = {
    /**
     * When the post was read.
     */
    readAt?: string;
    /**
     * When was the last time you read the comments.
     */
    readCommentsAt?: string;
    /**
     * The number of comments you read last. Subtract this from total comments to get an unread
     * count.
     */
    readCommentsAmount?: number;
    /**
     * When the post was saved.
     */
    savedAt?: string;
    /**
     * When the post was liked.
     */
    likedAt?: string;
    /**
     * The like / score of the post.
     */
    likeScore?: number;
    /**
     * When the post was hidden.
     */
    hiddenAt?: string;
};
