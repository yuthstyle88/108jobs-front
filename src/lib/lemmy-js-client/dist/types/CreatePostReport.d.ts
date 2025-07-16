import type { PostId } from "./PostId";
/**
 * Create a post report.
 */
export type CreatePostReport = {
    postId: PostId;
    reason: string;
    violatesInstanceRules?: boolean;
};
