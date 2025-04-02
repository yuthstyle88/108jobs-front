import { useEffect } from "react";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { ProfileData } from "@/types/userData";
import { useUserStore } from "@/store/useUserProfileStore";

export const useFetchUser = () => {
  const { setUser } = useUserStore();
  const { data, isLoading, error:isError,mutate } = usePrivateFetch<ProfileData>("/profile");

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  return { isLoading, isError,mutate };
};
