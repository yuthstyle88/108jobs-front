import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ReviewCard from "@/components/Profile/ReviewsAndClients/ReviewCard";
import ClientCard from "@/components/Profile/ReviewsAndClients/ClientCard";
import {StaticImageData} from "next/image";

interface Review {
    id: number;
    reviewerName: string;
    reviewerAvatar: string | StaticImageData;
    rating: number;
    createdAt: string;
    comment: string;
}

interface Client {
    id: number;
    clientName: string;
    projectTitle: string;
    completionDate: string;
    description: string;
}

interface ReviewsAndClientsProps {
    reviews: Review[];
    clients: Client[];
}

const ReviewsAndClients: React.FC<ReviewsAndClientsProps> = ({ reviews, clients }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<"reviews" | "clients">("reviews");

    return (
        <div className="mt-8">
            <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-6 overflow-x-auto pb-2">
                    <button
                        className={`flex-shrink-0 pb-2 text-sm font-medium transition-colors ${
                            activeTab === "reviews" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("reviews")}
                        aria-current={activeTab === "reviews" ? "page" : undefined}
                    >
                        {t("profile.reviewTab")} ({reviews.length})
                    </button>
                    <button
                        className={`flex-shrink-0 pb-2 text-sm font-medium transition-colors ${
                            activeTab === "clients" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("clients")}
                        aria-current={activeTab === "clients" ? "page" : undefined}
                    >
                        {t("profile.clientTab")} ({clients.length})
                    </button>
                </div>
            </div>
            <div className="space-y-6">
                {activeTab === "reviews" &&
                    reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
                {activeTab === "clients" &&
                    clients.map((client) => <ClientCard key={client.id} client={client} />)}
            </div>
        </div>
    );
};

export default ReviewsAndClients;