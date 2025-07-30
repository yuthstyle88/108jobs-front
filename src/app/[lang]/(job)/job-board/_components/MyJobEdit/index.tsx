"use client";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import WarningLeaveModal from "@/components/WarningLeaveModal";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { useHttpGet } from "@/hooks/useHttpGet";
import { useHttpPost } from "@/hooks/useHttpPost";
import useNotification from "@/hooks/useNotification";
import { EditPost, JobType } from "@/lib/lemmy-js-client/dist";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const jobSchema = z.object({
    communityId: z.string().min(1, "Service catalog is required"),
    jobTitle: z.string().min(5, "Job title must be at least 5 characters"),
    description: z
        .string()
        .min(20, "Job description must be at least 20 characters"),
    isEnglishRequired: z.boolean(),
    exampleUrl: z
        .string()
        .optional()
        .refine((val) => !val || /^https?:\/\/.+$/.test(val), {
            message: "Example URL must be a valid URL",
        }),
    budget: z
        .string()
        .min(1, "Budget is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Budget must be a positive number",
        }),

    deadline: z.string().optional(),
    isAnonymousPost: z.boolean(),
    workingFrom: z.nativeEnum(JobType),
    intendedUse: z.enum(["Business", "Personal", "Unknown"]),
});
type Props = {
    jobId: string;
};
const MyJobEdit = ({jobId}: Props) => {
    const route = useRouter();

    const {
        data: postData,
        isMutating: isPostLoading,
    } = useHttpGet("getPost", [{id: Number(jobId)}]);

    const {
        data: catalogData,
        isMutating: isCatalogLoading,
    } = useHttpGet("listCommunities");

    const {execute: editJob, isMutating} = useHttpPost("editPost");

    const {successMessage, errorMessage} = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: createJobLanguage,
        isLoading: isLanguageLoading,
        error: languageError,
    } = useGlobalTranslate(LanguageFile.JOB_BOARD_CREATE);

    const {
        register,
        handleSubmit,
        formState: {errors, isDirty},
        setValue,
        watch,
        reset,
    } = useForm({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            communityId: "1",
            jobTitle: "",
            description: "",
            isEnglishRequired: false,
            exampleUrl: "",
            budget: "",
            deadline: "",
            isAnonymousPost: false,
            workingFrom: JobType.Freelance,
            intendedUse: "Personal",
        },
    });

    useEffect(() => {
        const postView = postData?.postView;
        const post = postView?.post;
        if (postView && post) {
            reset({
                communityId: postView.community?.id?.toString() ?? "",
                jobTitle: post.name ?? "",
                description: post.body ?? "",
                isEnglishRequired: post.isEnglishRequired ?? false,
                exampleUrl: post.url ?? "",
                budget: post.budget?.toString() ?? "",
                deadline: post.deadline?.split("T")[0] ?? "",
                isAnonymousPost: false,
                workingFrom: post.jobType ?? JobType.Freelance,
                intendedUse: post.intendedUse ?? "",
            });
        }
    }, [postData, reset]);

    const handleBackClick = () => {
        if (isDirty) {
            setIsModalOpen(true);
        } else {
            route.back();
        }
    };

    const handleConfirmLeave = () => {
        setIsModalOpen(false);
        route.back();
    };

    const onSubmit = useCallback(async (data: any) => {
        try {
            const budgetNumber = Math.floor(Number(data.budget) * 10) / 10;

            let formattedDeadline: string | undefined;
            if (data.deadline) {
                const deadlineDate = new Date(data.deadline);
                deadlineDate.setUTCHours(23, 59, 59, 0);
                formattedDeadline = deadlineDate.toISOString();
            }

            const payload: EditPost = {
                postId: Number(jobId),
                name: data.jobTitle,
                body: data.description,
                jobType: data.workingFrom,
                communityId: Number(data.communityId),
                deadline: formattedDeadline,
                isEnglishRequired: data.isEnglishRequired || false,
                url: data.exampleUrl || "",
                intendedUse: data.intendedUse,
                budget: budgetNumber,
            };

            if (!payload.deadline) {
                delete (payload as { deadline?: typeof payload.deadline }).deadline;
            }

            if (!payload.url) {
                delete (payload as { url?: typeof payload.url }).url;
            }

            await editJob(payload);
            successMessage(null, null, "Edit successfully!");
        } catch (error) {
            errorMessage(null, null, "Edit failed!");
        }
    }, [editJob, jobId, successMessage, errorMessage]);

    if (isLanguageLoading || isCatalogLoading || isPostLoading) return <Loading/>;
    if (languageError) return <Error/>;

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all duration-300">
                    <h1 className="text-4xl font-bold text-gray-900 mb-10 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Edit Job Post
                    </h1>
                    {isMutating ? (
                        <div className="w-full flex justify-center items-center py-12">
                            <LoadingMultiCircle />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Job Title */}
                            <div className="space-y-3">
                                <label
                                    htmlFor="jobTitle"
                                    className="block text-lg font-medium text-gray-800"
                                >
                                    {createJobLanguage?.jobTitleLabel}
                                </label>
                                <input
                                    id="jobTitle"
                                    {...register("jobTitle")}
                                    placeholder={createJobLanguage?.jobTitlePlaceholder}
                                    className={`w-full p-4 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                        errors.jobTitle
                                            ? "border-red-200 focus:ring-red-400"
                                            : "border-gray-200 focus:ring-blue-500"
                                    }`}
                                />
                                {errors.jobTitle && (
                                    <p className="text-red-500 text-sm flex items-center mt-2">
                                        <FontAwesomeIcon
                                            icon={faExclamationCircle}
                                            className="mr-2"
                                        />
                                        {errors.jobTitle.message}
                                    </p>
                                )}
                            </div>

                            {/* Working From */}
                            <div className="space-y-3">
                                <label className="block text-lg font-medium text-gray-800">
                                    {createJobLanguage?.employmentTypeLabel}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { id: "freelance", value: JobType.Freelance, label: createJobLanguage?.employmentTypeFreelance },
                                        { id: "contract", value: JobType.Contract, label: createJobLanguage?.employmentTypeContract },
                                        { id: "parttime", value: JobType.PartTime, label: createJobLanguage?.employmentTypePartTime },
                                        { id: "fulltime", value: JobType.FullTime, label: createJobLanguage?.employmentTypeFullTime },
                                    ].map((option) => (
                                        <div
                                            key={option.id}
                                            className={`flex items-center p-4 border rounded-xl transition-all duration-200 cursor-pointer ${
                                                watch("workingFrom") === option.value
                                                    ? "bg-blue-50 border-blue-300"
                                                    : "bg-white border-gray-200 hover:bg-gray-50"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                id={option.id}
                                                value={option.value}
                                                {...register("workingFrom")}
                                                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor={option.id} className="ml-3 text-gray-700 font-medium">
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="space-y-3">
                                <label
                                    htmlFor="description"
                                    className="block text-lg font-medium text-gray-800"
                                >
                                    {createJobLanguage?.jobDescriptionLabel}
                                </label>
                                <p className="text-gray-500 text-sm">
                                    {createJobLanguage?.jobDescriptionNotice}
                                </p>
                                <textarea
                                    id="description"
                                    {...register("description")}
                                    placeholder={createJobLanguage?.jobDescriptionDetails}
                                    className={`w-full p-4 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 min-h-[180px] transition-all duration-200 ${
                                        errors.description
                                            ? "border-red-200 focus:ring-red-400"
                                            : "border-gray-200 focus:ring-blue-500"
                                    }`}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm flex items-center mt-2">
                                        <FontAwesomeIcon
                                            icon={faExclamationCircle}
                                            className="mr-2"
                                        />
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            {/* English Required Checkbox */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="isEnglishRequired"
                                    {...register("isEnglishRequired")}
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
                                />
                                <label
                                    htmlFor="isEnglishRequired"
                                    className="text-gray-700 font-medium"
                                >
                                    {createJobLanguage?.englishSpeakerLabel}
                                </label>
                            </div>

                            {/* Example URL and Service Catalog */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label
                                        htmlFor="exampleUrl"
                                        className="block text-lg font-medium text-gray-800"
                                    >
                                        {createJobLanguage?.exampleUrl}
                                    </label>
                                    <input
                                        id="exampleUrl"
                                        {...register("exampleUrl")}
                                        placeholder={createJobLanguage?.serviceCategoryPlaceholderUrl}
                                        className={`w-full p-4 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                            errors.exampleUrl
                                                ? "border-red-200 focus:ring-red-400"
                                                : "border-gray-200 focus:ring-blue-500"
                                        }`}
                                    />
                                    {errors.exampleUrl && (
                                        <p className="text-red-500 text-sm flex items-center mt-2">
                                            <FontAwesomeIcon
                                                icon={faExclamationCircle}
                                                className="mr-2"
                                            />
                                            {errors.exampleUrl.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label
                                        htmlFor="serviceCatalogId"
                                        className="block text-lg font-medium text-gray-800"
                                    >
                                        {createJobLanguage?.serviceCategoryLabel}
                                    </label>
                                    <select
                                        id="communityId"
                                        {...register("communityId")}
                                        className={`w-full p-4 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                            errors.communityId
                                                ? "border-red-200 focus:ring-red-400"
                                                : "border-gray-200 focus:ring-blue-500"
                                        }`}
                                    >
                                        <option disabled value="">
                                            {createJobLanguage?.serviceCategoryPlaceholderSelect}
                                        </option>
                                        {catalogData?.communities
                                            ?.filter((catalog) => catalog.community.name !== "popular-service")
                                            .map((catalog) => (
                                                <option key={catalog.community.id} value={catalog.community.id}>
                                                    {catalog.community.name}
                                                </option>
                                            ))}
                                    </select>
                                    {errors.communityId && (
                                        <p className="text-red-500 text-sm flex items-center mt-2">
                                            <FontAwesomeIcon
                                                icon={faExclamationCircle}
                                                className="mr-2"
                                            />
                                            {errors.communityId.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Budget and Deadline */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label
                                        htmlFor="budget"
                                        className="block text-lg font-medium text-gray-800"
                                    >
                                        {createJobLanguage?.budgetLabel}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="budget"
                                            {...register("budget")}
                                            placeholder="0"
                                            className={`w-full p-4 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                                errors.budget
                                                    ? "border-red-200 focus:ring-red-400"
                                                    : "border-gray-200 focus:ring-blue-500"
                                            }`}
                                        />
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                            THB
                                        </div>
                                    </div>
                                    {errors.budget && (
                                        <p className="text-red-500 text-sm flex items-center mt-2">
                                            <FontAwesomeIcon
                                                icon={faExclamationCircle}
                                                className="mr-2"
                                            />
                                            {errors.budget.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label
                                        htmlFor="deadline"
                                        className="block text-lg font-medium text-gray-800"
                                    >
                                        {createJobLanguage?.deadlineLabel}
                                    </label>
                                    <input
                                        type="date"
                                        id="deadline"
                                        min={new Date().toISOString().split("T")[0]}
                                        {...register("deadline")}
                                        className="w-full p-4 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Intended Use */}
                            <div className="space-y-3">
                                <label className="block text-lg font-medium text-gray-800">
                                    {createJobLanguage?.intendedUseLabel}
                                </label>
                                <p className="text-gray-500 text-sm">
                                    {createJobLanguage?.intendedUseNotice}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-xl">
                                    {[
                                        {
                                            value: "Business" as const,
                                            icon: (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-8 w-8"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                    />
                                                </svg>
                                            ),
                                            label: createJobLanguage?.intendedUseBusiness,
                                        },
                                        {
                                            value: "Personal" as const,
                                            icon: (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-8 w-8"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                            ),
                                            label: createJobLanguage?.intendedUsePersonal,
                                        },
                                        {
                                            value: "Unknown" as const,
                                            icon: (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-8 w-8"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            ),
                                            label: createJobLanguage?.intendedUseUnknown,
                                        },
                                    ].map((option) => (
                                        <div
                                            key={option.value}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                                watch("intendedUse") === option.value
                                                    ? "bg-blue-100 border border-blue-300"
                                                    : "bg-white border border-gray-200 hover:bg-blue-50"
                                            }`}
                                            onClick={() => setValue("intendedUse", option.value)}
                                        >
                                            <div className="text-blue-600 mb-2">{option.icon}</div>
                                            <span className="text-gray-700 font-medium">
                                        {option.label}
                                    </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-4 pt-6">
                                <button
                                    type="button"
                                    onClick={handleBackClick}
                                    className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
                                >
                                    {createJobLanguage?.previewButton}
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
                                    disabled={isMutating}
                                >
                                    {createJobLanguage?.submitButton}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            <WarningLeaveModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                handleConfirmChange={handleConfirmLeave}
            />
        </div>
    );
};

export default MyJobEdit;
