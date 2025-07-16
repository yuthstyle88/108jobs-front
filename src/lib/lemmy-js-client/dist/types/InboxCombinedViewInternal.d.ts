import type { Comment } from "./Comment";
import type { CommentActions } from "./CommentActions";
import type { CommentReply } from "./CommentReply";
import type { Community } from "./Community";
import type { CommunityActions } from "./CommunityActions";
import type { ImageDetails } from "./ImageDetails";
import type { InboxCombined } from "./InboxCombined";
import type { InstanceActions } from "./InstanceActions";
import type { Person } from "./Person";
import type { PersonActions } from "./PersonActions";
import type { PersonCommentMention } from "./PersonCommentMention";
import type { PersonPostMention } from "./PersonPostMention";
import type { Post } from "./Post";
import type { PostActions } from "./PostActions";
import type { PrivateMessage } from "./PrivateMessage";
import type { TagsView } from "./TagsView";
/**
 * A combined inbox view
 */
export type InboxCombinedViewInternal = {
    inboxCombined: InboxCombined;
    commentReply?: CommentReply;
    personCommentMention?: PersonCommentMention;
    personPostMention?: PersonPostMention;
    privateMessage?: PrivateMessage;
    comment?: Comment;
    post?: Post;
    community?: Community;
    itemCreator: Person;
    itemRecipient: Person;
    imageDetails?: ImageDetails;
    communityActions?: CommunityActions;
    instanceActions?: InstanceActions;
    postActions?: PostActions;
    personActions?: PersonActions;
    commentActions?: CommentActions;
    itemCreatorIsAdmin: boolean;
    postTags: TagsView;
    canMod: boolean;
    creatorBanned: boolean;
    creatorIsModerator: boolean;
    creatorBannedFromCommunity: boolean;
};
