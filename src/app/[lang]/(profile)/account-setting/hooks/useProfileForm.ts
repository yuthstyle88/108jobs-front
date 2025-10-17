import useNotification from "@/hooks/useNotification";
import { HttpService } from "@/services";
import { REQUEST_STATE } from "@/services/HttpService";
import {Person, PortfolioPic, SaveUserSettings, WorkSample} from "lemmy-js-client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useTranslation } from "react-i18next";

interface FormValues {
    displayName: string;
    username: string;
    bio: string;
    skills: string;
    contacts: string;
    workSamples: WorkSample[];
    portfolioPics: any[];
}

export const useProfileForm = (
    person: Person | undefined,
    setSelectedImage: (imageUrl: string) => void,
    portfolioItems?: PortfolioPic[],
    workSamples?: WorkSample[],
) => {
    const { t } = useTranslation();

    const FormSchema = z.object({
        displayName: z
            .string()
            .min(1, t('profileInfo.accountInfo') || 'Display name is required')
            .refine((value) => value.trim().length > 0, {
                message: t('profileInfo.invalidDisplayName') || 'Display name cannot be empty',
            }),
        bio: z.string().optional(),
        skills: z.string().optional(),
        contacts: z.string().optional(),
    });

    const [form, setForm] = useState<FormValues>({
        username: person?.name || "",
        displayName: person?.displayName || "",
        bio: person?.bio || "",
        skills: person?.skills || "",
        contacts: person?.contacts || "",
        workSamples: person?.workSamples ?? [],
        portfolioPics: person?.portfolioPics ?? [],
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
    const { successMessage, errorMessage } = useNotification();

    useEffect(() => {
        if (person) {
            setForm({
                username: person.name || "",
                displayName: person.displayName || "",
                bio: person.bio || "",
                skills: person.skills || "",
                contacts: person.contacts || "",
                workSamples: person.workSamples ?? [],
                portfolioPics: person.portfolioPics ?? [],
            });
            setSelectedImage(person.avatar || "");
        }
    }, [person, setSelectedImage]);

    const validateField = async <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
        const tempForm = { ...form, [key]: value };
        const result = await FormSchema.safeParseAsync(tempForm);
        if (!result.success) {
            const error = result.error.issues.find((issue) => issue.path[0] === key);
            setErrors((prev) => ({
                ...prev,
                [key]: error?.message || "",
            }));
        } else {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = await FormSchema.safeParseAsync(form);
        if (!result.success) {
            const newErrors: Partial<Record<keyof FormValues, string>> = {};
            result.error.issues.forEach((issue) => {
                newErrors[issue.path[0] as keyof FormValues] = issue.message;
            });
            setErrors(newErrors);
            return;
        }

        try {
            const updateData: SaveUserSettings = {
                portfolioPics: portfolioItems,
                skills: form.skills,
                workSamples: workSamples,
                displayName: form.displayName,
                contacts: form.contacts,
                bio: form.bio,
            };
            const userSettingsResult = await HttpService.client.saveUserSettings(updateData);
            if (userSettingsResult.state === REQUEST_STATE.SUCCESS) {
                successMessage("profile", "update");
            } else {
                errorMessage("profile", "updateAccountSettingFail");
            }
        } catch (error) {
            console.error("Update error:", error);
            errorMessage("profile", "updateAccountSettingFail");
        }
    };

    const resetForm = () => {
        setForm({
            username: person?.name || "",
            displayName: person?.displayName || "",
            bio: person?.bio || "",
            skills: person?.skills || "",
            contacts: person?.contacts || "",
            workSamples: person?.workSamples ?? [],
            portfolioPics: person?.portfolioPics ?? [],
        });
        setErrors({});
    };

    return {
        form,
        setForm,
        errors,
        onSubmit,
        validateField,
        resetForm,
    };
};