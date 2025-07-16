import type { CommentView } from "./CommentView";
import type { CommunityView } from "./CommunityView";
import type { MultiCommunityView } from "./MultiCommunityView";
import type { PersonView } from "./PersonView";
import type { PostView } from "./PostView";
export type SearchCombinedView = ({
    type: "Post";
} & PostView) | ({
    type: "Comment";
} & CommentView) | ({
    type: "Community";
} & CommunityView) | ({
    type: "Person";
} & PersonView) | ({
    type: "MultiCommunity";
} & MultiCommunityView);
