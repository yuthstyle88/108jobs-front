import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { UserReviewView } from "lemmy-js-client";

// Define interface for props
interface ReviewCardProps {
    reviewView: UserReviewView;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ reviewView }) => {
    const { t } = useTranslation();
    const { review, reviewer, reviewee, workflow } = reviewView;

    // Function to render star ratings
    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-5 h-5 transition-transform duration-200 transform hover:scale-110 ${
                        i <= rating ? "text-amber-400" : "text-gray-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-label={i <= rating ? t("common.starFilled") : t("common.starEmpty")}
                >
                    <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.357 2.44a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.357-2.44a1 1 0 00-1.175 0l-3.357 2.44c-.784.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.314 9.397c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.97z"
                    />
                </svg>
            );
        }
        return stars;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 max-w-2xl mx-auto w-full">
            {/* Main container with reduced padding for less height */}
            <div className="flex flex-col space-y-4">
                {/* Reviewer Info Section */}
                <section className="flex items-center space-x-4">
                    {reviewer.avatar && (
                        <Image
                            src={reviewer.avatar}
                            alt={`${reviewer.name}'s avatar`}
                            width={48}
                            height={48}
                            className="rounded-full border-2 border-gray-200 shadow-sm"
                        />
                    )}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {reviewer.displayName || reviewer.name}
                        </h3>
                        {reviewer.bio && (
                            <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                                {reviewer.bio}
                            </p>
                        )}
                    </div>
                </section>

                {/* Review Details Section */}
                <section>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                        <span className="text-xs text-gray-700 font-medium">
                            {t("profile.reviewPostedOn")} {new Date(review.createdAt).toLocaleDateString()}
                            {review.updatedAt && (
                                <span className="text-gray-500">
                                    {" "}
                                    ({t("profile.updatedOn")} {new Date(review.updatedAt).toLocaleDateString()})
                                </span>
                            )}
                        </span>
                    </div>
                    {review.comment && (
                        <p className="text-sm text-gray-800 italic bg-gray-100 p-3 rounded-xl leading-relaxed shadow-inner">
                            "{review.comment}"
                        </p>
                    )}
                </section>

                {/* Workflow Details Section */}
                <section className="border-t border-gray-200 pt-4">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                        {t("profile.workflowDetails")}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                        <p>
                            <span className="font-medium">{t("profile.workflowStatus")}:</span>{" "}
                            <span className="text-gray-900">{workflow.status}</span>
                        </p>
                        <p>
                            <span className="font-medium">{t("profile.revisionRequired")}:</span>{" "}
                            <span className="text-gray-900">
                                {workflow.revisionRequired ? t("global.yes") : t("global.no")}
                            </span>
                        </p>
                        <p>
                            <span className="font-medium">{t("profile.revisionCount")}:</span>{" "}
                            <span className="text-gray-900">{workflow.revisionCount}</span>
                        </p>
                        <p>
                            <span className="font-medium">{t("profile.deliverableVersion")}:</span>{" "}
                            <span className="text-gray-900">{workflow.deliverableVersion}</span>
                        </p>
                        {workflow.deliverableSubmittedAt && (
                            <p>
                                <span className="font-medium">{t("profile.deliverableSubmittedAt")}:</span>{" "}
                                <span className="text-gray-900">
                                    {new Date(workflow.deliverableSubmittedAt).toLocaleDateString()}
                                </span>
                            </p>
                        )}
                    </div>
                </section>

                {/* Reviewee Info Section */}
                <section className="border-t border-gray-200 pt-4">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                        {t("profile.reviewee")}
                    </h4>
                    <div className="flex items-center space-x-4">
                        {reviewee.avatar && (
                            <Image
                                src={reviewee.avatar}
                                alt={`${reviewee.name}'s avatar`}
                                width={48}
                                height={48}
                                className="rounded-full border-2 border-gray-200 shadow-sm"
                            />
                        )}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                {reviewee.displayName || reviewee.name}
                            </h3>
                            {reviewee.bio && (
                                <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
                                    {reviewee.bio}
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ReviewCard;