"use client";
import ImageUploadModal from "@/components/Common/Modal/AvatarUploadModal";
import PasswordChangeModal from "@/components/ChangePasswordModal";
import {ProfileImage} from "@/constants/images";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {useHttpPost} from "@/hooks/useHttpPost";
import {useImagePicker} from "@/hooks/useImagePicker";
import Image from "next/image";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useProfileForm} from "../hooks/useProfileForm";
import {ChevronLeft, ChevronRight, Edit, Plus, Trash} from "lucide-react";

interface PortfolioItem {
    id: number;
    imageUrl: string;
    title: string;
}

interface WorkSample {
    id: number;
    title: string;
    sampleUrl: string;
    description: string;
}

interface SkillsData {
    portfolio: PortfolioItem[];
    workSamples: WorkSample[];
}

export default function BasicInformation() {
    const {t} = useTranslation();
    const {execute: uploadUserAvatar} = useHttpPost("uploadUserAvatar");
    const {execute: uploadImage, isMutating: isUploadMuting} = useHttpPost("uploadImage");
    const {profileState, person, card} = useMyUser();

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

    const defaultSkills: SkillsData = {
        portfolio: person?.portfolioPics ?? [],
        workSamples: person?.workSamples ?? [],
    };

    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(defaultSkills.portfolio);
    const [workSamples, setWorkSamples] = useState<WorkSample[]>(defaultSkills.workSamples);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
    const [newImage, setNewImage] = useState({title: ""});
    const [newSample, setNewSample] = useState({title: "", sampleUrl: "", description: ""});
    const [editingImage, setEditingImage] = useState<PortfolioItem | null>(null);
    const [editingSample, setEditingSample] = useState<WorkSample | null>(null);
    const imagesPerPage = 3;
    const samplesPerPage = 2;

    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
    } = useProfileForm(person, card, selectedAvatar, uploadUserAvatar, setSelectedAvatar,
        portfolioItems,
        workSamples,
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Handlers for portfolio images
    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev + imagesPerPage < portfolioItems.length ? prev + imagesPerPage : prev
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev - imagesPerPage >= 0 ? prev - imagesPerPage : 0));
    };

    const handleAddImage = () => {
        if (newImage.title && selectedPortfolioImage) {
            setPortfolioItems([
                ...portfolioItems,
                {id: portfolioItems.length + 1, title: newImage.title, imageUrl: selectedPortfolioImage},
            ]);
            setNewImage({title: ""});
            setSelectedPortfolioImage(null);
            closePortfolioImageModal();
        }
    };


    const handleEditImage = (item: PortfolioItem) => {
        setEditingImage(item);
        setNewImage({title: item.title});
        setSelectedPortfolioImage(item.imageUrl);
    };

    const handleUpdateImage = () => {
        if (editingImage && newImage.title && selectedPortfolioImage) {
            setPortfolioItems(
                portfolioItems.map((item) =>
                    item.id === editingImage.id ? {
                        ...item,
                        title: newImage.title,
                        imageUrl: selectedPortfolioImage
                    } : item
                )
            );
            setEditingImage(null);
            setNewImage({title: ""});
            setSelectedPortfolioImage(null);
            closePortfolioImageModal();
        }
    };

    const handleDeleteImage = (id: number) => {
        setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
    };

    const handleNextSample = () => {
        setCurrentSampleIndex((prev) =>
            prev + samplesPerPage < workSamples.length ? prev + samplesPerPage : prev
        );
    };

    const handlePrevSample = () => {
        setCurrentSampleIndex((prev) => (prev - samplesPerPage >= 0 ? prev - samplesPerPage : 0));
    };

    const handleAddSample = () => {
        if (newSample.title && newSample.sampleUrl && newSample.description) {
            setWorkSamples([
                ...workSamples,
                {
                    id: workSamples.length + 1,
                    title: newSample.title,
                    sampleUrl: newSample.sampleUrl,
                    description: newSample.description
                },
            ]);
            setNewSample({title: "", sampleUrl: "", description: ""});
        }
    };

    const handleEditSample = (sample: WorkSample) => {
        setEditingSample(sample);
        setNewSample({title: sample.title, sampleUrl: sample.sampleUrl, description: sample.description});
    };

    const handleUpdateSample = () => {
        if (editingSample && newSample.title && newSample.sampleUrl && newSample.description) {
            setWorkSamples(
                workSamples.map((sample) =>
                    sample.id === editingSample.id
                        ? {
                            ...sample,
                            title: newSample.title,
                            url: newSample.sampleUrl,
                            description: newSample.description
                        }
                        : sample
                )
            );
            setEditingSample(null);
            setNewSample({title: "", sampleUrl: "", description: ""});
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
                            className="absolute bottom-0 right-0 bg-primary rounded-full p-2"
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
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
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
                            <span className="text-gray-500 mr-2">108jobs.com/user/</span>
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

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                {t("profileInfo.sectionCoreSkills")}
                            </label>
                            <p className="text-[12px] text-gray-500 mb-2">
                                {t("profileInfo.subtitleCoreSkills")}
                            </p>
                            <div className="flex items-center gap-4">
                                <input
                                    {...register("skills")}
                                    type="text"
                                    placeholder={t("profileInfo.coreSkillPlaceholder")}
                                    className="text-text-primary flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="mt-6 text-text-primary">
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                {t("profileInfo.sectionPortfolioImages")}
                            </label>
                            <p className="text-[12px] text-gray-500 mb-2">
                                {t("profileInfo.subtitlePortfolioImages")}
                            </p>
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    {editingImage ? t("profileInfo.editImage") : t("profileInfo.addImage")}
                                </h3>
                                <div className="relative flex items-start space-x-4">
                                    <div className="flex-1 max-w-md">
                                        <div
                                            onClick={handleSelectPortfolioFile}
                                            className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-between px-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                                        >
                                            <input
                                                type="file"
                                                ref={portfolioFileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handlePortfolioFileChange}
                                            />
                                            <span className="text-gray-500 text-sm truncate">
        {selectedPortfolioImage ? t("profileInfo.imageSelected") : t("profileInfo.selectImage")}
      </span>
                                            <button
                                                type="button"
                                                onClick={handleSelectPortfolioFile}
                                                className="flex items-center justify-center bg-primary rounded-full p-2 hover:bg-[#063a68] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isUploadMuting}
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
                                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    {selectedPortfolioImage && (
                                        <div className="flex-shrink-0">
                                            <Image
                                                src={selectedPortfolioImage}
                                                alt="Portfolio preview"
                                                width={80}
                                                height={80}
                                                className="h-20 w-20 object-cover rounded-lg shadow-sm border border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={editingImage ? handleUpdateImage : handleAddImage}
                                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#063a68] transition-colors duration-200 flex items-center"
                                    disabled={isUploadMuting || !newImage.title || !selectedPortfolioImage}
                                >
                                    <Plus className="w-5 h-5 mr-2"/>
                                    {editingImage ? t("profileInfo.updateImage") : t("profileInfo.addImage")}
                                </button>
                                {editingImage && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingImage(null);
                                            setNewImage({title: ""});
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
                                        <div key={item.id}
                                             className="h-56 rounded-lg flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105">
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
                                                        type="button"
                                                        onClick={() => handleEditImage(item)}
                                                        className="p-1 text-primary hover:text-blue-800"
                                                    >
                                                        <Edit className="w-5 h-5"/>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteImage(item.id)}
                                                        className="p-1 text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash className="w-5 h-5"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {portfolioItems.length > imagesPerPage && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handlePrevImage}
                                                disabled={currentImageIndex === 0}
                                                className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary text-white backdrop-blur-sm transition-all duration-200 ${
                                                    currentImageIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:backdrop-blur-none hover:bg-[#063a68]"
                                                }`}
                                            >
                                                <ChevronLeft className="w-6 h-6"/>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNextImage}
                                                disabled={currentImageIndex + imagesPerPage >= portfolioItems.length}
                                                className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary text-white backdrop-blur-sm transition-all duration-200 ${
                                                    currentImageIndex + imagesPerPage >= portfolioItems.length
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "hover:backdrop-blur-none hover:bg-[#063a68]"
                                                }`}
                                            >
                                                <ChevronRight className="w-6 h-6"/>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-text-primary">
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                {t("profileInfo.sectionWorkSamples")}
                            </label>
                            <p className="text-[12px] text-gray-500 mb-2">
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
                                        onChange={(e) => setNewSample({...newSample, title: e.target.value})}
                                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t("profileInfo.sampleUrl")}
                                        value={newSample.sampleUrl}
                                        onChange={(e) => setNewSample({...newSample, sampleUrl: e.target.value})}
                                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <textarea
                                        placeholder={t("profileInfo.sampleDescription")}
                                        value={newSample.description}
                                        onChange={(e) => setNewSample({...newSample, description: e.target.value})}
                                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary col-span-1 sm:col-span-2"
                                        rows={4}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={editingSample ? handleUpdateSample : handleAddSample}
                                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#063a68] transition-colors duration-200 flex items-center"
                                >
                                    <Plus className="w-5 h-5 mr-2"/>
                                    {editingSample ? t("profileInfo.updateWorkSample") : t("profileInfo.addWorkSample")}
                                </button>
                                {editingSample && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingSample(null);
                                            setNewSample({title: "", sampleUrl: "", description: ""});
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
                                        <div key={sample.id}
                                             className="p-4 rounded-lg border border-gray-200 transition-transform duration-300 hover:scale-105">
                                            <h4 className="font-medium text-gray-800">{sample.title}</h4>
                                            <p className="text-gray-600 text-sm mt-1">{sample.description}</p>
                                            <a href={sample.sampleUrl} target="_blank" rel="noopener noreferrer"
                                               className="text-primary text-sm hover:underline">
                                                {t("profileInfo.viewWorkSample")}
                                            </a>
                                            <div className="flex justify-start gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditSample(sample)}
                                                    className="p-1 text-primary hover:text-blue-800"
                                                >
                                                    <Edit className="w-5 h-5"/>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteSample(sample.id)}
                                                    className="p-1 text-red-600 hover:text-red-800"
                                                >
                                                    <Trash className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {workSamples.length > samplesPerPage && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handlePrevSample}
                                                disabled={currentSampleIndex === 0}
                                                className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary text-white backdrop-blur-sm transition-all duration-200 ${
                                                    currentSampleIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:backdrop-blur-none hover:bg-[#063a68]"
                                                }`}
                                            >
                                                <ChevronLeft className="w-6 h-6"/>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNextSample}
                                                disabled={currentSampleIndex + samplesPerPage >= workSamples.length}
                                                className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-primary text-white backdrop-blur-sm transition-all duration-200 ${
                                                    currentSampleIndex + samplesPerPage >= workSamples.length
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : "hover:backdrop-blur-none hover:bg-[#063a68]"
                                                }`}
                                            >
                                                <ChevronRight className="w-6 h-6"/>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* contact info */}
                    <div className="mt-6 text-text-primary">
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            {t("profileInfo.sectionContactInfo")}
                        </label>
                        <p className="text-[12px] text-gray-500 mb-2">
                            {t("profileInfo.subtitleContactInfo")}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>

                                <textarea
                                    {...register("contacts")}
                                    placeholder={t("profileInfo.customContactPlaceholder")}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                                    rows={3}
                                />
                                {errors.contacts && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.contacts.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="self-end w-fit">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="submit-button px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#063a68] transition-colors duration-200"
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

            <div
                className="border border-border-primary rounded-lg bg-white p-6 flex flex-col gap-4 sm:gap-0 sm:flex-row justify-between">
                <div className="text-[16px] text-text-primary font-medium">
                    {t("profileInfo.sectionPassword")}
                    <p className="text-[14px] text-text-secondary font-normal">
                        {t("profileInfo.passwordDescription")}
                    </p>
                </div>
                <div className="self-end w-full sm:w-fit">
                    <button
                        onClick={openModal}
                        className="w-full bg-primary text-white font-medium py-2.5 px-4 rounded-lg hover:bg-[#063a68] transition-colors"
                    >
                        {t("profileInfo.buttonSetPassword")}
                    </button>
                </div>
            </div>

            <PasswordChangeModal isOpen={isModalOpen} onClose={closeModal}/>
            <ImageUploadModal
                isOpen={isAvatarModalOpen}
                onClose={closeAvatarImageModal}
                onImageUpload={handleAvatarImageUpload}
                uploadImage={uploadUserAvatar}
            />
            <ImageUploadModal
                title={t("uploadInstruction.portfolioTitle")}
                isOpen={isPortfolioImageModalOpen}
                onClose={closePortfolioImageModal}
                onImageUpload={handlePortfolioImageUpload}
                uploadImage={uploadImage}
            />
        </>
    );
}