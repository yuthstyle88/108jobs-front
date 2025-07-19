export type CommentActions = {
    /**
       * The like / score for the comment.
       */
    like_score?: number;
    /**
     * When the comment was liked.
     */
    liked_at?: string;
    /**
     * When the comment was saved.
     */
    saved_at?: string;
};
