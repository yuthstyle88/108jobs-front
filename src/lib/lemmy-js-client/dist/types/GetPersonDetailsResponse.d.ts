import type { CommunityModeratorView } from "./CommunityModeratorView";
import type { PersonView } from "./PersonView";
import type { Site } from "./Site";
/**
 * A person's details response.
 */
export type GetPersonDetailsResponse = {
    personView: PersonView;
    site?: Site;
    moderates: Array<CommunityModeratorView>;
};
