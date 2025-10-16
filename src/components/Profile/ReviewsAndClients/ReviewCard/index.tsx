import Image from "next/image";
import { formatDateToLong } from "@/utils";
import { ProfileImage } from "@/constants/images";
import React from "react";

interface Review {
    id: number;
    reviewerName: string;
    reviewerAvatar: string;
    rating: number;
    createdAt: string;
    comment: string;
}

interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-start">
                <Image
                    src={review.reviewerAvatar || ProfileImage.avatar}
                    alt={review.reviewerName || "Reviewer avatar"}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-medium text-gray-800">{review.reviewerName}</h4>
                            <span className="text-sm text-gray-500">{formatDateToLong(review.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 font-medium text-gray-800">{review.rating}</span>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;