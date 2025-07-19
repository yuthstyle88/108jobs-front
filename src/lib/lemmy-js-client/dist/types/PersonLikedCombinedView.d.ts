import type { CommentView } from "./CommentView";
import type { PostView } from "./PostView";
export type PersonLikedCombinedView = ({
    type_: "Post";
} & PostView) | ({
    type_: "Comment";
} & CommentView);
