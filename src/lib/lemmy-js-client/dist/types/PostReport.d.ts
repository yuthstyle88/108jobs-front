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
    original_post_url?: DbUrl;
    /**
     * The original post body.
     */
    original_post_body?: string;
    reason: string;
    resolved: boolean;
    resolver_id?: PersonId;
    publishedAt: string;
    updated_at?: string;
    violatesInstanceRules: boolean;
};
