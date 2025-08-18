"use client";
import ImageUploadModal from "@/components/AvatarUploadModal";
import PasswordChangeModal from "@/components/ChangePasswordModal";
import { ProfileImage } from "@/constants/images";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { useDateOptions } from "@/hooks/useDateOptions";
import { useHttpPost } from "@/hooks/useHttpPost";
import { useImagePicker } from "@/hooks/useImagePicker";
import Image from "next/image";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useProfileForm } from "../hooks/useProfileForm";
import { Plus, Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";

interface PortfolioItem {
    id: number;
    imageUrl: string;
    title: string;
}

interface WorkSample {
    id: number;
    title: string;
    url: string;
    description: string;
}

export default function BasicInformation() {
    const { t } = useTranslation();
    const { days, months, years } = useDateOptions();
    const { execute: uploadImage, isMutating: isUploadMuting } = useHttpPost("uploadImage");
    const { profileState, person, card } = useMyUser();

    // Avatar image picker
    const {
        selectedImage: selectedAvatar,
        setSelectedImage: setSelectedAvatar,
        isImageModalOpen: isAvatarModalOpen,
        fileInputRef: avatarFileInputRef,
        handleFileChange: handleAvatarFileChange,
        handleSelectFile: handleSelectAvatarFile,
        handleImageUpload: handleAvatarImageUpload,
        closeImageModal: closeAvatarImageModal,
    } = useImagePicker(profileState === "success" ? person?.avatar : undefined);

    // Portfolio image picker
    const {
        selectedImage: selectedPortfolioImage,
        setSelectedImage: setSelectedPortfolioImage,
        isImageModalOpen: isPortfolioImageModalOpen,
        fileInputRef: portfolioFileInputRef,
        handleFileChange: handlePortfolioFileChange,
        handleSelectFile: handleSelectPortfolioFile,
        handleImageUpload: handlePortfolioImageUpload,
        closeImageModal: closePortfolioImageModal,
    } = useImagePicker();

    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
    } = useProfileForm(person, card, selectedAvatar, uploadImage, setSelectedAvatar);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // State for portfolio images and work samples
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
        { id: 1, imageUrl: "https://colorlib.com/wp/wp-content/uploads/sites/2/dalya-baron.jpg", title: "Portfolio Image 1" },
        { id: 2, imageUrl: "https://colorlib.com/wp/wp-content/uploads/sites/2/dalya-baron.jpg", title: "Portfolio Image 2" },
        { id: 3, imageUrl: "https://colorlib.com/wp/wp-content/uploads/sites/2/dalya-baron.jpg", title: "Portfolio Image 3" },
        { id: 4, imageUrl: "https://colorlib.com/wp/wp-content/uploads/sites/2/dalya-baron.jpg", title: "Portfolio Image 4" },
    ]);

    const [workSamples, setWorkSamples] = useState<WorkSample[]>([
        {
            id: 1,
            title: "E-commerce Website",
            url: "https://example.com/ecommerce",
            description: "A fully responsive e-commerce platform with payment integration.",
        },
        {
            id: 2,
            title: "Brand Identity Project",
            url: "https://example.com/brand-identity",
            description: "Designed a complete brand identity package including logo and marketing materials.",
        },
        {
            id: 3,
            title: "Portfolio Website",
            url: "https://example.com/portfolio",
            description: "Developed a personal portfolio website showcasing creative work.",
        },
        {
            id: 4,
            title: "Mobile App Landing Page",
            url: "https://example.com/mobile-app",
            description: "Created a sleek landing page for a mobile application launch.",
        },
    ]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
    const [newImage, setNewImage] = useState({ title: "" });
    const [newSample, setNewSample] = useState({ title: "", url: "", description: "" });
    const [editingImage, setEditingImage] = useState<PortfolioItem | null>(null);
    const [editingSample, setEditingSample] = useState<WorkSample | null>(null);
    const imagesPerPage = 3;
    const samplesPerPage = 2;
    const totalImagePages = Math.ceil(portfolioItems.length / imagesPerPage);
    const totalSamplePages = Math.ceil(workSamples.length / samplesPerPage);

    // Handlers for portfolio images
    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev + imagesPerPage < portfolioItems.length ? prev + imagesPerPage : prev
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev - imagesPerPage >= 0 ? prev - imagesPerPage : 0));
    };

    const handleAddImage = async () => {
        if (newImage.title && selectedPortfolioImage) {
            // Simulate upload and get URL (in real app, this comes from backend)
            const uploadedImageUrl = await handlePortfolioImageUpload();
            if (uploadedImageUrl) {
                setPortfolioItems([
                    ...portfolioItems,
                    { id: portfolioItems.length + 1, title: newImage.title, imageUrl: uploadedImageUrl },
                ]);
                setNewImage({ title: "" });
                setSelectedPortfolioImage(null);
                closePortfolioImageModal();
            }
        }
    };

    const handleEditImage = (item: PortfolioItem) => {
        setEditingImage(item);
        setNewImage({ title: item.title });
        setSelectedPortfolioImage(item.imageUrl);
    };

    const handleUpdateImage = async () => {
        if (editingImage && newImage.title) {
            let imageUrl = editingImage.imageUrl;
            if (selectedPortfolioImage && selectedPortfolioImage !== editingImage.imageUrl) {
                imageUrl = await handlePortfolioImageUpload();
            }
            if (imageUrl) {
                setPortfolioItems(
                    portfolioItems.map((item) =>
                        item.id === editingImage.id ? { ...item, title: newImage.title, imageUrl } : item
                    )
                );
                setEditingImage(null);
                setNewImage({ title: "" });
                setSelectedPortfolioImage(null);
                closePortfolioImageModal();
            }
        }
    };

    const handleDeleteImage = (id: number) => {
        setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
    };

    // Handlers for work samples
    const handleNextSample = () => {
        setCurrentSampleIndex((prev) =>
            prev + samplesPerPage < workSamples.length ? prev + samplesPerPage : prev
        );
    };

    const handlePrevSample = () => {
        setCurrentSampleIndex((prev) => (prev - samplesPerPage >= 0 ? prev - samplesPerPage : 0));
    };

    const handleAddSample = () => {
        if (newSample.title && newSample.url && newSample.description) {
            setWorkSamples([
                ...workSamples,
                { id: workSamples.length + 1, title: newSample.title, url: newSample.url, description: newSample.description },
            ]);
            setNewSample({ title: "", url: "", description: "" });
        }
    };

    const handleEditSample = (sample: WorkSample) => {
        setEditingSample(sample);
        setNewSample({ title: sample.title, url: sample.url, description: sample.description });
    };

    const handleUpdateSample = () => {
        if (editingSample && newSample.title && newSample.url && newSample.description) {
            setWorkSamples(
                workSamples.map((sample) =>
                    sample.id === editingSample.id
                        ? { ...sample, title: newSample.title, url: newSample.url, description: newSample.description }
                        : sample
                )
            );
            setEditingSample(null);
            setNewSample({ title: "", url: "", description: "" });
        }
    };

    const handleDeleteSample = (id: number) => {
        setWorkSamples(workSamples.filter((sample) => sample.id !== id));
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="border border-border-primary rounded-lg bg-white py-6 mb-8"
            >
                <div className="border-b border-border-primary px-6">
                    <h2 className="text-[16px] font-medium mb-2 text-text-primary">
                        {t("profileInfo.sectionAccountInfo")}
                    </h2>
                    <p className="text-gray-600 mb-6 text-[14px] font-sans">
                        {t("profileInfo.subtitleAccountInfo")}
                    </p>
                </div>

                <div className="flex justify-center my-8 px-6">
                    <div className="relative">
                        <div
                            onClick={handleSelectAvatarFile}
                            className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer"
                        >
                            <input
                                type="file"
                                ref={avatarFileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarFileChange}
                            />
                            <Image
                                src={selectedAvatar ? selectedAvatar : ProfileImage.avatar}
                                alt="avatar"
                                className="w-full h-full rounded-full"
                                width={500}
                                height={500}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSelectAvatarFile}
                            className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2"
                        >
                            <svg
                                className="w-4 h-4 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-6 px-6 font-sans">
                    <div>
                        <label className="block text-sm text-text-primary font-semibold mb-2">
                            {t("profileInfo.labelUsername")}
                        </label>
                        <div className="flex items-center">
                            <span className="text-gray-500 mr-2">fastwork.co/user/</span>
                            <input
                                {...register("username")}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-text-primary font-sans outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-text-primary font-semibold text-gray-600 mb-2">
                            {t("profileInfo.labelDisplayName")}
                        </label>
                        <p className="text-[12px] text-gray-500 mb-2">
                            {t("profileInfo.nameTrustNote")}
                        </p>
                        <input
                            {...register("displayName", {
                                required: t("profileInfo.accountInfo"),
                                validate: (value) =>
                                    value.trim().length > 0 || t("profileInfo.invalidDisplayName"),
                            })}
                            className="text-text-primary w-full px-4 py-2 border border-border-primary rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.displayName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.displayName.message}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm text-text-primary font-semibold text-gray-600 mb-2">
                            {t("profileInfo.labelBirthdate")}
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            <select
                                {...register("birthDay")}
                                defaultValue="Day"
                                className="border border-gray-300 rounded-lg px-3 py-2 text-text-primary"
                            >
                                <option disabled value="Day">
                                    {t("profileInfo.day")}
                                </option>
                                {days.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                            <select
                                {...register("birthMonth")}
                                defaultValue="Month"
                                className="border border-gray-300 rounded-lg px-3 py-2 text-text-primary"
                            >
                                <option disabled value="Month">
                                    {t("profileInfo.month")}
                                </option>
                                {months.map((month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                            <select
                                {...register("birthYear")}
                                defaultValue="Year"
                                className="border border-gray-300 rounded-lg px-3 py-2 text-text-primary"
                            >
                                <option disabled value="Year">
                                    {t("profileInfo.year")}
                                </option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                {t("profileInfo.bio")}
                            </label>
                            <textarea
                                {...register("bio")}
                                placeholder={t("profileInfo.bioPlaceholder")}
                                rows={5}
                                className="text-text-primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>
                    </div>

                    <div className="self-end w-fit">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="submit-button px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            {isSubmitting || isUploadMuting ? (
                                <span>{t("profileInfo.saving")}...</span>
                            ) : (
                                t("profileInfo.save")
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* Portfolio Images Section */}
            <section className="border border-border-primary rounded-lg bg-white p-6 mb-8">
                <h2 className="text-[16px] font-medium mb-2 text-text-primary">
                    {t("profileInfo.sectionPortfolioImages")}
                </h2>
                <p className="text-gray-600 mb-6 text-[14px] font-sans">
                    {t("profileInfo.subtitlePortfolioImages")}
                </p>
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        {editingImage ? t("profileInfo.editImage") : t("profileInfo.addImage")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder={t("profileInfo.imageTitle")}
                            value={newImage.title}
                            onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <div className="relative">
                            <div
                                onClick={handleSelectPortfolioFile}
                                className="w-full h-10 border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-gray-50"
                            >
                                <input
                                    type="file"
                                    ref={portfolioFileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePortfolioFileChange}
                                />
                                <span className="text-gray-500 text-sm">
                  {selectedPortfolioImage ? t("profileInfo.imageSelected") : t("profileInfo.selectImage")}
                </span>
                            </div>
                            {selectedPortfolioImage && (
                                <Image
                                    src={selectedPortfolioImage}
                                    alt="Portfolio preview"
                                    width={100}
                                    height={100}
                                    className="mt-2 h-20 w-20 object-cover rounded-lg"
                                />
                            )}
                            <button
                                type="button"
                                onClick={handleSelectPortfolioFile}
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-blue-600 rounded-full p-2"
                            >
                                <svg
                                    className="w-4 h-4 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={editingImage ? handleUpdateImage : handleAddImage}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                        disabled={isUploadMuting}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        {editingImage ? t("profileInfo.updateImage") : t("profileInfo.addImage")}
                    </button>
                    {editingImage && (
                        <button
                            onClick={() => {
                                setEditingImage(null);
                                setNewImage({ title: "" });
                                setSelectedPortfolioImage(null);
                            }}
                            className="mt-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            {t("profileInfo.cancel")}
                        </button>
                    )}
                </div>

                <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {portfolioItems.slice(currentImageIndex, currentImageIndex + imagesPerPage).map((item) => (
                            <div key={item.id} className="h-56 rounded-lg flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    width={300}
                                    height={200}
                                    className="w-full h-36 object-cover rounded-t-lg"
                                />
                                <div className="p-2 text-center w-full">
                                    <p className="text-gray-700 text-sm font-medium">{item.title}</p>
                                    <div className="flex justify-center gap-2 mt-2">
                                        <button
                                            onClick={() => handleEditImage(item)}
                                            className="p-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteImage(item.id)}
                                            className="p-1 text-red-600 hover:text-red-800"
                                        >
                                            <Trash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {portfolioItems.length > imagesPerPage && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    disabled={currentImageIndex === 0}
                                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white backdrop-blur-sm transition-all duration-200 ${
                                        currentImageIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:backdrop-blur-none hover:bg-blue-700"
                                    }`}
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    disabled={currentImageIndex + imagesPerPage >= portfolioItems.length}
                                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white backdrop-blur-sm transition-all duration-200 ${
                                        currentImageIndex + imagesPerPage >= portfolioItems.length
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:backdrop-blur-none hover:bg-blue-700"
                                    }`}
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Work Samples Section */}
            <section className="border border-border-primary rounded-lg bg-white p-6 mb-8">
                <h2 className="text-[16px] font-medium mb-2 text-text-primary">
                    {t("profileInfo.sectionWorkSamples")}
                </h2>
                <p className="text-gray-600 mb-6 text-[14px] font-sans">
                    {t("profileInfo.subtitleWorkSamples")}
                </p>
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        {editingSample ? t("profileInfo.editWorkSample") : t("profileInfo.addWorkSample")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder={t("profileInfo.sampleTitle")}
                            value={newSample.title}
                            onChange={(e) => setNewSample({ ...newSample, title: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <input
                            type="text"
                            placeholder={t("profileInfo.sampleUrl")}
                            value={newSample.url}
                            onChange={(e) => setNewSample({ ...newSample, url: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <textarea
                            placeholder={t("profileInfo.sampleDescription")}
                            value={newSample.description}
                            onChange={(e) => setNewSample({ ...newSample, description: e.target.value })}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 col-span-1 sm:col-span-2"
                            rows={4}
                        />
                    </div>
                    <button
                        onClick={editingSample ? handleUpdateSample : handleAddSample}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        {editingSample ? t("profileInfo.updateWorkSample") : t("profileInfo.addWorkSample")}
                    </button>
                    {editingSample && (
                        <button
                            onClick={() => {
                                setEditingSample(null);
                                setNewSample({ title: "", url: "", description: "" });
                            }}
                            className="mt-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            {t("profileInfo.cancel")}
                        </button>
                    )}
                </div>

                <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {workSamples.slice(currentSampleIndex, currentSampleIndex + samplesPerPage).map((sample) => (
                            <div key={sample.id} className="p-4 rounded-lg border border-gray-200 transition-transform duration-300 hover:scale-105">
                                <h4 className="font-medium text-gray-800">{sample.title}</h4>
                                <p className="text-gray-600 text-sm mt-1">{sample.description}</p>
                                <a href={sample.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                                    {t("profileInfo.viewWorkSample")}
                                </a>
                                <div className="flex justify-start gap-2 mt-2">
                                    <button
                                        onClick={() => handleEditSample(sample)}
                                        className="p-1 text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSample(sample.id)}
                                        className="p-1 text-red-600 hover:text-red-800"
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {workSamples.length > samplesPerPage && (
                            <>
                                <button
                                    onClick={handlePrevSample}
                                    disabled={currentSampleIndex === 0}
                                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white backdrop-blur-sm transition-all duration-200 ${
                                        currentSampleIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:backdrop-blur-none hover:bg-blue-700"
                                    }`}
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={handleNextSample}
                                    disabled={currentSampleIndex + samplesPerPage >= workSamples.length}
                                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white backdrop-blur-sm transition-all duration-200 ${
                                        currentSampleIndex + samplesPerPage >= workSamples.length
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:backdrop-blur-none hover:bg-blue-700"
                                    }`}
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <div className="border border-border-primary rounded-lg bg-white p-6 flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between">
                <div className="text-[16px] text-text-primary font-medium">
                    {t("profileInfo.sectionPassword")}
                    <p className="text-[14px] text-text-secondary font-normal">
                        {t("profileInfo.passwordDescription")}
                    </p>
                </div>
                <div className="self-end w-full sm:w-fit">
                    <button
                        onClick={openModal}
                        className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {t("profileInfo.buttonSetPassword")}
                    </button>
                </div>
            </div>

            <PasswordChangeModal isOpen={isModalOpen} onClose={closeModal} />
            <ImageUploadModal
                isOpen={isAvatarModalOpen}
                onClose={closeAvatarImageModal}
                onImageUpload={handleAvatarImageUpload}
                uploadImage={uploadImage}
            />
            <ImageUploadModal
                isOpen={isPortfolioImageModalOpen}
                onClose={closePortfolioImageModal}
                onImageUpload={handlePortfolioImageUpload}
                uploadImage={uploadImage}
            />
        </>
    );
}