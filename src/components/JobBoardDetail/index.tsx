"use client";

import ConfirmVerifyFreelancer from "@/app/[lang]/(job)/job-board/_components/ConfirmVerifyFreelancer";
import JobBoardTab from "@/app/[lang]/(job)/job-board/_components/JobBoardTab";
import {LandingImage, ProfileImage} from "@/constants/images";
import {PostId} from "lemmy-js-client";
import {formatDateToLong} from "@/utils/formatDateToLong";
import {MoveRight} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import InfoMessage from "../InfoMessage";
import {Badge} from "../ui/Badge";
import {Button} from "../ui/Button";
import JobBoardProposal from "./components/JobBoardProposal";
import {useRouter} from "next/navigation";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import {UserService} from "@/services";
import {useHttpGet} from "@/hooks/useHttpGet";
import {useTranslation} from "react-i18next";

type Props = {
    jobId: PostId;
};

const JobBoardDetail = ({jobId}: Props) => {
    const {t} = useTranslation();
    const isLoggedIn = UserService.Instance.isLoggedIn;
    const isGuest = !isLoggedIn;
    const shouldFetchProfile = isLoggedIn;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const route = useRouter();
    const {
        data: jobDetailData,
    } = useHttpGet("getPost", {id: jobId})

    const {person} = useMyUser();

    const isVerify = person?.isVerified;
    // Single-user mode: any logged-in user can submit proposals
    const canShowProposalButton = !isGuest;

    const calculateDaysUntil = (dateString: string) => {
        const targetDate = new Date(dateString);
        const today = new Date();
        targetDate.setHours(0,
            0,
            0,
            0);
        today.setHours(0,
            0,
            0,
            0);
        const diffTime = targetDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleConfirmLeave = () => {
        setIsModalOpen(false);
        route.push("/seller/my-service");
    };

    const handleProposalClick = () => {
        if (isVerify === 'Pending') {
            setIsModalOpen(true);
            return;
        }
        route.push(`${jobId}/proposal`);
    };

    return (
        <>
            <section className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-lg pb-24">
                <div className="border-b mb-6">
                    <JobBoardTab/>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                                    Open
                                </Badge>
                                <Badge variant="outline" className="text-xs px-2 py-1">
                                    {jobDetailData?.communityView.community.name}
                                </Badge>
                                {jobDetailData?.postView.post.isEnglishRequired && (
                                    <Badge variant="outline" className="text-xs px-2 py-1">
                                        English Required
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-xl font-bold text-blue-600 mb-4 break-words whitespace-pre-wrap">
                                {jobDetailData?.postView.post.name}
                            </h1>
                            <div className="flex items-center text-gray-600 mb-4">
                                <Image
                                    src={
                                        jobDetailData?.postView.creator.avatar || ProfileImage.avatar
                                    }
                                    alt="avatar"
                                    className="w-8 h-8 rounded-full mr-2"
                                    width={500}
                                    height={500}
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIgZmlsbD0iIzZCNzI4MCIvPgo8cGF0aCBkPSJtNCA0IDUgNWgtMTBhMTEuOTYzIDExLjk2MyAwIDAgMCA0LjUxNCA5LjY1OGM0LjczMiA5Ljc1NCA5LjUyNiA5LjI1OCAxMi0yLjMzNGMzLjMzNCA0LjM0NiA2IDYuNjY2IDEwIDEwaCIvPgo8L3N2Zz4K";
                                    }}
                                />
                                <span className="font-medium">
                                    {jobDetailData?.postView.creator.displayName || "Anonymous"}
                                </span>
                                <span className="text-sm ml-2">
                                    (@{jobDetailData?.postView.creator.name})
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 mb-4">
                <span>
                  Posted:{" "}
                    {formatDateToLong(jobDetailData?.postView.post.publishedAt)}
                </span>
                                {jobDetailData?.postView.post.updatedAt !==
                                    jobDetailData?.postView.post.publishedAt && (
                                        <span className="ml-4">
                    Updated:{" "}
                                            {formatDateToLong(jobDetailData?.postView.post.updatedAt)}
                  </span>
                                    )}
                            </div>
                        </div>

                        <div className="bg-white">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {t("jobBoardDetail.jobDetail")}
                            </h3>
                            <div className="break-words whitespace-pre-wrap space-y-2 text-gray-700">
                                <p>{jobDetailData?.postView.post.body}</p>
                                {jobDetailData?.postView.post.url && (
                                    <div className="mt-4">
                                        <span className="font-medium">Reference URL: </span>
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

                            <div className="mt-6 pt-6 border-t">
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    Additional Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Intended Use:</span>
                                        <span className="ml-2 font-medium text-text-primary">
                      {jobDetailData?.postView.post.intendedUse}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 h-fit flex flex-col p-6 rounded-lg text-text-primary">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Project Information
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Deadline</span>
                                {jobDetailData?.postView.post.deadline ? (
                                    <span className="font-medium">
                    {formatDateToLong(jobDetailData?.postView.post.deadline)}
                                        {calculateDaysUntil(
                                            jobDetailData?.postView.post?.deadline || "2"
                                        ) > 0 ? (
                                            <span className="text-green-600 ml-1">
                        (
                                                {calculateDaysUntil(
                                                    jobDetailData?.postView.post?.deadline || "2"
                                                )}{" "}
                                                days left)
                      </span>
                                        ) : (
                                            <span className="text-red-600 ml-1">(Expired)</span>
                                        )}
                  </span>
                                ) : (
                                    <span className="font-medium">--</span>
                                )}
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Budget</span>
                                <span className="font-medium">
                  {Number(jobDetailData?.postView.post.budget).toFixed()} BATH
                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Work Type</span>
                                <span className="font-medium">
                  {jobDetailData?.postView.post.jobType}
                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Category</span>
                                <span className="font-medium">
                  {jobDetailData?.communityView.community.name}
                </span>
                            </div>
                            {jobDetailData?.postView.post.isEnglishRequired && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Special Requirements</span>
                                    <span className="font-medium text-blue-600">English</span>
                                </div>
                            )}
                            {canShowProposalButton && (
                                <Button
                                    variant="default"
                                    className="w-full mt-4"
                                    onClick={handleProposalClick}
                                >
                                    Submit Proposal
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-[1.125rem] text-third tracking-wider mb-3">
                        Interested Freelancers for mobile game character design (0
                        proposals)
                    </h4>
                    <InfoMessage
                        message="We recommend communicating and paying through Fastjob - guaranteed no scams! We protect your payment until you receive work from the freelancer"/>
                </div>
                <JobBoardProposal/>
            </section>

            <section
                className="grid-cols-1 grid md:grid-cols-2 gap-8 w-full lg:max-w-7xl mx-auto py-6 rounded-lg pb-24">
                <Link prefetch={false} href={"/job-board"}>
                    <section
                        className="w-full  job-board-gradient-left rounded-lg shadow-job-board-shadow h-[100px] md:h-[130px] xl:h-[100px] cursor-pointer inline-block">
                        <div className="grid grid-cols-[100px_1fr_32px] gap-2">
                            <div className="w-[100px] h-[100px] relative">
                                <Image
                                    src={LandingImage.error}
                                    alt="banner apply"
                                    width={500}
                                    height={500}
                                    className="w-full h-full absolute top-0 left-0 right-0 bottom-0"
                                />
                            </div>
                            <div className="flex flex-col gap-1 self-center">
                                <p className="text-base text-third font-semibold">
                                    Want to get find freelancer on Fastlance, find for excellent
                                    freelancer now!
                                </p>
                                <p className="text-[0.875rem] text-text-secondary">
                                    Generate income through job boards and platforms
                                </p>
                            </div>
                            <div className="h-full flex justify-center items-center mr-4">
                                <MoveRight className="text-third w-[20px] h-[22px]"/>
                            </div>
                        </div>
                    </section>
                </Link>
                <Link prefetch={false} href={"/start-selling"}>
                    <section
                        className="w-full  job-board-gradient rounded-lg shadow-job-board-shadow h-[100px] md:h-[130px] xl:h-[100px] cursor-pointer inline-block">
                        <div className="grid grid-cols-[100px_1fr_32px] gap-2">
                            <div className="w-[100px] h-[100px] relative">
                                <Image
                                    src={ProfileImage.bannerApply}
                                    alt="banner apply"
                                    width={500}
                                    height={500}
                                    className="w-full h-full absolute top-0 left-0 right-0 bottom-0"
                                />
                            </div>
                            <div className="flex flex-col gap-1 self-center">
                                <p className="text-base text-third font-semibold">
                                    Want to get work through Fastlance, Register as a freelancer
                                    now!
                                </p>
                                <p className="text-[0.875rem] text-text-secondary">
                                    Generate income through job boards and platforms
                                </p>
                            </div>
                            <div className="h-full flex justify-center items-center mr-4">
                                <MoveRight className="text-third w-[20px] h-[22px]"/>
                            </div>
                        </div>
                    </section>
                </Link>
                <ConfirmVerifyFreelancer
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    handleConfirmChange={handleConfirmLeave}
                />
            </section>
        </>
    );
};

export default JobBoardDetail;
