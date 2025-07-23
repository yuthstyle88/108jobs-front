import { ProfileData } from "lemmy-js-client";
import { HttpService, RequestState } from "@/services/HttpService";
import { useAsyncLoading } from "@/hooks/useLoading";

/**
 * Hook to fetch and manage profile data
 * @returns Object with profile data, loading state, and refresh function
 */
export const useBasicInfoForm = () => {
  // Use the useAsyncLoading hook to handle loading states
  const { 
    isLoading: isLoadingProfile, 
    data: profileData, 
    error: isErrorProfile, 
    execute: refreshProfile,
    requestState: profileState
  } = useAsyncLoading<ProfileData>(
    async () => {
      try {
        // Fetch the profile data
        return await HttpService.client.getProfile();
      } catch (error) {
        // Handle any unexpected errors
        return {
          state: "failed" as const,
          err: error instanceof Error ? error : new Error("Unknown error occurred")
        };
      }
    },
    [] // Empty dependency array means this runs once on mount
  );
  
  // Mutate function for refreshing data
  const mutate = async () => {
    await refreshProfile();
  };
  
  return {
    profileState,
    profileData,
    isLoadingProfile,
    isErrorProfile,
    mutate,
  };
};