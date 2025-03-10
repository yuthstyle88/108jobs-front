import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useJobsTranslation(lang: string, file: string = "global") {
  const { data, isLoading, error } = useSWR(
    `/api/translation/${lang}/${file}`,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}
