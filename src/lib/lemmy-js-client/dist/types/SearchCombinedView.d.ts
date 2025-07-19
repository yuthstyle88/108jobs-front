import type { CommentView } from "./CommentView";
import type { CommunityView } from "./CommunityView";
import type { MultiCommunityView } from "./MultiCommunityView";
import type { PersonView } from "./PersonView";
import type { PostView } from "./PostView";
export type SearchCombinedView = ({
    type_: "Post";
} & PostView) | ({
    type_: "Comment";
} & CommentView) | ({
    type_: "Community";
} & CommunityView) | ({
    type_: "Person";
} & PersonView) | ({
    type_: "MultiCommunity";
} & MultiCommunityView);
