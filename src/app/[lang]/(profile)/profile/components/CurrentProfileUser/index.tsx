"use client";
import {AssetIcon} from "@/constants/icons";
import {ProfileImage} from "@/constants/images";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {formatDateToLong} from "@/utils/formatDateToLong";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ChevronLeft, ChevronRight, X} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, {useEffect, useRef, useState} from "react";
import {Person} from "lemmy-js-client";
import {useTranslation} from "react-i18next";
import NotFound from "@/app/[lang]/not-found";

interface ProfileProps {
    profile: Person | null;
}

const CurrentProfileUser: React.FC<ProfileProps> = ({profile}) => {
    const {t} = useTranslation();

    const {person: currentUserProfile} = useMyUser();
    const [activeTab, setActiveTab] = useState<"reviews" | "clients">("reviews");
    const [showFullBio, setShowFullBio] = useState(false);
    const [isClamped, setIsClamped] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const bioRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (bioRef.current) {
            const el = bioRef.current;
            setIsClamped(el.scrollHeight > el.clientHeight);
        }
    }, [profile?.bio]);

    // Fake data for reviews
    const fakeReviews = [
        {
            id: 1,
            reviewerName: "Alice Smith",
            reviewerAvatar: ProfileImage.avatar,
            rating: 5,
            createdAt: "2025-07-15T10:00:00Z",
            comment: "Amazing work! Delivered on time and exceeded expectations.",
        },
        {
            id: 2,
            reviewerName: "Bob Johnson",
            reviewerAvatar: ProfileImage.avatar,
            rating: 4,
            createdAt: "2025-06-20T14:30:00Z",
            comment: "Very professional and great communication.",
        },
        {
            id: 3,
            reviewerName: "Carol Williams",
            reviewerAvatar: ProfileImage.avatar,
            rating: 5,
            createdAt: "2025-05-10T09:15:00Z",
            comment: "Highly skilled and a pleasure to work with!",
        },
    ];

    // Fake data for clients
    const fakeClients = [
        {
            id: 1,
            clientName: "TechCorp",
            projectTitle: "E-commerce Website Development",
            completionDate: "2025-04-01",
            description: "Developed a fully responsive e-commerce platform with payment integration.",
        },
        {
            id: 2,
            clientName: "CreativeAgency",
            projectTitle: "Brand Identity Design",
            completionDate: "2025-02-15",
            description: "Created a comprehensive brand identity package including logo and marketing materials.",
        },
    ];

    const portfolioItems = profile?.portfolioPics ?? [];
    const workSamples = profile?.workSamples ?? [];

    const imagesPerPage = 3;
    const samplesPerPage = 2;

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev + imagesPerPage < portfolioItems.length ? prev + imagesPerPage : prev
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev - imagesPerPage >= 0 ? prev - imagesPerPage : 0
        );
    };

    const handleNextSample = () => {
        setCurrentSampleIndex((prev) =>
            prev + samplesPerPage < workSamples.length ? prev + samplesPerPage : prev
        );
    };

    const handlePrevSample = () => {
        setCurrentSampleIndex((prev) =>
            prev - samplesPerPage >= 0 ? prev - samplesPerPage : 0
        );
    };

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    if (!profile) {
        NotFound();
    }

    console.log("profile: ", profile?.contacts)

    const isOwnProfile = currentUserProfile?.id === profile?.id;

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 h-48 sm:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-opacity-50 bg-black flex items-center justify-center">
                    <Image
                        src={AssetIcon.logoIcon}
                        alt="logoIcon"
                        className="opacity-20 object-contain"
                        width={200}
                        height={200}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div
                            className="bg-white shadow-lg rounded-2xl p-6 -mt-24 relative transition-all duration-300 hover:shadow-xl">
                            {/* Name, Profile Picture, Headline */}
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <Image
                                        src={profile?.avatar || ProfileImage.avatar}
                                        alt="Avatar"
                                        className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 border-white shadow-md"
                                        width={160}
                                        height={160}
                                    />
                                    {isOwnProfile && (
                                        <Link
                                            prefetch={false}
                                            href="/account-setting/basic-info"
                                            className="absolute top-2 right-2 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faEdit} className="text-gray-600"/>
                                        </Link>
                                    )}
                                </div>
                                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                                    {profile?.name}
                                </h2>
                            </div>

                            {/* Bio Section */}
                            <div className="mt-6 px-4">
                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <p
                                        ref={bioRef}
                                        className={`text-gray-600 text-sm leading-relaxed ${showFullBio ? "" : "line-clamp-4"}`}
                                    >
                                        {profile?.bio}
                                    </p>
                                    {isClamped && !showFullBio && (
                                        <button
                                            onClick={() => setShowFullBio(true)}
                                            className="mt-2 text-blue-600 text-sm font-medium hover:underline"
                                        >
                                            See More
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Core Skills */}
                            <div className="mt-6">
                                <h3 className="text-blue-600 font-semibold mb-3">{t("profile.coreSkills")}</h3>
                                <div className="flex flex-wrap gap-2">
                                            <span
                                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                                            >
                                                {profile?.skills}
                                            </span>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="mt-6">
                                <h3 className="text-blue-600 font-semibold mb-3">
                                    {t("profileInfo.sectionContactInfo")}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <p className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-pre-line">
                                        {profile?.contacts}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </aside>

                    {/* Main Content Section */}
                    <section className="lg:col-span-2">

                        {/* Portfolio (Images) */}
                        {portfolioItems.length > 0 && (
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                                        {t("profile.portfolio")}
                                    </h2>
                                </div>
                                <div className="relative bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative">
                                        {portfolioItems.slice(currentImageIndex, currentImageIndex + imagesPerPage).map((item) => (
                                            <div key={item.id}
                                                 className="h-48 rounded-lg flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105">
                                                <div
                                                    className="w-full h-36 cursor-pointer"
                                                    onClick={() => openImageModal(item.imageUrl)}
                                                >
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        width={300}
                                                        height={200}
                                                        className="w-full h-full object-cover rounded-t-lg"
                                                    />
                                                </div>
                                                <div className="p-2 text-center">
                                                    <p className="text-gray-700 text-sm font-medium">{item.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {portfolioItems.length > imagesPerPage && (
                                            <>
                                                <button
                                                    onClick={handlePrevImage}
                                                    disabled={currentImageIndex === 0}
                                                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white backdrop-blur-sm transition-all duration-200 ${currentImageIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:backdrop-blur-none hover:bg-blue-700"}`}
                                                >
                                                    <ChevronLeft className="w-6 h-6"/>
                                                </button>
                                                <button
                                                    onClick={handleNextImage}
                                                    disabled={currentImageIndex + imagesPerPage >= portfolioItems.length}
                                                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white backdrop-blur-sm transition-all duration-200 ${currentImageIndex + imagesPerPage >= portfolioItems.length ? "opacity-50 cursor-not-allowed" : "hover:backdrop-blur-none hover:bg-blue-700"}`}
                                                >
                                                    <ChevronRight className="w-6 h-6"/>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Work Samples (URLs) */}
                        {workSamples.length > 0 && (
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                                        {t("profile.workSamples")}
                                    </h2>
                                </div>
                                <div className="relative bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                                        {workSamples.slice(currentSampleIndex, currentSampleIndex + samplesPerPage).map((sample) => (
                                            <div key={sample.id}
                                                 className="p-4 rounded-lg border border-gray-200 transition-transform duration-300 hover:scale-105">
                                                <h4 className="font-medium text-gray-800">{sample.title}</h4>
                                                <p className="text-gray-600 text-sm mt-1">{sample.description}</p>
                                                <Link href={sample.sampleUrl} target="_blank"
                                                      className="text-blue-600 text-sm hover:underline">
                                                    {t("profile.viewWorkSample")}
                                                </Link>
                                            </div>
                                        ))}
                                        {workSamples.length > samplesPerPage && (
                                            <>
                                                <button
                                                    onClick={handlePrevSample}
                                                    disabled={currentSampleIndex === 0}
                                                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white backdrop-blur-sm transition-all duration-200 ${currentSampleIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:backdrop-blur-none hover:bg-blue-700"}`}
                                                >
                                                    <ChevronLeft className="w-6 h-6"/>
                                                </button>
                                                <button
                                                    onClick={handleNextSample}
                                                    disabled={currentSampleIndex + samplesPerPage >= workSamples.length}
                                                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white backdrop-blur-sm transition-all duration-200 ${currentSampleIndex + samplesPerPage >= workSamples.length ? "opacity-50 cursor-not-allowed" : "hover:backdrop-blur-none hover:bg-blue-700"}`}
                                                >
                                                    <ChevronRight className="w-6 h-6"/>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Image Modal */}
                        {selectedImage && (
                            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                                <div className="relative max-w-4xl w-full">
                                    <button
                                        onClick={closeImageModal}
                                        className="absolute top-2 right-2 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <X className="w-6 h-6"/>
                                    </button>
                                    <Image
                                        src={selectedImage}
                                        alt="Enlarged portfolio image"
                                        width={800}
                                        height={600}
                                        className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Reviews and Clients Section */}
                        <div className="mt-8">
                            <div className="border-b border-gray-200 mb-6">
                                <div className="flex space-x-6">
                                    <button
                                        className={`pb-2 text-sm font-medium transition-colors ${activeTab === "reviews"
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                        }`}
                                        onClick={() => setActiveTab("reviews")}
                                    >
                                        {t("profile.reviewTab")} ({fakeReviews.length})
                                    </button>
                                    <button
                                        className={`pb-2 text-sm font-medium transition-colors ${activeTab === "clients"
                                            ? "text-blue-600 border-b-2 border-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                        }`}
                                        onClick={() => setActiveTab("clients")}
                                    >
                                        {t("profile.clientTab")} ({fakeClients.length})
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {activeTab === "reviews" && fakeReviews.map((review) => (
                                    <div key={review.id}
                                         className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex items-start">
                                            <Image
                                                src={review.reviewerAvatar || ProfileImage.avatar}
                                                alt={review.reviewerName || "username"}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">{review.reviewerName}</h4>
                                                        <span
                                                            className="text-sm text-gray-500">{formatDateToLong(review.createdAt)}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="w-5 h-5 text-yellow-400"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                                            />
                                                        </svg>
                                                        <span
                                                            className="ml-1 font-medium text-gray-800">{review.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {activeTab === "clients" && fakeClients.map((client) => (
                                    <div key={client.id}
                                         className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <h4 className="font-medium text-gray-800">{client.clientName}</h4>
                                        <p className="text-gray-600 text-sm font-semibold mt-1">{client.projectTitle}</p>
                                        <p className="text-gray-500 text-sm">Completed: {client.completionDate}</p>
                                        <p className="text-gray-600 text-sm mt-2">{client.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default CurrentProfileUser;