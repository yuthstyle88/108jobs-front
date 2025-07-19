import type { TaglineId } from "./TaglineId";
/**
 * A tagline, shown at the top of your site.
 */
export type Tagline = {
    id: TaglineId;
    content: string;
    publishedAt: string;
    updated_at?: string;
};
