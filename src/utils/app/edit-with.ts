import { WithComment } from "@/utils/types";

export default function editWith<D extends WithComment, L extends WithComment>(
  {
    comment,
    saved,
    myVote,
    creatorBannedFromCommunity,
    creatorBlocked,
    creatorIsAdmin,
    creatorOsModerator,
  }: D,
  list: L[],
) {
  return [
    ...list.map(c =>
      c.comment.id === comment.id
        ? {
            ...c,
            comment,
            saved,
            myVote,
            creatorBannedFromCommunity,
            creatorBlocked,
            creatorIsAdmin,
            creatorOsModerator,
          }
        : c,
    ),
  ];
}
