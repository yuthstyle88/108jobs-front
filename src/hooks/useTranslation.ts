// hooks/useJobsTranslation.ts
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useJobsTranslation(lang: string) {
  const { data, isLoading, error } = useSWR(
    `https://test-multi-language1.free.beeceptor.com/translation?lang=${lang}`,
    fetcher
  );
  return {
    data: data,
    isLoading: isLoading,
    error,
  };
}
