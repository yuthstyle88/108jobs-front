import type { Comment } from "./Comment";
import type { Post } from "./Post";
import type { PrivateMessage } from "./PrivateMessage";
export type PostOrCommentOrPrivateMessage = {
    Post: Post;
} | {
    Comment: Comment;
} | {
    PrivateMessage: PrivateMessage;
};
