import type { DbUrl } from "./DbUrl";
import type { PersonId } from "./PersonId";
import type { PostId } from "./PostId";
import type { PostReportId } from "./PostReportId";
/**
 * A post report.
 */
export type PostReport = {
    id: PostReportId;
    creatorId: PersonId;
    postId: PostId;
    /**
     * The original post title.
     */
    originalPostName: string;
    /**
     * The original post url.
     */
    originalPostUrl?: DbUrl;
    /**
     * The original post body.
     */
    originalPostBody?: string;
    reason: string;
    resolved: boolean;
    resolverId?: PersonId;
    publishedAt: string;
    updatedAt?: string;
    violatesInstanceRules: boolean;
};
