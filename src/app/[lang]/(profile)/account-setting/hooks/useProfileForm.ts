import useNotification from "@/hooks/useNotification";
import { HttpService } from "@/services";
import {
  LOADING_REQUEST,
  RequestState
} from "@/services/HttpService";
import { uploadSelectedImage } from "@/utils/helpers";
import {
  MyUserInfo,
  Person,
  SaveUserProfile,
  UploadImage,
  UploadImageResponse
} from "lemmy-js-client";
import { IdentityCard } from "lemmy-js-client/dist/types/IdentityCard";
import { RequestOptions } from "node:http";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  displayName: string;
  username: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  bio: string;
}

export const useProfileForm = (
  person: Person | null,
  card: IdentityCard | null,
  selectedImage: string | null,
  uploadImage: (
    image: UploadImage,
    options?: RequestOptions
  ) => Promise<RequestState<UploadImageResponse>>,
  setSelectedImage: (imageUrl: string) => void
) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const [updateProfileState, setUpdateProfileState] =
    useState<RequestState<MyUserInfo>>(LOADING_REQUEST);
  const isUpdateMuting = updateProfileState.state === "loading";

  const { successMessage } = useNotification();

  useEffect(() => {
    if (person) {
      const birthDate = card?.dateOfBirth;
      if (birthDate) {
        const [year, month, day] = birthDate.split("-");
        reset({
          displayName: person.displayName || "",
          username: person.name,
          birthDay: day || "Day",
          birthMonth: month || "Month",
          birthYear: year || "Year",
          bio: person.bio,
        });
      } else {
        reset({
          displayName: person.displayName || "",
          username: person.name,
          birthDay: "Day",
          birthMonth: "Month",
          birthYear: "Year",
          bio: person.bio,
        });
      }
      setSelectedImage(person.avatar || "");
    }
  }, [person, reset, setSelectedImage]);

  const onSubmit = async (formData: FormValues) => {
    try {
      setUpdateProfileState(LOADING_REQUEST);
      let avatarUrl = person?.avatar;

      if (selectedImage && selectedImage !== person?.avatar) {
        avatarUrl = await uploadSelectedImage(selectedImage, uploadImage);
      }

      const updateData: SaveUserProfile = {
          displayName: formData.displayName,
          username: formData.username,
          avatarUrl: avatarUrl,
          bio:formData.bio,
          birthDate: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
      };
      // Use HttpService.client for updating the profile
      // First, update the displayName using saveUserSettings
      const userSettingsResult = await HttpService.client.saveUserSettings(updateData);
      successMessage("profile", "update");

      if (userSettingsResult.state === "failed") {
        throw new Error("Failed to update profile settings");
      }
      // Fetch the latest profile data using HttpService
      // await HttpService.client.getProfile();
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
