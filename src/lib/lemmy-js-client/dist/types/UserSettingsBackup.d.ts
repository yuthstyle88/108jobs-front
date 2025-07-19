import type { LocalUser } from "./LocalUser";
/**
 * Backup of user data. This struct should never be changed so that the data can be used as a
 * long-term backup in case the instance goes down unexpectedly. All fields are optional to allow
 * importing partial backups.
 *
 * This data should not be parsed by apps/clients, but directly downloaded as a file.
 *
 * Be careful with any changes to this struct, to avoid breaking changes which could prevent
 * importing older backups.
 */
export type UserSettingsBackup = {
    display_name?: string;
    bio?: string;
    avatar?: string;
    banner?: string;
    matrix_id?: string;
    bot_account?: boolean;
    settings?: LocalUser;
    followedCommunities: Array<string>;
    savedPosts: Array<string>;
    savedComments: Array<string>;
    blockedCommunities: Array<string>;
    blockedUsers: Array<string>;
    blockedInstances: Array<string>;
};
