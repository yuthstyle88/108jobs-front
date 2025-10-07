import useNotification from "@/hooks/useNotification";
import {HttpService} from "@/services";
import {LOADING_REQUEST, RequestState} from "@/services/HttpService";
import {MyUserInfo, Person, SaveUserSettings, UploadImage, UploadImageResponse} from "lemmy-js-client";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {IdentityCard} from "lemmy-js-client";

interface FormValues {
    displayName: string;
    username: string;
    bio: string;
    skills: string;
    contacts: string;
}

export const useProfileForm = (
    person: Person | undefined,
    card: IdentityCard | null,
    selectedImage: string | null,
    uploadImage: (
        image: UploadImage,
    ) => Promise<RequestState<UploadImageResponse>>,
    setSelectedImage: (imageUrl: string) => void,
    portfolioItems: any | null,
    workSamples: any | null,
) => {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset,
    } = useForm<FormValues>();

    const [updateProfileState, setUpdateProfileState] =
        useState<RequestState<MyUserInfo>>(LOADING_REQUEST);
    const isUpdateMuting = updateProfileState.state === "loading";

    const {successMessage} = useNotification();

    useEffect(() => {
        if (person) {
            reset({
                displayName: person.displayName || "",
                username: person.name || "",
                bio: person.bio || "",
                skills: person.skills || "",
                contacts: person.contacts || "",
            });
            setSelectedImage(person.avatar || "");
        }
    }, [person, reset, setSelectedImage]);

    const onSubmit = async (formData: FormValues) => {
        try {
            setUpdateProfileState(LOADING_REQUEST);
            const updateData: SaveUserSettings = {
                portfolioPics: portfolioItems,
                skills: formData.skills,
                workSamples: workSamples,
                displayName: formData.displayName,
                contacts: formData.contacts,
                bio: formData.bio
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
