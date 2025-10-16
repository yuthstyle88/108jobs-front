"use client";
import React, { useState } from "react";
import { Person } from "lemmy-js-client";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import NotFound from "@/app/[lang]/notFound";
import { ProfileImage } from "@/constants/images";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileSidebar from "@/components/Profile/ProfileSidebar";
import PortfolioSlider from "@/components/Profile/PortfolioSlider";
import WorkSamplesSlider from "@/components/Profile/WorkSamplesSlider";
import ImageModal from "@/components/Common/Modal/ImageModal";
import ReviewsAndClients from "@/components/Profile/ReviewsAndClients";

interface ProfileProps {
    profile: Person | null;
}

const CurrentProfileUser: React.FC<ProfileProps> = ({ profile }) => {
    const { person: currentUserProfile } = useMyUser();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
    const isOwnProfile = currentUserProfile?.id === profile?.id;

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    if (!profile) {
        return <NotFound />;
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <ProfileHeader />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <ProfileSidebar profile={profile} />
                    <section className="lg:col-span-2">
                        <PortfolioSlider
                            portfolioItems={portfolioItems}
                            isOwnProfile={isOwnProfile}
                            onImageClick={openImageModal}
                        />
                        <WorkSamplesSlider workSamples={workSamples} isOwnProfile={isOwnProfile} />
                        {selectedImage && <ImageModal imageUrl={selectedImage} onClose={closeImageModal} />}
                        <ReviewsAndClients reviews={fakeReviews} clients={fakeClients} />
                    </section>
                </div>
            </div>
        </main>
    );
};

export default CurrentProfileUser;