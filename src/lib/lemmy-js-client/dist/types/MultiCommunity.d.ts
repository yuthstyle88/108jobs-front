import type { DbUrl } from "./DbUrl";
import type { InstanceId } from "./InstanceId";
import type { MultiCommunityId } from "./MultiCommunityId";
import type { PersonId } from "./PersonId";
export type MultiCommunity = {
    id: MultiCommunityId;
    creatorId: PersonId;
    instanceId: InstanceId;
    name: string;
    title?: string;
    description?: string;
    local: boolean;
    deleted: boolean;
    apId: DbUrl;
    publishedAt: string;
    updated_at?: string;
};
