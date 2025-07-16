import type { AdminAllowInstance } from "./AdminAllowInstance";
import type { Instance } from "./Instance";
import type { Person } from "./Person";
/**
 * When an admin purges a post.
 */
export type AdminAllowInstanceView = {
    adminAllowInstance: AdminAllowInstance;
    instance: Instance;
    admin?: Person;
};
