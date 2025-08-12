import {getIsoData} from "@/hooks/useIsoData";
import {assertExists} from "@/utils/helpers";
import {REQUEST_STATE} from "@/services/HttpService";

export const useCommunities = () => {
    const isoData = getIsoData();
    const communities = assertExists(isoData?.communities, "Missing communities list");
    const state = REQUEST_STATE.SUCCESS;
    return {
        state,
        communities,
    };
};