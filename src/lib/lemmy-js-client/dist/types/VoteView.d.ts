import type { Person } from "./Person";
/**
 * A vote view for checking a post or comments votes.
 */
export type VoteView = {
    creator: Person;
    creatorBanned: boolean;
    creatorBannedFromCommunity: boolean;
    score: number;
};
