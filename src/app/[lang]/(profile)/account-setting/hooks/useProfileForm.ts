import { useForm } from "react-hook-form";
import { ProfileData } from "lemmy-js-client";
import { useEffect, useState } from "react";
import useNotification from "@/hooks/useNotification";
import { ImageUploadResponse } from "@/types/image";
import { API_ROUTES } from "@/api/endpoints";
import { HttpService, } from "@/services";
import {LOADING_REQUEST, RequestState} from "@/services/HttpService";

interface FormValues {
  displayName: string;
  username: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
}

export const useProfileForm = (
  profileData: ProfileData | undefined,
  selectedImage: string | null,
  uploadImage: (formData: FormData) => Promise<ImageUploadResponse | null>,
  mutate: () => void,
  setSelectedImage: (imageUrl: string) => void
) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const [updateProfileState, setUpdateProfileState] = useState<RequestState<ProfileData>>(LOADING_REQUEST);
  const isUpdateMuting = updateProfileState.state === "loading";

  const { successMessage } = useNotification();

  useEffect(() => {
    if (profileData?.person) {
      const birthDate = profileData.card.birthDate;
      if (birthDate) {
        const [year, month, day] = birthDate.split("-");
        reset({
          displayName: profileData.person.displayName || "",
          username: profileData.person.name,
          birthDay: day || "Day",
          birthMonth: month || "Month",
          birthYear: year || "Year",
        });
      } else {
        reset({
          displayName: profileData.person.displayName || "",
          username: profileData.person.name,
          birthDay: "Day",
          birthMonth: "Month",
          birthYear: "Year",
        });
      }
      setSelectedImage(profileData.person.avatar || "");
    }
  }, [profileData, reset, setSelectedImage]);

  const onSubmit = async (formData: FormValues) => {
    try {
      setUpdateProfileState(LOADING_REQUEST);
      
      let avatarUrl = profileData?.person?.avatar;

      if (selectedImage && selectedImage !== profileData?.person?.avatar) {
        const imageFormData = new FormData();
        const blob = await fetch(selectedImage).then((res) => res.blob());
        imageFormData.append("images[]", blob, "profile.jpg");
        const result = await uploadImage(imageFormData);
        const uploadedImageUrl = result?.images?.[0]?.imageUrl;
        if (!uploadedImageUrl) throw new Error("Image upload failed");
        avatarUrl = uploadedImageUrl;
      }

      const isIncompleteBirthDate =
        formData.birthDay === "Day" ||
        formData.birthMonth === "Month" ||
        formData.birthYear === "Year";

      const updateData = {
        displayName: formData.displayName,
        username: formData.username,
        birthDate: isIncompleteBirthDate
          ? null
          : `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
        avatarUrl: avatarUrl || null,
      };

      // Use HttpService.client for updating the profile
      // First, update the displayName using saveUserSettings
      const userSettingsResult = await HttpService.client.saveUserSettings({
        displayName: formData.displayName,
      });
      
      if (userSettingsResult.state === "failed") {
        throw new Error('Failed to update user settings');
      }
      
      // Then, make a custom request to update the other profile fields
      // We need to use the raw HTTP client to make a PUT request to the profile endpoint
      const response = await fetch(API_ROUTES.profile.updateProfile, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      setUpdateProfileState({ state: "success", data });
      
      successMessage("profile", "update");
      // Fetch the latest profile data using HttpService
      await HttpService.client.getProfile();
      await mutate();
    } catch (error) {
      console.error("Update error:", error);
      setUpdateProfileState({ state: "failed", err: error as Error });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isUpdateMuting,
    onSubmit,
    updateProfileState,
  };
};
