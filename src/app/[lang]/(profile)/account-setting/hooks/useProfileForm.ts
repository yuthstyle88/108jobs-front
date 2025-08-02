import {useForm} from "react-hook-form";
import {Card, MyUserInfo, Person, SaveUserProfile, UploadImage, UploadImageResponse} from "lemmy-js-client";
import {useEffect, useState} from "react";
import useNotification from "@/hooks/useNotification";
import {HttpService,} from "@/services";
import {isSuccess, LOADING_REQUEST, RequestState} from "@/services/HttpService";
import {RequestOptions} from "node:http";
import {uploadSelectedImage} from "@/utils/helpers";

interface FormValues {
  displayName: string;
  username: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
}

export const useProfileForm = (
  person: Person | null,
  card: Card | null,
  selectedImage: string | null,
  uploadImage: (
    image: UploadImage,
    options?: RequestOptions,
  ) => Promise<RequestState<UploadImageResponse>>,
  setSelectedImage: (imageUrl: string) => void
) => {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
  } = useForm<FormValues>();

  const [updateProfileState, setUpdateProfileState] = useState<RequestState<MyUserInfo>>(LOADING_REQUEST);
  const isUpdateMuting = updateProfileState.state === "loading";

  const {successMessage} = useNotification();

  useEffect(() => {
      if (person) {
        const birthDate = card?.birthDate;
        if (birthDate) {
          const [year, month, day] = birthDate.split("-");
          reset({
            displayName: person.displayName || "",
            username: person.name,
            birthDay: day || "Day",
            birthMonth: month || "Month",
            birthYear: year || "Year",
          });
        } else {
          reset({
            displayName: person.displayName || "",
            username: person.name,
            birthDay: "Day",
            birthMonth: "Month",
            birthYear: "Year",
          });
        }
        setSelectedImage(person.avatar || "");
      }
    },
    [person, reset, setSelectedImage]);

  const onSubmit = async(formData: FormValues) => {
    try {
      setUpdateProfileState(LOADING_REQUEST);

      let avatarUrl = person?.avatar;

      if (selectedImage && selectedImage !== person?.avatar) {
        avatarUrl = await uploadSelectedImage(selectedImage,
          uploadImage);
      }

      const updateData: SaveUserProfile = {
        updatePerson: {
          displayName: formData.displayName,
          name: formData.username,
          avatar: avatarUrl || "",
        },
        card: {
          birthDate: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
        },
        // Add localUser update to maintain data consistency
        updateAddress: {
          country: "country"
          // No direct fields to update, but include for API consistency
          // This ensures the backend knows to update the localUser if needed
        },
      };
      // Use HttpService.client for updating the profile
      // First, update the displayName using saveUserSettings
      const userSettingsResult = await HttpService.client.saveUserSettings({
        displayName: formData.displayName,
      });

      if (userSettingsResult.state === "failed") {
        throw new Error('Failed to update profile settings');
      }

      // Then, make a custom request to update the other profile fields
      // We need to use the raw HTTP client to make a PUT request to the profile endpoint
      const response = await HttpService.client.updateProfile(updateData);

      if (!isSuccess(response)) {
        throw new Error('Failed to update profile');
      }

      const data = response.data;
      setUpdateProfileState({state: "success", data});

      successMessage("profile",
        "update");
      // Fetch the latest profile data using HttpService
      // await HttpService.client.getProfile();
    } catch (error) {
      console.error("Update error:",
        error);
      setUpdateProfileState({state: "failed", err: error as Error});
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
