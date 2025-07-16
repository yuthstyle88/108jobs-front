import { Comment } from "../../lib/lemmy-js-client";

export default interface WithComment {
  comment: Comment;
  // counts: CommentAggregates;
  myVote?: number;
  saved: boolean;
  creatorOsModerator: boolean;
  creatorIsAdmin: boolean;
  creatorBlocked: boolean;
  creatorBannedFromCommunity: boolean;
}
