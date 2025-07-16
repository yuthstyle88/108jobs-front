import type { LocalImage } from "./LocalImage";
import type { Person } from "./Person";
import type { Post } from "./Post";
/**
 * A local image view.
 */
export type LocalImageView = {
    localImage: LocalImage;
    person: Person;
    post?: Post;
};
