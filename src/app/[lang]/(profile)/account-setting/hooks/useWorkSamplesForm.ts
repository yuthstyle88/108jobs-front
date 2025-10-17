'use client';

import useNotification from '@/hooks/useNotification';
import { HttpService } from '@/services';
import { LOADING_REQUEST, REQUEST_STATE, RequestState } from '@/services/HttpService';
import {MyUserInfo, Person, PortfolioPic, SaveUserSettings, WorkSample} from 'lemmy-js-client';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

interface FormValues {
    newSample: { title: string; sampleUrl: string; description: string };
    displayName: string;
    bio: string;
    skills: string;
    contacts: string;
    workSamples: WorkSample[];
    portfolioPics: PortfolioPic[];
}

export const useWorkSamplesForm = (person: Person | undefined) => {
    const { t } = useTranslation();
    const { successMessage, errorMessage } = useNotification();

    const FormSchema = z.object({
        title: z
            .string()
            .min(1, t('profileInfo.sampleTitleRequired') || 'Title is required')
            .refine((value) => value.trim().length > 0, {
                message: t('profileInfo.invalidTitle') || 'Title cannot be empty',
            }),
        sampleUrl: z
            .string()
            .min(1, t('profileInfo.sampleUrlRequired') || 'URL is required')
            .refine(
                (value) => {
                    try {
                        new URL(value);
                        return true;
                    } catch {
                        return value.startsWith('http://localhost') || value.startsWith('https://localhost');
                    }
                },
                { message: t('profileInfo.invalidUrl') || 'Invalid URL' },
            ),
        description: z
            .string()
            .min(1, t('profileInfo.sampleDescriptionRequired') || 'Description is required')
            .refine((value) => value.trim().length > 0, {
                message: t('profileInfo.invalidDescription') || 'Description cannot be empty',
            }),
    });

    const initialWorkSamples: WorkSample[] = person?.workSamples ?? [];

    const [form, setForm] = useState<FormValues>({
        workSamples: initialWorkSamples,
        newSample: { title: '', sampleUrl: '', description: '' },
        displayName: person?.displayName ?? '',
        bio: person?.bio ?? '',
        skills: person?.skills ?? '',
        contacts: person?.contacts ?? '',
        portfolioPics: person?.portfolioPics ?? [],
    });
    const [editingSampleId, setEditingSampleId] = useState<number | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof FormValues['newSample'], string>>>({});
    const [updateProfileState, setUpdateProfileState] =
        useState<RequestState<MyUserInfo>>(LOADING_REQUEST);
    const isSubmitting = updateProfileState.state === 'loading';

    useEffect(() => {
        if (person) {
            setForm((prev) => ({
                ...prev,
                workSamples: person.workSamples ?? initialWorkSamples,
                displayName: person.displayName ?? prev.displayName,
                bio: person.bio ?? prev.bio,
                skills: person.skills ?? prev.skills,
                contacts: person.contacts ?? prev.contacts,
                portfolioPics: person.portfolioPics ?? prev.portfolioPics,
            }));
        }
    }, [person]);

    const validateField = async <K extends keyof FormValues['newSample']>(
        key: K,
        value: FormValues['newSample'][K],
    ) => {
        const tempSample = { ...form.newSample, [key]: value };
        const result = await FormSchema.safeParseAsync(tempSample);
        if (!result.success) {
            const error = result.error.issues.find((issue) => issue.path[0] === key);
            setErrors((prev) => ({
                ...prev,
                [key]: error?.message || '',
            }));
        } else {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const addSample = async () => {
        const result = await FormSchema.safeParseAsync(form.newSample);
        if (!result.success) {
            const newErrors: Partial<Record<keyof FormValues['newSample'], string>> = {};
            result.error.issues.forEach((issue) => {
                newErrors[issue.path[0] as keyof FormValues['newSample']] = issue.message;
            });
            setErrors(newErrors);
            return false;
        }

        const newSample = {
            id: form.workSamples.length ? Math.max(...form.workSamples.map((s) => s.id)) + 1 : 1,
            title: form.newSample.title,
            sampleUrl: form.newSample.sampleUrl,
            description: form.newSample.description,
        };

        setForm((prev) => {
            const newWorkSamples = [...prev.workSamples, newSample];
            return {
                ...prev,
                workSamples: newWorkSamples,
                newSample: { title: '', sampleUrl: '', description: '' },
            };
        });
        setErrors({});

        // Trigger server save
        try {
            setUpdateProfileState(LOADING_REQUEST);
            const updateData: SaveUserSettings = {
                workSamples: [...form.workSamples, newSample],
                displayName: form.displayName,
                bio: form.bio,
                skills: form.skills,
                contacts: form.contacts,
                portfolioPics: form.portfolioPics,
            };
            const userSettingsResult = await HttpService.client.saveUserSettings(updateData);
            if (userSettingsResult.state === REQUEST_STATE.SUCCESS) {
                successMessage('profile', 'update');
            } else {
                errorMessage('profile', 'updateAccountSettingFail');
                setUpdateProfileState({ state: 'failed', err: new Error('Failed to update settings') });
            }
        } catch (error) {
            console.error('Update error:', error);
            errorMessage('profile', 'updateAccountSettingFail');
            setUpdateProfileState({ state: 'failed', err: error as Error });
        }

        return true;
    };

    const editSample = async (id: number) => {
        const result = await FormSchema.safeParseAsync(form.newSample);
        if (!result.success) {
            const newErrors: Partial<Record<keyof FormValues['newSample'], string>> = {};
            result.error.issues.forEach((issue) => {
                newErrors[issue.path[0] as keyof FormValues['newSample']] = issue.message;
            });
            setErrors(newErrors);
            return false;
        }

        setForm((prev) => {
            const newWorkSamples = prev.workSamples.map((sample) =>
                sample.id === id
                    ? {
                        ...sample,
                        title: prev.newSample.title,
                        sampleUrl: prev.newSample.sampleUrl,
                        description: prev.newSample.description,
                    }
                    : sample,
            );
            console.log('Editing sample in workSamples:', {
                workSamples: newWorkSamples,
                newSample: { title: '', sampleUrl: '', description: '' },
            });
            return {
                ...prev,
                workSamples: newWorkSamples,
                newSample: { title: '', sampleUrl: '', description: '' },
            };
        });
        setEditingSampleId(null);
        setErrors({});

        // Trigger server save
        await onSubmit(new Event('submit') as any);
        return true;
    };

    const deleteSample = (id: number) => {
        setForm((prev) => {
            const newWorkSamples = prev.workSamples.filter((sample) => sample.id !== id);
            console.log('Deleting sample from workSamples:', {
                workSamples: newWorkSamples,
                newSample: prev.newSample,
            });
            return {
                ...prev,
                workSamples: newWorkSamples,
            };
        });
        // Trigger server save
        onSubmit(new Event('submit') as any);
    };

    const startEditing = (sample: WorkSample) => {
        setEditingSampleId(sample.id);
        setForm((prev) => ({
            ...prev,
            newSample: { title: sample.title, sampleUrl: sample.sampleUrl, description: sample.description },
        }));
        setErrors({});
    };

    const cancelEditing = () => {
        setEditingSampleId(null);
        setForm((prev) => ({
            ...prev,
            newSample: { title: '', sampleUrl: '', description: '' },
        }));
        setErrors({});
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setUpdateProfileState(LOADING_REQUEST);
            const updateData: SaveUserSettings = {
                workSamples: form.workSamples,
                displayName: form.displayName,
                bio: form.bio,
                skills: form.skills,
                contacts: form.contacts,
                portfolioPics: form.portfolioPics,
            };
            const userSettingsResult = await HttpService.client.saveUserSettings(updateData);
            if (userSettingsResult.state === REQUEST_STATE.SUCCESS) {
                successMessage('profile', 'update');
            } else {
                errorMessage('profile', 'updateAccountSettingFail');
                setUpdateProfileState({ state: 'failed', err: new Error('Failed to update settings') });
            }
        } catch (error) {
            errorMessage('profile', 'updateAccountSettingFail');
            setUpdateProfileState({ state: 'failed', err: error as Error });
        }
    };

    const resetForm = () => {
        setForm({
            workSamples: person?.workSamples ?? initialWorkSamples,
            newSample: { title: '', sampleUrl: '', description: '' },
            displayName: person?.displayName ?? 'dung kheng 123123',
            bio: person?.bio ?? 'asdasdasdasdasd',
            skills: person?.skills ?? 'Web development',
            contacts: person?.contacts ?? 'dasdasd',
            portfolioPics: person?.portfolioPics ?? [],
        });
        setEditingSampleId(null);
        setErrors({});
    };

    return {
        form,
        setForm,
        errors,
        isSubmitting,
        editingSampleId,
        addSample,
        editSample,
        deleteSample,
        startEditing,
        cancelEditing,
        validateField,
        onSubmit,
        resetForm,
    };
};