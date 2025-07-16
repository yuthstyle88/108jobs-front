import type { CommentReportView } from "./CommentReportView";
import type { CommunityReportView } from "./CommunityReportView";
import type { PostReportView } from "./PostReportView";
import type { PrivateMessageReportView } from "./PrivateMessageReportView";
export type ReportCombinedView = ({
    type: "Post";
} & PostReportView) | ({
    type: "Comment";
} & CommentReportView) | ({
    type: "PrivateMessage";
} & PrivateMessageReportView) | ({
    type: "Community";
} & CommunityReportView);
