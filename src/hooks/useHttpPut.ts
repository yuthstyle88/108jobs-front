import { useMemo } from "react";
import useSWRMutation from "swr/mutation";
import {
    EMPTY_REQUEST,
    REQUEST_STATE,
    RequestState,
    WrappedLemmyHttp,
    Payload,
    callHttp,
} from "@/services/HttpService";
import { useGlobalLoader } from "@/contexts/GlobalLoaderContext";
import { useGlobalError } from "@/contexts/GlobalErrorContext";

/**
 *
 * @example
 * const { execute, data, isMutating } = useHttpPut("editPost");
 * await execute({ ...payload });
 */
export const useHttpPut = <K extends keyof WrappedLemmyHttp>(method: K) => {
    const { setLoading } = useGlobalLoader();
    const { setError } = useGlobalError();

    const {
        trigger,
        data: state = EMPTY_REQUEST,
        isMutating,
    } = useSWRMutation<
        RequestState<Payload<K>>,
        Error,
        string,
        Parameters<WrappedLemmyHttp[K]>
    >(
        `${String(method)}-http-put`, // distinguish from POST
        async (_key, { arg }) => {
            setLoading(true);
            setError(null);
            try {
                return await (callHttp(method, ...arg) as Promise<
                    RequestState<Payload<K>>
                >);
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : "Unknown error occurred.";
                setError(errorMessage);
                return {
                    state: REQUEST_STATE.FAILED,
                    err: e instanceof Error ? e : new Error("Unknown error"),
                } as RequestState<Payload<K>>;
            } finally {
                setLoading(false);
            }
        },
        {
            revalidate: false,
        },
    );

    const data = useMemo(
        () =>
            state.state === REQUEST_STATE.SUCCESS
                ? (state.data as Payload<K>)
                : null,
        [state],
    );

    const execute = (...args: Parameters<WrappedLemmyHttp[K]>) => {
        if (args.length === 0) {
            return (trigger as () => Promise<RequestState<Payload<K>>> )();
        }

        type TriggerWithArgs = (
            arg: Parameters<WrappedLemmyHttp[K]>,
            options?: unknown
        ) => Promise<RequestState<Payload<K>>>;

        return (trigger as TriggerWithArgs)(args);
    };

    return {
        state,
        data,
        execute,
        isMutating,
    };
};
