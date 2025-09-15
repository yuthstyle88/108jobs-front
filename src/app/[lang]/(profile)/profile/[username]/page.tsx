import {HttpService} from "@/services";
import {REQUEST_STATE} from "@/services/HttpService";
import CurrentProfileUser from "@/app/[lang]/(profile)/profile/components/CurrentProfileUser";

export default async function Page({
                                       params,
                                   }: {
    params: any;
}) {

    const res = await HttpService.client.visitProfile(params.username)

    return <CurrentProfileUser profile={res.state === REQUEST_STATE.SUCCESS ? res?.data.profile : null}/>;
}
