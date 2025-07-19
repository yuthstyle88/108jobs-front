import type { CommentReplyView } from "./CommentReplyView";
import type { PersonCommentMentionView } from "./PersonCommentMentionView";
import type { PersonPostMentionView } from "./PersonPostMentionView";
import type { PrivateMessageView } from "./PrivateMessageView";
export type InboxCombinedView = ({
    type: "CommentReply";
} & CommentReplyView) | ({
    type: "CommentMention";
} & PersonCommentMentionView) | ({
    type: "PostMention";
} & PersonPostMentionView) | ({
    type: "PrivateMessage";
} & PrivateMessageView);
