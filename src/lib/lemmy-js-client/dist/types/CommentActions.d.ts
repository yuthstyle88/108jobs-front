export type CommentActions = {
    /**
     * The like / score for the comment.
     */
    likeScore?: number;
    /**
     * When the comment was liked.
     */
    likedAt?: string;
    /**
     * When the comment was saved.
     */
    savedAt?: string;
};
