import type { CommentId } from "./CommentId";
import type { CommentReportId } from "./CommentReportId";
import type { PersonId } from "./PersonId";
/**
 * A comment report.
 */
export type CommentReport = {
    id: CommentReportId;
    creatorId: PersonId;
    commentId: CommentId;
    originalCommentText: string;
    reason: string;
    resolved: boolean;
    resolverId?: PersonId;
    publishedAt: string;
    updatedAt?: string;
    violatesInstanceRules: boolean;
};
