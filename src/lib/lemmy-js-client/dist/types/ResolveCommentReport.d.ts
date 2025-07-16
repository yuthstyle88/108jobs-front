import type { CommentReportId } from "./CommentReportId";
/**
 * Resolve a comment report (only doable by mods).
 */
export type ResolveCommentReport = {
    reportId: CommentReportId;
    resolved: boolean;
};
