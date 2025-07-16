import type { CommunityView } from "./CommunityView";
import type { MultiCommunityView } from "./MultiCommunityView";
export type GetMultiCommunityResponse = {
    multiCommunityView: MultiCommunityView;
    communities: Array<CommunityView>;
};
