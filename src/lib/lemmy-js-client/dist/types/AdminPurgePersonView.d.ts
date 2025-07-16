import type { AdminPurgePerson } from "./AdminPurgePerson";
import type { Person } from "./Person";
/**
 * When an admin purges a person.
 */
export type AdminPurgePersonView = {
    adminPurgePerson: AdminPurgePerson;
    admin?: Person;
};
