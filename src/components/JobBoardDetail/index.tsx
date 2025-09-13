"use client";

import ConfirmVerifyFreelancer from "@/app/[lang]/(job)/job-board/_components/ConfirmVerifyFreelancer";
import JobBoardTab from "@/app/[lang]/(job)/job-board/_components/JobBoardTab";
import { LandingImage, ProfileImage } from "@/constants/images";
import { PostId } from "lemmy-js-client";
import { formatDateToLong } from "@/utils";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import InfoMessage from "../InfoMessage";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import JobBoardProposal from "./components/JobBoardProposal";
import { useRouter } from "next/navigation";
import { useMyUser } from "@/hooks/profile-api/useMyUser";
import { UserService } from "@/services";
import { useHttpGet } from "@/hooks/useHttpGet";
import { useTranslation } from "react-i18next";

type Props = {
    jobId: PostId;
};

const JobBoardDetail = ({ jobId }: Props) => {
    const { t } = useTranslation();
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const isGuest = !isLoggedIn;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const route = useRouter();
    const { data: jobDetailData } = useHttpGet("getPost", { id: jobId });
    const { person } = useMyUser();

    const isVerify = person?.isVerified;
    const canShowProposalButton = !isGuest;

    const calculateDaysUntil = (dateString: string) => {
        const targetDate = new Date(dateString);
        const today = new Date();
        targetDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffTime = targetDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleConfirmLeave = () => {
        setIsModalOpen(false);
        route.push("/seller/my-service");
    };

    const handleProposalClick = () => {
        if (isVerify === "Pending") {
            setIsModalOpen(true);
            return;
        }
        route.push(`${jobId}/proposal`);
    };

    return (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Job Board Tabs */}
            <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
                <JobBoardTab />
            </div>

            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                Open
                            </Badge>
                            <Badge variant="outline" className="text-xs font-medium px-3 py-1 rounded-full border-gray-300">
                                {jobDetailData?.communityView.community.name}
                            </Badge>
                            {jobDetailData?.postView.post.isEnglishRequired && (
                                <Badge variant="outline" className="text-xs font-medium px-3 py-1 rounded-full border-gray-300">
                                    English Required
                                </Badge>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 break-words">
                            {jobDetailData?.postView.post.name}
                        </h1>
                        <div className="flex items-center gap-3 text-gray-600">
                            <Image
                                src={jobDetailData?.postView.creator.avatar || ProfileImage.avatar}
                                alt="avatar"
                                className="w-12 h-12 rounded-full border-2 border-gray-200"
                                width={48}
                                height={48}
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIgZmlsbD0iIzZCNzI4MCIvPgo8cGF0aCBkPSJtNCA0IDUgNWgtMTBhMTEuOTYzIDExLjk2MyAwIDAgMCA0LjUxNCA5LjY1OGM0LjczMiA5Ljc1NCA5LjUyNiA5LjI1OCAxMi0yLjMzNGMzLjMzNCA0LjM0NiA2IDYuNjY2IDEwIDEwaCIvPgo8L3N2Zz4K";
                                }}
                            />
                            <div>
                <span className="font-semibold text-gray-800">
                  {jobDetailData?.postView.creator.displayName || "Anonymous"}
                </span>
                                <span className="text-sm text-gray-500 block">
                  (@{jobDetailData?.postView.creator.name})
                </span>
                            </div>
                        </div>
                    </div>
                    {canShowProposalButton && (
                        <Button
                            variant="default"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                            onClick={handleProposalClick}
                        >
                            Submit Proposal
                        </Button>
                    )}
                </div>
                <div className="text-sm text-gray-500 mt-4 flex flex-wrap gap-4">
                    <span>Posted: {formatDateToLong(jobDetailData?.postView.post.publishedAt)}</span>
                    {jobDetailData?.postView.post.updatedAt !==
                        jobDetailData?.postView.post.publishedAt && (
                            <span>Updated: {formatDateToLong(jobDetailData?.postView.post.updatedAt)}</span>
                        )}
                </div>
            </div>

            {/* Project Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600 font-medium">Deadline:</span>
                        <span className="ml-2 text-gray-800">
              {jobDetailData?.postView.post.deadline ? (
                  <>
                      {formatDateToLong(jobDetailData?.postView.post.deadline)}
                      {calculateDaysUntil(jobDetailData?.postView.post?.deadline || "2") > 0 ? (
                          <span className="text-green-600 ml-1">
                      ({calculateDaysUntil(jobDetailData?.postView.post?.deadline || "2")} days left)
                    </span>
                      ) : (
                          <span className="text-red-600 ml-1">(Expired)</span>
                      )}
                  </>
              ) : (
                  "--"
              )}
            </span>
                    </div>
                    <div>
                        <span className="text-gray-600 font-medium">Budget:</span>
                        <span className="ml-2 text-gray-800">
              {Number(jobDetailData?.postView.post.budget).toFixed()} BATH
            </span>
                    </div>
                    <div>
                        <span className="text-gray-600 font-medium">Work Type:</span>
                        <span className="ml-2 text-gray-800">{jobDetailData?.postView.post.jobType}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 font-medium">Category:</span>
                        <span className="ml-2 text-gray-800">{jobDetailData?.communityView.community.name}</span>
                    </div>
                    {jobDetailData?.postView.post.isEnglishRequired && (
                        <div>
                            <span className="text-gray-600 font-medium">Special Requirements:</span>
                            <span className="ml-2 text-blue-600 font-medium">English</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t("jobBoardDetail.jobDetail")}</h3>
                <div className="space-y-4 text-gray-700">
                    <p className="break-words whitespace-pre-wrap">{jobDetailData?.postView.post.body}</p>
                    {jobDetailData?.postView.post.url && (
                        <div>
                            <span className="font-medium text-gray-600">Reference URL: </span>
                            <a
                                href={jobDetailData?.postView.post.url}
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {jobDetailData?.postView.post.url}
                            </a>
                        </div>
                    )}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h4>
                    <div className="text-sm">
                        <span className="text-gray-600 font-medium">Intended Use:</span>
                        <span className="ml-2 text-gray-800">{jobDetailData?.postView.post.intendedUse}</span>
                    </div>
                </div>
            </div>

            {/* Interested Freelancers */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Interested Freelancers (0 proposals)</h3>
                <InfoMessage
                    message="We recommend communicating and paying through 108jobs - guaranteed no scams! We protect your payment until you receive work from the freelancer"
                    className="bg-blue-50 text-blue-800 p-4 rounded-lg"
                />
                <JobBoardProposal />
            </div>

            {/* Promotional Links */}
            <div className="space-y-4">
                <Link prefetch={false} href={"/job-board"} className="group">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                                <Image
                                    src={LandingImage.error}
                                    alt="banner apply"
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    Find excellent freelancers on Fastlance now!
                                </p>
                                <p className="text-sm text-gray-600">
                                    Generate income through job boards and platforms
                                </p>
                            </div>
                            <MoveRight className="text-blue-600 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
                <Link prefetch={false} href={"/start-selling"} className="group">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                                <Image
                                    src={ProfileImage.bannerApply}
                                    alt="banner apply"
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="text-base font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                    Register as a freelancer on Fastlance now!
                                </p>
                                <p className="text-sm text-gray-600">
                                    Generate income through job boards and platforms
                                </p>
                            </div>
                            <MoveRight className="text-green-600 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            </div>

            <ConfirmVerifyFreelancer
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                handleConfirmChange={handleConfirmLeave}
            />
        </section>
    );
};

export default JobBoardDetail;