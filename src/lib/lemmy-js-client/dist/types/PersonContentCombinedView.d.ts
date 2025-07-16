import type { CommentView } from "./CommentView";
import type { PostView } from "./PostView";
export type PersonContentCombinedView = ({
    type: "Post";
} & PostView) | ({
    type: "Comment";
} & CommentView);
