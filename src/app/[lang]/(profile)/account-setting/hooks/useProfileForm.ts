import useNotification from "@/hooks/useNotification";
import {HttpService} from "@/services";
import {
    LOADING_REQUEST,
    RequestState
} from "@/services/HttpService";
import {uploadSelectedImage} from "@/utils/helpers";
import {
    MyUserInfo,
    Person,
    SaveUserProfile, SaveUserSettings,
    UploadImage,
    UploadImageResponse
} from "lemmy-js-client";
import {IdentityCard} from "lemmy-js-client/dist/types/IdentityCard";
import {RequestOptions} from "node:http";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";

interface FormValues {
    displayName: string;
    username: string;
    bio: string;
    skills: string;
    contacts: {
        lineId: string;
        facebook: string;
        phoneNumber: string;
    };
}

export const useProfileForm = (
    person: Person | null,
    card: IdentityCard | null,
    selectedImage: string | null,
    uploadImage: (
        image: UploadImage,
        options?: RequestOptions
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
            const defaultContact = {
                lineid: "",
                facebook: "",
                email: "",
                phone: "",
            };
            const contactParts = person.contacts && person.contacts !== ""
                ? person.contacts.split("|").reduce((acc, part) => {
                    const [key, value] = part.split(":");
                    acc[key.toLowerCase()] = value || ""; // Ensure value is not undefined
                    return acc;
                }, {} as any)
                : defaultContact;
            reset({
                displayName: person.displayName || "",
                username: person.name || "",
                bio: person.bio || "",
                skills: person.skills || "",
                contacts: {
                    lineId: contactParts.lineid || "",
                    facebook: contactParts.facebook || "",
                    phoneNumber: contactParts.phone || "",
                },
            });
            setSelectedImage(person.avatar || "");
        }
    }, [person, reset, setSelectedImage]);

    const onSubmit = async (formData: FormValues) => {
        try {
            setUpdateProfileState(LOADING_REQUEST);
            const contactString = `LineID:${formData.contacts.lineId}|Facebook:${formData.contacts.facebook}|Phone:${formData.contacts.phoneNumber}`;
            const updateData: SaveUserSettings = {
                portfolioPics: portfolioItems,
                skills: formData.skills,
                workSamples: workSamples,
                displayName: formData.displayName,
                contacts: contactString,
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
