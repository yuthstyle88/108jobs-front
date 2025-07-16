import type { PostOrCommentOrPrivateMessage } from "./PostOrCommentOrPrivateMessage";
import type { UserSettingsBackup } from "./UserSettingsBackup";
/**
 * Your exported data.
 */
export type ExportDataResponse = {
    inbox: Array<PostOrCommentOrPrivateMessage>;
    content: Array<PostOrCommentOrPrivateMessage>;
    readPosts: Array<string>;
    liked: Array<string>;
    moderates: Array<string>;
    settings: UserSettingsBackup;
};
