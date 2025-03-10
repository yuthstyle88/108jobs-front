import useSWR from "swr";
import { useLanguageStore } from "@/store/useLanguageStore";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useLanguage = (lang: string, file: "global" | "login" | "home") => {
  const { setLanguageData } = useLanguageStore();

  const { data, error, isLoading } = useSWR(
    `/api/translation/${lang}/${file}`,
    fetcher,
    {
      onSuccess: (data) => setLanguageData(data),
    }
  );

  return { data, error, isLoading };
};
