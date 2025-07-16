import type { AdminBlockInstance } from "./AdminBlockInstance";
import type { Instance } from "./Instance";
import type { Person } from "./Person";
/**
 * When an admin purges a post.
 */
export type AdminBlockInstanceView = {
    adminBlockInstance: AdminBlockInstance;
    instance: Instance;
    admin?: Person;
};
