"use client";
import ImageUploadModal from "@/components/Common/Modal/AvatarUploadModal";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { useHttpPost } from "@/hooks/useHttpPost";
import { useImagePicker } from "@/hooks/useImagePicker";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash } from "lucide-react";

interface PortfolioItem {
    id: number;
    imageUrl: string;
    title: string;
}

export default function PortfolioImages() {
    const { t } = useTranslation();
    const { execute: uploadImage, isMutating: isUploadMuting } = useHttpPost("uploadImage");
    const { profileState, person } = useMyUser();

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

    const defaultPortfolio: PortfolioItem[] = profileState === "success" ? person?.portfolioPics ?? [] : [];
    const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(defaultPortfolio);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [newImage, setNewImage] = useState({ title: "" });
    const [editingImage, setEditingImage] = useState<PortfolioItem | null>(null);
    const imagesPerPage = 3;

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
                { id: portfolioItems.length + 1, title: newImage.title, imageUrl: selectedPortfolioImage },
            ]);
            setNewImage({ title: "" });
            setSelectedPortfolioImage(null);
            closePortfolioImageModal();
        }
    };

    const handleEditImage = (item: PortfolioItem) => {
        setEditingImage(item);
        setNewImage({ title: item.title });
        setSelectedPortfolioImage(item.imageUrl);
    };

    const handleUpdateImage = () => {
        if (editingImage && newImage.title && selectedPortfolioImage) {
            setPortfolioItems(
                portfolioItems.map((item) =>
                    item.id === editingImage.id ? { ...item, title: newImage.title, imageUrl: selectedPortfolioImage } : item
                )
            );
            setEditingImage(null);
            setNewImage({ title: "" });
            setSelectedPortfolioImage(null);
            closePortfolioImageModal();
        }
    };

    const handleDeleteImage = (id: number) => {
        setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
    };

    return (
        <div className="border border-border-primary rounded-lg bg-white py-6 mb-8">
            <div className="border-b border-border-primary px-6">
                <h2 className="text-[16px] font-medium mb-2 text-text-primary">
                    {t("profileInfo.sectionPortfolioImages")}
                </h2>
                <p className="text-gray-600 mb-6 text-[14px] font-sans">
                    {t("profileInfo.subtitlePortfolioImages")}
                </p>
            </div>

            <div className="px-6">
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
                                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                    </svg>
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder={t("profileInfo.imageTitle")}
                                value={newImage.title}
                                onChange={(e) => setNewImage({ title: e.target.value })}
                                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
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
                        <Plus className="w-5 h-5 mr-2" />
                        {editingImage ? t("profileInfo.updateImage") : t("profileInfo.addImage")}
                    </button>
                    {editingImage && (
                        <button
                            type="button"
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
                            <div
                                key={item.id}
                                className="h-56 rounded-lg flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105"
                            >
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
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(item.id)}
                                            className="p-1 text-red-600 hover:text-red-800"
                                        >
                                            <Trash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
                                <ChevronLeft className="w-6 h-6" />
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
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
            </div>
            <ImageUploadModal
                title={t("uploadInstruction.portfolioTitle")}
                isOpen={isPortfolioImageModalOpen}
                onClose={closePortfolioImageModal}
                onImageUpload={handlePortfolioImageUpload}
                uploadImage={uploadImage}
            />
        </div>
    );
}