import type { AdminPurgePersonId } from "./AdminPurgePersonId";
import type { PersonId } from "./PersonId";
/**
 * When an admin purges a person.
 */
export type AdminPurgePerson = {
    id: AdminPurgePersonId;
    adminPersonId: PersonId;
    reason?: string;
    publishedAt: string;
};
