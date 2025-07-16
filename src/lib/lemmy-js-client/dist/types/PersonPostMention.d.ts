import type { PersonId } from "./PersonId";
import type { PersonPostMentionId } from "./PersonPostMentionId";
import type { PostId } from "./PostId";
/**
 * A person mention.
 */
export type PersonPostMention = {
    id: PersonPostMentionId;
    recipientId: PersonId;
    postId: PostId;
    read: boolean;
    publishedAt: string;
};
