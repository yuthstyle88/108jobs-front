import {generateLocalizedMetadata} from "@/lib/metadata";;
import {PostForm} from "@/components/Job/PostForm";
import {useHttpGet} from "@/hooks/useHttpGet";
import type {CommentId, PostId} from "@/lib/lemmy-js-client/src";

export async function generateMetadata() {
  return generateLocalizedMetadata("catalog");
}

export default async function Categories({
  params,
}: {
  params: {postId: PostId, commentId: CommentId };
}) {
  const { data } = useHttpGet("getPost", [
    { id: params.postId, commentId: params.commentId },
    undefined,
  ]);
  const postView =  data?.postView;
  return (
    <main className="w-full min-h-screen bg-[#F6F9FE] pt-16">
      <PostForm mode={"edit"} postView={postView}/>
    </main>
  );
}

