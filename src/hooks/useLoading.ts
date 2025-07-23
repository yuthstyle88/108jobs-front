import { useState, useEffect } from 'react';
import { RequestState } from '@/services/HttpService';

/**
 * A hook to handle loading states from RequestState
 * @param requestState The RequestState to track
 * @returns An object with loading state and the data if available
 */
export function useLoading<T>(requestState: RequestState<T>) {
  const [isLoading, setIsLoading] = useState<boolean>(requestState.state === 'loading');
  const [data, setData] = useState<T | null>(requestState.state === 'success' ? (requestState as any).data : null);
  const [error, setError] = useState<Error | null>(requestState.state === 'failed' ? (requestState as any).err : null);

  useEffect(() => {
    if (requestState.state === 'loading') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      
      if (requestState.state === 'success') {
        setData((requestState as any).data);
        setError(null);
      } else if (requestState.state === 'failed') {
        setError((requestState as any).err);
        setData(null);
      }
    }
  }, [requestState]);

  return { isLoading, data, error };
}

/**
 * A hook to handle loading states for async functions
 * @param asyncFn The async function to execute
 * @param deps Dependencies array for the effect
 * @returns An object with loading state, data, error, and a function to execute the async function
 */
export function useAsyncLoading<T>(
  asyncFn: () => Promise<RequestState<T>>,
  deps: any[] = []
) {
  const [requestState, setRequestState] = useState<RequestState<T>>({ state: 'empty' });
  
  const execute = async () => {
    setRequestState({ state: 'loading' });
    const result = await asyncFn();
    setRequestState(result);
    return result;
  };

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const { isLoading, data, error } = useLoading(requestState);

  return { isLoading, data, error, execute, requestState };
}