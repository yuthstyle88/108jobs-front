import type { CommentReplyId } from "./CommentReplyId";
import type { InboxCombinedId } from "./InboxCombinedId";
import type { PersonCommentMentionId } from "./PersonCommentMentionId";
import type { PersonPostMentionId } from "./PersonPostMentionId";
import type { PrivateMessageId } from "./PrivateMessageId";
/**
 * A combined inbox table.
 */
export type InboxCombined = {
    id: InboxCombinedId;
    publishedAt: string;
    commentReplyId?: CommentReplyId;
    personCommentMentionId?: PersonCommentMentionId;
    personPostMentionId?: PersonPostMentionId;
    privateMessageId?: PrivateMessageId;
};
