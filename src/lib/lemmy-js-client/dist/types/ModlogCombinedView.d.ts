import type { AdminAllowInstanceView } from "./AdminAllowInstanceView";
import type { AdminBlockInstanceView } from "./AdminBlockInstanceView";
import type { AdminPurgeCommentView } from "./AdminPurgeCommentView";
import type { AdminPurgeCommunityView } from "./AdminPurgeCommunityView";
import type { AdminPurgePersonView } from "./AdminPurgePersonView";
import type { AdminPurgePostView } from "./AdminPurgePostView";
import type { ModAddCommunityView } from "./ModAddCommunityView";
import type { ModAddView } from "./ModAddView";
import type { ModBanFromCommunityView } from "./ModBanFromCommunityView";
import type { ModBanView } from "./ModBanView";
import type { ModChangeCommunityVisibilityView } from "./ModChangeCommunityVisibilityView";
import type { ModFeaturePostView } from "./ModFeaturePostView";
import type { ModLockPostView } from "./ModLockPostView";
import type { ModRemoveCommentView } from "./ModRemoveCommentView";
import type { ModRemoveCommunityView } from "./ModRemoveCommunityView";
import type { ModRemovePostView } from "./ModRemovePostView";
import type { ModTransferCommunityView } from "./ModTransferCommunityView";
export type ModlogCombinedView = ({
    type: "AdminAllowInstance";
} & AdminAllowInstanceView) | ({
    type: "AdminBlockInstance";
} & AdminBlockInstanceView) | ({
    type: "AdminPurgeComment";
} & AdminPurgeCommentView) | ({
    type: "AdminPurgeCommunity";
} & AdminPurgeCommunityView) | ({
    type: "AdminPurgePerson";
} & AdminPurgePersonView) | ({
    type: "AdminPurgePost";
} & AdminPurgePostView) | ({
    type: "ModAdd";
} & ModAddView) | ({
    type: "ModAddCommunity";
} & ModAddCommunityView) | ({
    type: "ModBan";
} & ModBanView) | ({
    type: "ModBanFromCommunity";
} & ModBanFromCommunityView) | ({
    type: "ModFeaturePost";
} & ModFeaturePostView) | ({
    type: "ModChangeCommunityVisibility";
} & ModChangeCommunityVisibilityView) | ({
    type: "ModLockPost";
} & ModLockPostView) | ({
    type: "ModRemoveComment";
} & ModRemoveCommentView) | ({
    type: "ModRemoveCommunity";
} & ModRemoveCommunityView) | ({
    type: "ModRemovePost";
} & ModRemovePostView) | ({
    type: "ModTransferCommunity";
} & ModTransferCommunityView);
