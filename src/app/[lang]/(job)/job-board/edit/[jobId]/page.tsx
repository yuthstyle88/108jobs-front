import {PostForm} from "@/components/Job/PostForm";
import {HttpService} from "@/services";
import {REQUEST_STATE} from "@/services/HttpService";

export default async function editPost({
                                           params,
                                       }: {
    params: any;
}) {

    const resp = await HttpService.client.getPost({
        id: Number(params.jobId),
        commentId: Number(params.commentId),
    });

    return (
        <main className="w-full min-h-screen bg-[#F6F9FE] pt-16">
            <PostForm mode={"edit"} postView={resp.state === REQUEST_STATE.SUCCESS ? resp?.data.postView : null}/>
        </main>
    );
}