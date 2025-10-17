'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { PortfolioPic, SaveUserSettings } from 'lemmy-js-client';
import { useFileUpload } from '@/modules/chat/hooks/useFileUpload';
import { useHttpPost } from '@/hooks/useHttpPost';
import { REQUEST_STATE } from '@/services/HttpService';
import useNotification from '@/hooks/useNotification';
import { v4 as uuidv4 } from 'uuid';

type PortfolioImagesFormData = {
    portfolioImages: PortfolioPic[];
};

type FileEvent = React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>;

export const usePortfolioImagesForm = (
    initialPortfolioImages: PortfolioPic[] = [],
    imagesPerPage: number = 3,
) => {
    const { t } = useTranslation();
    const { successMessage, errorMessage } = useNotification();
    const { execute: saveUserSettings, isMutating: isSubmitting } = useHttpPost('saveUserSettings');

    // Error state for file upload
    const [uploadError, setUploadError] = useState<string | null>(null);

    // File upload hook
    const {
        selectedFile,
        setSelectedFile,
        isDeletingFile,
        handleFileUpload,
        handleRemoveSelectedFile,
    } = useFileUpload({
        setError: setUploadError,
        t,
    });

    // Modal state for image picker
    const [isPortfolioImageModalOpen, setIsPortfolioImageModalOpen] = useState(false);
    const portfolioFileInputRef = useRef<HTMLInputElement | null>(null);

    // Schema for validation using Zod
    const PortfolioPicSchema = z.object({
        id: z.string(),
        imageUrl: z
            .string()
            .url(t('portfolioImages.validation.invalidUrl') || 'Invalid image URL')
            .min(1, t('portfolioImages.validation.imageRequired') || 'Image is required'),
        title: z.string().optional(),
    });

    const PortfolioImagesSchema = z.object({
        portfolioImages: z.array(PortfolioPicSchema),
    });

    // Initialize form with react-hook-form
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isSubmitting: isFormSubmitting },
        reset,
        getValues,
    } = useForm<PortfolioImagesFormData>({
        resolver: zodResolver(PortfolioImagesSchema),
        defaultValues: {
            portfolioImages: initialPortfolioImages,
        },
    });

    // Manage dynamic array of portfolio images
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'portfolioImages',
    });

    // State for image picker modal and editing
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [newImage, setNewImage] = useState({ title: '' });
    const [editingImage, setEditingImage] = useState<PortfolioPic | null>(null);

    // Update form only if initialPortfolioImages changes meaningfully
    useEffect(() => {
        const currentImages = getValues('portfolioImages').map(({ id, imageUrl, title }) => ({ id, imageUrl, title }));
        const newImages = initialPortfolioImages.map(({ id, imageUrl, title }) => ({ id, imageUrl, title }));
        if (JSON.stringify(currentImages) !== JSON.stringify(newImages)) {
            reset({ portfolioImages: initialPortfolioImages });
        }
    }, [initialPortfolioImages, reset, getValues]);

    // Open file picker
    const handleSelectPortfolioFile = useCallback(() => {
        if (portfolioFileInputRef.current) {
            portfolioFileInputRef.current.click();
        }
    }, []);

    // Close file picker modal
    const closePortfolioImageModal = useCallback(() => {
        setIsPortfolioImageModalOpen(false);
        setSelectedFile(null);
        setNewImage({ title: '' });
        setEditingImage(null);
        setUploadError(null);
    }, [setSelectedFile]);

    // Handle file change and upload
    const handlePortfolioFileChange = useCallback(
        async (e: FileEvent): Promise<void> => {
            const file =
                (e as React.ChangeEvent<HTMLInputElement>).target?.files?.[0] ||
                (e as React.DragEvent<HTMLDivElement>).dataTransfer?.files?.[0];

            if (!file) return;

            const previewUrl = URL.createObjectURL(file);
            setSelectedFile({ fileUrl: previewUrl, fileType: file.type, fileName: file.name });
            setIsPortfolioImageModalOpen(true);

            await handleFileUpload(e as unknown as Event);
            if (uploadError) {
                setSelectedFile(null);
                setIsPortfolioImageModalOpen(false);
                setUploadError(t('portfolioImages.uploadFailed') || 'File upload failed');
                return;
            }
        },
        [handleFileUpload, setSelectedFile, uploadError, t],
    );

    // Save portfolio images to server
    const savePortfolioImages = useCallback(
        async (portfolioImages: PortfolioPic[], action: 'addImage' | 'updateImage' | 'deleteImage') => {
            try {
                const payload: SaveUserSettings = {
                    portfolioPics: portfolioImages.filter((item) => item.imageUrl && z.string().url().safeParse(item.imageUrl).success),
                };

                console.log('Saving portfolio images:', { action, payload }); // Debug

                const response = await saveUserSettings(payload);

                if (response.state === REQUEST_STATE.FAILED) {
                    const key = `portfolioImages.${action}.${response.err.name}`;
                    const messageError = t(key) ?? t('global.serverError');
                    errorMessage(null, null, messageError);
                    return false;
                }

                successMessage(null, null, t(`portfolioImages.${action}`) ?? 'Success!');
                return true;
            } catch (error) {
                errorMessage(null, null, t('global.submissionFailed') ?? 'Submission failed!');
                return false;
            }
        },
        [saveUserSettings, successMessage, errorMessage, t],
    );

    // Confirm adding a new image
    const confirmAddImage = useCallback(async (): Promise<void> => {
        if (!selectedFile?.fileUrl || !newImage.title) {
            setUploadError(t('portfolioImages.validation.imageRequired') || 'Image and title are required');
            return;
        }

        if (!z.string().url().safeParse(selectedFile.fileUrl).success) {
            setUploadError(t('portfolioImages.validation.invalidUrl') || 'Invalid image URL');
            return;
        }

        try {
            const newPortfolioImage: PortfolioPic = {
                id: uuidv4(),
                imageUrl: selectedFile.fileUrl,
                title: newImage.title,
            };
            const newPortfolioImages = [...getValues('portfolioImages'), newPortfolioImage];

            console.log('Appending new image:', { newPortfolioImage, newPortfolioImages }); // Debug

            append(newPortfolioImage);
            setNewImage({ title: '' });
            setSelectedFile(null);
            closePortfolioImageModal();

            // Ensure state updates before server call
            await new Promise((resolve) => setTimeout(resolve, 0));

            const success = await savePortfolioImages(newPortfolioImages, 'addImage');
            if (!success) {
                remove(fields.length); // Revert on failure
                setUploadError(t('portfolioImages.addImage.Failed') || 'Failed to add image');
            }
        } catch (error) {
            setUploadError(t('portfolioImages.addImage.Failed') || 'Failed to add image');
        }
    }, [newImage, selectedFile, fields, append, savePortfolioImages, setSelectedFile, closePortfolioImageModal, t, getValues]);

    // Confirm updating an existing image
    const confirmUpdateImage = useCallback(async (): Promise<void> => {
        if (!editingImage || !newImage.title || !selectedFile?.fileUrl) {
            setUploadError(t('portfolioImages.validation.imageRequired') || 'Image and title are required');
            return;
        }

        if (!z.string().url().safeParse(selectedFile.fileUrl).success) {
            setUploadError(t('portfolioImages.validation.invalidUrl') || 'Invalid image URL');
            return;
        }

        try {
            const index = fields.findIndex((field) => field.id === editingImage.id);
            if (index === -1) return;

            const updatedImage: PortfolioPic = {
                ...editingImage,
                title: newImage.title,
                imageUrl: selectedFile.fileUrl,
            };
            const newPortfolioImages = [...getValues('portfolioImages')];
            newPortfolioImages[index] = updatedImage;

            console.log('Updating image:', { updatedImage, newPortfolioImages }); // Debug

            update(index, updatedImage);
            setEditingImage(null);
            setNewImage({ title: '' });
            setSelectedFile(null);
            closePortfolioImageModal();

            // Ensure state updates before server call
            await new Promise((resolve) => setTimeout(resolve, 0));

            const success = await savePortfolioImages(newPortfolioImages, 'updateImage');
            if (!success) {
                update(index, editingImage); // Revert on failure
                setUploadError(t('portfolioImages.updateImage.Failed') || 'Failed to update image');
            }
        } catch (error) {
            setUploadError(t('portfolioImages.updateImage.Failed') || 'Failed to update image');
        }
    }, [editingImage, newImage, selectedFile, fields, update, savePortfolioImages, setSelectedFile, closePortfolioImageModal, t, getValues]);

    // Handle deleting an image
    const handleDeleteImage = useCallback(
        async (id: string) => {
            const index = fields.findIndex((field) => field.id === id);
            if (index === -1) return;

            const previousPortfolioImages = [...getValues('portfolioImages')];
            const image = fields[index];
            const newPortfolioImages = fields.filter((field) => field.id !== id);

            console.log('Deleting image:', { id, newPortfolioImages }); // Debug

            remove(index);

            if (image.imageUrl) {
                await handleRemoveSelectedFile();
                if (uploadError) {
                    update(index, image); // Revert on upload error
                    setUploadError(t('portfolioImages.deleteImage.Failed') || 'Failed to delete image');
                    return;
                }
            }

            const success = await savePortfolioImages(newPortfolioImages, 'deleteImage');
            if (!success) {
                reset({ portfolioImages: previousPortfolioImages }); // Revert on failure
                setUploadError(t('portfolioImages.deleteImage.Failed') || 'Failed to delete image');
            }
        },
        [fields, remove, reset, handleRemoveSelectedFile, uploadError, savePortfolioImages, t, getValues],
    );

    // Handle editing an existing image
    const handleEditImage = useCallback(
        (item: PortfolioPic) => {
            setEditingImage(item);
            setNewImage({ title: item.title ?? '' });
            setSelectedFile({ fileUrl: item.imageUrl, fileType: '', fileName: item.title ?? '' });
            setIsPortfolioImageModalOpen(true);
        },
        [setSelectedFile],
    );

    // Handle pagination
    const handleNextImage = useCallback(() => {
        setCurrentImageIndex((prev) =>
            prev + imagesPerPage < fields.length ? prev + imagesPerPage : prev,
        );
    }, [fields, imagesPerPage]);

    const handlePrevImage = useCallback(() => {
        setCurrentImageIndex((prev) => (prev - imagesPerPage >= 0 ? prev - imagesPerPage : 0));
    }, [imagesPerPage]);

    // Handle form submission
    const onSubmit = useCallback(
        async (data: PortfolioImagesFormData) => {
            const cleanedImages = data.portfolioImages.filter((item) => item.imageUrl && z.string().url().safeParse(item.imageUrl).success);
            console.log('Submitting form:', { cleanedImages }); // Debug
            return await savePortfolioImages(cleanedImages, 'updateImage');
        },
        [savePortfolioImages],
    );

    return {
        control,
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isSubmitting: isSubmitting || isFormSubmitting || isDeletingFile,
        fields,
        append: confirmAddImage,
        remove: handleDeleteImage,
        update: confirmUpdateImage,
        edit: handleEditImage,
        newImage,
        setNewImage,
        editingImage,
        setEditingImage,
        selectedPortfolioImage: selectedFile?.fileUrl || null,
        setSelectedPortfolioImage: (url: string | null) =>
            setSelectedFile(url ? { fileUrl: url, fileType: '', fileName: '' } : null),
        isPortfolioImageModalOpen,
        handleSelectPortfolioFile,
        handlePortfolioFileChange,
        handlePortfolioImageUpload: handleFileUpload,
        closePortfolioImageModal,
        portfolioFileInputRef,
        currentImageIndex,
        handleNextImage,
        handlePrevImage,
        imagesPerPage,
        uploadError,
        confirmAddImage,
        confirmUpdateImage,
    };
};