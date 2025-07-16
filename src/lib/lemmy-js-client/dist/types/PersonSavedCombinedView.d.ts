import type { CommentView } from "./CommentView";
import type { PostView } from "./PostView";
export type PersonSavedCombinedView = ({
    type: "Post";
} & PostView) | ({
    type: "Comment";
} & CommentView);
