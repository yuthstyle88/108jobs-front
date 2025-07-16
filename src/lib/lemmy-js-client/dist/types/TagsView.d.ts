import type { Tag } from "./Tag";
/**
 * we wrap this in a struct so we can implement FromSqlRow<Json> for it
 */
export type TagsView = Array<Tag>;
