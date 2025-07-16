import type { AdminPurgeCommunity } from "./AdminPurgeCommunity";
import type { Person } from "./Person";
/**
 * When an admin purges a community.
 */
export type AdminPurgeCommunityView = {
    adminPurgeCommunity: AdminPurgeCommunity;
    admin?: Person;
};
