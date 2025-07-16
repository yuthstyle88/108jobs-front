import type { ModAddId } from "./ModAddId";
import type { PersonId } from "./PersonId";
/**
 * When someone is added as a site moderator.
 */
export type ModAdd = {
    id: ModAddId;
    modPersonId: PersonId;
    otherPersonId: PersonId;
    removed: boolean;
    publishedAt: string;
};
