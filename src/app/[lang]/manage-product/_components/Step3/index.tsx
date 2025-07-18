"use client";

import { API_ROUTES, API_ROUTES_SELLER } from "@/api/endpoints";
import LoadingBlur from "@/components/LoadingBlur";
import LoadingCircle from "@/components/LoadingCircle";
import { LanguageFile } from "@/constants/language";
import { usePrivateImagePost, usePrivatePost } from "@/hooks/api-hooks";
import { useTranslateFile } from "@/hooks/translation/useTranslateFile";
import useImageUpload from "@/hooks/useImageUpload";
import useMultiImageUpload from "@/hooks/useMultiImageUpload";
import { ImageUploadResponse } from "@/types/image";
import { JobType } from "@/types/job";
import { interpolateDouble } from "@/utils/interpolate";
import { Info, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Step3Media = ({
  job,
  nextStep,
  prevStep,
  mutate,
  setIsFormDirty,
}: {
  job: JobType;
  nextStep: () => void;
  prevStep: () => void;
  mutate: () => void;
  setIsFormDirty?: (dirty: boolean) => void;
}) => {
  const createJobLanguage = useTranslateFile(LanguageFile.SELLER_CREATE_JOBS);

  const cover = useImageUpload();
  const multi = useMultiImageUpload();
  const [coverError, setCoverError] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { handleSubmit } = useForm();

  const { trigger: sendImages, isMutating } = usePrivatePost(
    API_ROUTES_SELLER.job.postJobStep3
  );
  const { trigger: uploadImage, isMutating: isUploadImage } =
    usePrivateImagePost<ImageUploadResponse>(API_ROUTES.image.upload);

  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const validateImages = () => {
    let valid = true;
    if (!cover.imagePreview) {
      setCoverError(`${createJobLanguage?.uploadCoverError}`);
      valid = false;
    } else {
      setCoverError(null);
    }
    if (multi.images.length < 2) {
      setGalleryError(`${createJobLanguage?.uploadGalleryError}`);
      valid = false;
    } else {
      setGalleryError(null);
    }
    return valid;
  };

  const onSubmit = async () => {
    if (!validateImages()) return;
    try {
      const coverFile = await urlToFile(cover.imagePreview!, "cover.jpg");
      const coverFormData = new FormData();
      coverFormData.append("images[]", coverFile);
      const coverUploadResult = await uploadImage(coverFormData);
      const coverUrl = coverUploadResult?.images?.[0]?.imageUrl;

      const uploadedServiceUrls = await Promise.all(
        multi.images.map(async (img, index) => {
          const file = await urlToFile(img, `service-${index + 1}.jpg`);
          const formData = new FormData();
          formData.append("images[]", file);
          const result = await uploadImage(formData);
          return result?.images?.[0]?.imageUrl;
        })
      );

      const imagesPayload = [
        {
          imageUrl: coverUrl,
          isCoverPhoto: true,
          sortOrder: 1,
          alt: "Ảnh bìa",
        },
        ...uploadedServiceUrls.map((url, i) => ({
          imageUrl: url,
          isCoverPhoto: false,
          sortOrder: i + 2,
          alt: `Hình dịch vụ ${i + 1}`,
        })),
      ];

      await sendImages({
        jobId: job.id,
        images: imagesPayload,
      });
      await mutate();
      nextStep();
    } catch (err) {
      console.error("Submit step 3 error:", err);
    }
  };

  const [initialCover, setInitialCover] = useState<string | null>(null);
  const [initialGallery, setInitialGallery] = useState<string[]>([]);

  useEffect(() => {
    if (job?.images?.length) {
      const coverImg = job.images.find((img) => img.isCoverPhoto);
      const galleryImgs = job.images.filter((img) => !img.isCoverPhoto);

      if (coverImg) {
        cover.setImagePreview(coverImg.imageUrl);
        setInitialCover(coverImg.imageUrl);
      }

      if (galleryImgs.length > 0) {
        const galleryUrls = galleryImgs.map((img) => img.imageUrl);
        multi.setImages(galleryUrls);
        setInitialGallery(galleryUrls);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  useEffect(() => {
    if (cover.imagePreview !== initialCover) {
      setIsDirty(true);
      return;
    }

    if (multi.images.length !== initialGallery.length) {
      setIsDirty(true);
      return;
    }

    const isGalleryChanged = multi.images.some(
      (img, index) => img !== initialGallery[index]
    );
    if (isGalleryChanged) {
      setIsDirty(true);
      return;
    }
    setIsDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cover.imagePreview, multi.images, initialCover, initialGallery]);

  useEffect(() => {
    setIsFormDirty?.(isDirty);
  }, [isDirty, setIsFormDirty]);

  useEffect(() => {
    if (cover.imagePreview) setCoverError(null);
  }, [cover.imagePreview]);

  useEffect(() => {
    if (multi.images.length >= 2) setGalleryError(null);
  }, [multi.images]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      {isMutating || isUploadImage ? (
        <LoadingBlur text="Đang lưu dữ liệu" />
      ) : null}

      <h2 className="text-[32px] font-medium mb-6 text-text_primary">
        {createJobLanguage?.uploadServiceImagesTitle}
      </h2>

      <div className="space-y-8 max-w-4xl">
        <div>
          <h3 className="text-[20px] font-medium mb-2 text-text_primary">
            {createJobLanguage?.uploadCoverImageTitle}
          </h3>
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg mb-6 flex">
            <Info className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-700 font-normal font-sans leading-6">
              {createJobLanguage?.uploadCoverImageTitle}
              <br />• {createJobLanguage?.coverImageNote}
              <br />• {createJobLanguage?.coverImageNote2}
            </p>
          </div>
          {!cover.imagePreview ? (
            <label
              htmlFor="cover-image"
              className="block cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
            >
              <input
                type="file"
                id="cover-image"
                ref={cover.fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={cover.handleFileChange}
              />
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Drag or drop your file here
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG hoặc GIF (max. 5MB)
                </p>
              </div>
            </label>
          ) : (
            <div className="relative">
              <Image
                src={cover.imagePreview}
                alt="Cover"
                className="w-full h-64 object-cover rounded-lg"
                width={500}
                height={500}
              />
              <button
                type="button"
                onClick={cover.resetImage}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          )}
          {coverError && (
            <p className="text-sm text-red-500 mt-2">{coverError}</p>
          )}
          {cover.error && (
            <p className="text-sm text-red-500 mt-1">{cover.error}</p>
          )}
        </div>

        <div>
          <h3 className="text-[20px] font-medium mb-2 text-text_primary">
            {/* {createJobLanguage?.uploadAtLeast2ImagesTitle} */}
            {interpolateDouble(
              createJobLanguage?.uploadAtLeast2ImagesTitle || "",
              {
                n: multi.images.length,
              }
            )}
          </h3>
          <p className="text-sm text-text_secondary mb-4">
            {createJobLanguage?.uploadAtLeast2ImagesNote}
          </p>

          <div className="grid grid-cols-4 gap-4 mb-4">
            {multi.images.map((img, index) => (
              <div key={index} className="relative">
                <Image
                  src={img}
                  alt={`Service ${index}`}
                  className="w-full h-32 object-cover rounded-lg"
                  width={500}
                  height={500}
                />
                <button
                  type="button"
                  onClick={() => multi.removeImage(index)}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}
            {multi.images.length < 30 && (
              <label
                htmlFor="service-images"
                className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center py-6"
              >
                <input
                  type="file"
                  id="service-images"
                  ref={multi.fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={multi.handleFilesChange}
                />
                <div className="flex flex-col items-center justify-center">
                  <Plus className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">
                    {createJobLanguage?.addImageButton}
                  </p>
                </div>
              </label>
            )}
          </div>
          {galleryError && (
            <p className="text-sm text-red-500">{galleryError}</p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            onClick={prevStep}
          >
            {createJobLanguage?.backButton}
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            disabled={isMutating || isUploadImage}
          >
            {isMutating || isUploadImage ? (
              <LoadingCircle />
            ) : (
              createJobLanguage?.nextButton
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step3Media;
