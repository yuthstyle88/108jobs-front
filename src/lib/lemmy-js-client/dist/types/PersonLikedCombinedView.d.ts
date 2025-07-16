import type { CommentView } from "./CommentView";
import type { PostView } from "./PostView";
export type PersonLikedCombinedView = ({
    type: "Post";
} & PostView) | ({
    type: "Comment";
} & CommentView);
