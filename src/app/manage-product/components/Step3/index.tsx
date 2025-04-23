"use client";

import { API_ROUTES, API_ROUTES_SELLER } from "@/api/endpoints";
import LoadingBlur from "@/components/LoadingBlur";
import { usePrivateImagePost, usePrivatePost } from "@/hooks/api-hooks";
import useImageUpload from "@/hooks/useImageUpload";
import useMultiImageUpload from "@/hooks/useMultiImageUpload";
import { ImageUploadResponse } from "@/types/image";
import { JobType } from "@/types/job";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Plus, Upload, X, Youtube } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  youtubeUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  job: JobType;
  nextStep: () => void;
  prevStep: () => void;
};

const Step3Media = ({ job, nextStep, prevStep }: Props) => {
  const cover = useImageUpload();
  const multi = useMultiImageUpload();

  const [coverError, setCoverError] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { trigger: sendImages, isMutating } = usePrivatePost(
    API_ROUTES_SELLER.job.post_job_step_3
  );

  const { trigger: uploadImage, isMutating: isUploadImage } =
    usePrivateImagePost<ImageUploadResponse>(API_ROUTES.image.upload);

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const validateImages = (): boolean => {
    let valid = true;

    if (!cover.imagePreview) {
      setCoverError("Vui lòng tải ảnh bìa");
      valid = false;
    } else {
      setCoverError(null);
    }

    if (multi.images.length < 2) {
      setGalleryError("Cần ít nhất 2 ảnh dịch vụ");
      valid = false;
    } else {
      setGalleryError(null);
    }

    return valid;
  };

  const onSubmit = async (data: FormData) => {
    if (!validateImages()) return;

    try {
      const coverFile = dataURLtoFile(cover.imagePreview!, "cover.jpg");
      const coverFormData = new FormData();
      coverFormData.append("images[]", coverFile);
      const coverUploadResult = await uploadImage(coverFormData);
      const coverUrl = coverUploadResult?.images?.[0]?.image_url;

      const uploadedServiceUrls = await Promise.all(
        multi.images.map(async (img, index) => {
          const file = dataURLtoFile(img, `service-${index + 1}.jpg`);
          const formData = new FormData();
          formData.append("images[]", file);
          const result = await uploadImage(formData);
          return result?.images?.[0]?.image_url;
        })
      );

      const imagesPayload = [
        {
          image_url: coverUrl,
          is_cover_photo: true,
          sort_order: 1,
          alt: "Ảnh bìa",
        },
        ...uploadedServiceUrls.map((url, i) => ({
          image_url: url,
          is_cover_photo: false,
          sort_order: i + 2,
          alt: `Hình dịch vụ ${i + 1}`,
        })),
      ];

      await sendImages({
        job_id: job.id,
        images: imagesPayload,
        youtube_url: data.youtubeUrl || null,
      });

      nextStep();
    } catch (err) {
      console.error("Submit step 3 error:", err);
    }
  };

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
      {isMutating ||
        (isUploadImage && <LoadingBlur text={"Đang lưu dữ liệu"} />)}
      <h2 className="text-[32px] font-medium mb-6 text-text_primary">
      Tải lên hình ảnh dịch vụ

      </h2>

      <div className="space-y-8 max-w-4xl">
        {/* Cover Image */}
        <div>
          <h3 className="text-[20px] font-medium mb-2 text-text_primary">
            Tải lên ảnh bìa
          </h3>
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg mb-6 flex">
            <Info className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-700 font-normal font-sans leading-6">
              Hướng dẫn chọn ảnh bìa:
              <br />
              • Chọn ảnh bìa thể hiện rõ lĩnh vực và chuyên môn của bạn. Ảnh bìa
              giúp thu hút người thuê lựa chọn dịch vụ của bạn.
              <br />• Đảm bảo sử dụng ảnh bìa khác nhau cho các dịch vụ tương tự
              trong cùng một danh mục. Việc sử dụng ảnh bìa giống nhau sẽ khiến
              dịch vụ của bạn bị từ chối.
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
                  Kéo thả hoặc nhấn để tải lên
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG hoặc GIF (max. 5MB)
                </p>
              </div>
              {coverError && <p className="text-sm text-red-500 mt-2">{coverError}</p>}
              {cover.error && <p className="text-sm text-red-500 mt-1">{cover.error}</p>}
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
        </div>

        {/* Service Images */}
        <div>
          <h3 className="text-[20px] font-medium mb-2 text-text_primary">
            Tải lên ít nhất 2 hình ảnh dịch vụ (2/30)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Người thuê muốn biết về kỹ năng của bạn, chọn ít nhất 2 hình ảnh thể
            hiện kỹ năng và chuyên môn của bạn
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4">
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
                className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4"
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
                  <p className="text-xs text-gray-500">Thêm ảnh</p>
                </div>
              </label>
            )}
          </div>
          {galleryError && <p className="text-sm text-red-500">{galleryError}</p>}
        </div>

        {/* YouTube */}
        <div>
          <h3 className="text-[20px] font-medium mb-2 text-text_primary">
            Video từ YouTube
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Thêm video demo từ YouTube (không bắt buộc)
          </p>
          <div className="flex items-center border border-gray-300 rounded-lg pl-3 overflow-hidden">
            <Youtube className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=example"
              className="text-text_primary flex-1 p-3 border-none focus:outline-none"
              {...register("youtubeUrl")}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            onClick={prevStep}
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            disabled={isMutating || isUploadImage}
          >
            {isMutating || isUploadImage ? "Đang gửi..." : "Tiếp tục"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step3Media;
