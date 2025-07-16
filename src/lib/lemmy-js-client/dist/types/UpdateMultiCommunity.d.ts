import type { MultiCommunityId } from "./MultiCommunityId";
export type UpdateMultiCommunity = {
    id: MultiCommunityId;
    title?: string;
    description?: string;
    deleted?: boolean;
};
