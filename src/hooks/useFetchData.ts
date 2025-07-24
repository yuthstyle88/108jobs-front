import { RequestState } from "@/services/HttpService";
import { useEffect, useState } from "react";


interface FetchResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFetch<T>(
  fetchFn: () => Promise<RequestState<T>>,
  deps: any[] = []
): FetchResult<T> {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchFn();
      if (res.state === "success") {
        setData(res.data);
      } else if (res.state === "failed") {
        setError(res.err);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, isLoading, error, refetch };
}
