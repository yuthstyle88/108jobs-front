import { editListImmutable } from "@/utils/helpers";
import { CommentView } from "../../lib/lemmy-js-client";

export default function editComment(
  data: CommentView,
  comments: CommentView[],
): CommentView[] {
  return editListImmutable("comment", data, comments);
}
