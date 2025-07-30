"use client";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import WarningLeaveModal from "@/components/WarningLeaveModal";
import { LanguageFile } from "@/constants/language";
import useNotification from "@/hooks/useNotification";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useHttpGet} from "@/hooks/useHttpGet";
import {EditPost, JobType} from "@/lib/lemmy-js-client/dist";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import {useHttpPut} from "@/hooks/useHttpPut";
import {router} from "next/client";

const jobSchema = z.object({
    serviceCatalogId: z.string().min(1, "Service catalog is required"),
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
        state,
        data: postData,
        isMutating: isPostLoading,
    } = useHttpGet("getPost", [{id: Number(jobId)}]);

    const {
        state: catalogState,
        data: catalogData,
        isMutating: isCatalogLoading,
    } = useHttpGet("listCommunities");

    const { execute: editJob, isMutating } = useHttpPut("editPost");

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
            serviceCatalogId: "1",
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
        if (postView && post && post.jobType ) {
            reset({
                serviceCatalogId: postView.community?.id?.toString() ?? "",
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

    const handleEditSuccess = useCallback(() => {
        router.replace("/job-board");
    }, [router]);

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
                communityId: data.communityId,
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
            successMessage(null, null, "Edit successful!");
            handleEditSuccess();
        } catch (error) {
            console.error("Error editing job: ", error);
            errorMessage(null, null, "Edit failed!");
        }
    }, [editJob, jobId, handleEditSuccess, successMessage, errorMessage]);

    if (isLanguageLoading || isCatalogLoading) return <Loading/>;
    if (languageError) return <Error/>;

    return (
        <div className="bg-[#F6F9FE] min-h-screen py-8">
            <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-100 transition-all">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-8">
                        Edit Job Post:
                    </h1>
                    {/*{isLoading ? (*/}
                    {/*    <div className="w-full flex justify-center items-center">*/}
                    {/*        <LoadingMultiCircle/>*/}
                    {/*    </div>*/}
                    {/*) : (*/}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Job Title */}
                        <div className="mb-6">
                            <label
                                htmlFor="jobTitle"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                {createJobLanguage?.jobTitleLabel}
                            </label>
                            <input
                                id="jobTitle"
                                {...register("jobTitle")}
                                placeholder={createJobLanguage?.jobTitlePlaceholder}
                                className={`w-full text-text-primary placeholder:text-text-secondary placeholder:font-sans p-3 border rounded-lg focus:outline-none focus:ring-1 ${
                                    errors.jobTitle
                                        ? "border-red-200 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />

                            {errors.jobTitle && (
                                <p className="mt-1 text-red-500 text-sm flex items-center">
                                    <FontAwesomeIcon
                                        icon={faExclamationCircle}
                                        className="mr-1"
                                    />
                                    {errors.jobTitle.message}
                                </p>
                            )}
                        </div>

                        {/* Working From */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                {createJobLanguage?.employmentTypeLabel}
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                                    <input
                                        type="radio"
                                        id="freelance"
                                        value={JobType.Freelance}
                                        {...register("workingFrom")}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <label htmlFor="freelance" className="ml-2 text-gray-700">
                                        {createJobLanguage?.employmentTypeFreelance}
                                    </label>
                                </div>

                                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                                    <input
                                        type="radio"
                                        id="contract"
                                        value="Contract"
                                        {...register("workingFrom")}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <label htmlFor="contract" className="ml-2 text-gray-700">
                                        {createJobLanguage?.employmentTypeContract}
                                    </label>
                                </div>

                                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                                    <input
                                        type="radio"
                                        id="parttime"
                                        value="Parttime"
                                        {...register("workingFrom")}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <label htmlFor="parttime" className="ml-2 text-gray-700">
                                        {createJobLanguage?.employmentTypePartTime}
                                    </label>
                                </div>

                                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                                    <input
                                        type="radio"
                                        id="fulltime"
                                        value="Fulltime"
                                        {...register("workingFrom")}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <label htmlFor="fulltime" className="ml-2 text-gray-700">
                                        {createJobLanguage?.employmentTypeFullTime}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="mb-6">
                            <label
                                htmlFor="description"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                {createJobLanguage?.jobDescriptionLabel}
                            </label>
                            <p className="text-gray-500 text-sm mb-2">
                                {createJobLanguage?.jobDescriptionNotice}
                            </p>
                            <textarea
                                id="description"
                                {...register("description")}
                                placeholder={createJobLanguage?.jobDescriptionDetails}
                                className={`text-text-primary placeholder:text-text-secondary placeholder:font-sans w-full p-3 border rounded-lg focus:outline-none focus:ring-1 min-h-[200px] ${
                                    errors.description
                                        ? "border-red-200 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                            />

                            {errors.description && (
                                <p className="mt-1 text-red-500 text-sm flex items-center">
                                    <FontAwesomeIcon
                                        icon={faExclamationCircle}
                                        className="mr-1"
                                    />
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* English Required Checkbox */}
                        <div className="mb-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isEnglishRequired"
                                    {...register("isEnglishRequired")}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <label
                                    htmlFor="isEnglishRequired"
                                    className="ml-2 text-gray-700"
                                >
                                    {createJobLanguage?.englishSpeakerLabel}
                                </label>
                            </div>
                        </div>

                        {/* Example URL and Service Catalog */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label
                                    htmlFor="exampleUrl"
                                    className="block text-gray-700 font-medium mb-2"
                                >
                                    {createJobLanguage?.exampleUrl}
                                </label>
                                <input
                                    id="exampleUrl"
                                    {...register("exampleUrl")}
                                    placeholder={
                                        createJobLanguage?.serviceCategoryPlaceholderUrl
                                    }
                                    className={`text-text-primary placeholder:text-text-secondary placeholder:font-sans w-full p-3 border rounded-lg focus:outline-none focus:ring-1 ${
                                        errors.exampleUrl
                                            ? "border-red-200 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                />

                                {errors.exampleUrl && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <FontAwesomeIcon
                                            icon={faExclamationCircle}
                                            className="mr-1"
                                        />
                                        {errors.exampleUrl.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="serviceCatalogId"
                                    className="block text-gray-700 font-medium mb-2"
                                >
                                    {createJobLanguage?.serviceCategoryLabel}
                                </label>
                                <select
                                    id="serviceCatalogId"
                                    {...register("serviceCatalogId")}
                                    className={`text-text-primary placeholder:text-text-secondary placeholder:font-sans w-full p-3 border rounded-lg focus:outline-none focus:ring-1 ${
                                        errors.serviceCatalogId
                                            ? "border-red-200 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-blue-500"
                                    }`}
                                >
                                    <option disabled value="">
                                        {createJobLanguage?.serviceCategoryPlaceholderSelect}
                                    </option>
                                    {catalogData?.communities
                                        .map((catalog) => (
                                            <option key={catalog.community.id.toString()} value={catalog.community.id}>
                                                {catalog.community.name}
                                            </option>
                                        ))}
                                </select>

                                {errors.serviceCatalogId && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <FontAwesomeIcon
                                            icon={faExclamationCircle}
                                            className="mr-1"
                                        />
                                        {errors.serviceCatalogId.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Budget and Deadline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label
                                    htmlFor="budget"
                                    className="block text-gray-700 font-medium mb-2"
                                >
                                    {createJobLanguage?.budgetLabel}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="budget"
                                        {...register("budget")}
                                        placeholder="0"
                                        className={`text-text-primary placeholder:text-text-secondary placeholder:font-sans w-full p-3 border rounded-lg focus:outline-none focus:ring-1 ${
                                            errors.budget
                                                ? "border-red-200 focus:ring-red-500"
                                                : "border-gray-300 focus:ring-blue-500"
                                        }`}
                                    />

                                    <div
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        THB
                                    </div>
                                </div>
                                {errors.budget && (
                                    <p className="mt-1 text-red-500 text-sm flex items-center">
                                        <FontAwesomeIcon
                                            icon={faExclamationCircle}
                                            className="mr-1"
                                        />
                                        {errors.budget.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="deadline"
                                    className="block text-gray-700 font-medium mb-2"
                                >
                                    {createJobLanguage?.deadlineLabel}
                                </label>
                                <input
                                    type="date"
                                    id="deadline"
                                    min={new Date().toISOString().split("T")[0]}
                                    {...register("deadline")}
                                    className="text-text-primary placeholder:text-text-secondary placeholder:font-sans w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Intended Use */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                {createJobLanguage?.intendedUseLabel}
                            </label>
                            <p className="text-gray-500 text-sm mb-2">
                                {createJobLanguage?.intendedUseNotice}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${
                                        watch("intendedUse") === "Business"
                                            ? "bg-blue-100 border border-blue-300"
                                            : "bg-white hover:bg-blue-50 border border-gray-200 shadow-sm"
                                    }`}
                                    onClick={() => setValue("intendedUse", "Business")}
                                >
                                    <div className="text-blue-600 mb-2">
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
                                    </div>
                                    <span className="text-gray-700">
                      {createJobLanguage?.intendedUseBusiness}
                    </span>
                                </div>

                                <div
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${
                                        watch("intendedUse") === "Personal"
                                            ? "bg-blue-100 border border-blue-300"
                                            : "bg-white border border-gray-200"
                                    }`}
                                    onClick={() => setValue("intendedUse", "Personal")}
                                >
                                    <div className="text-blue-600 mb-2">
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
                                    </div>
                                    <span className="text-gray-700">
                      {createJobLanguage?.intendedUsePersonal}
                    </span>
                                </div>

                                <div
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${
                                        watch("intendedUse") === "Unknown"
                                            ? "bg-blue-100 border border-blue-300"
                                            : "bg-white border border-gray-200"
                                    }`}
                                    onClick={() => setValue("intendedUse", "Unknown")}
                                >
                                    <div className="text-blue-600 mb-2">
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
                                    </div>
                                    <span className="text-gray-700">
                      {createJobLanguage?.intendedUseUnknown}
                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Anonymous Post */}
                        <div className="mb-6 flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    {...register("isAnonymousPost")}
                                />
                                <div
                                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-gray-700">
                    {createJobLanguage?.anonymousPostLabel}
                  </span>
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-4 mt-10">
                            <button
                                type="button"
                                onClick={handleBackClick}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                            >
                                {createJobLanguage?.previewButton}
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
                                //   disabled={isMutating}
                            >
                                {/* {isMutating ? (
                    <LoadingCircle />
                  ) : (
                    createJobLanguage?.submitButton
                  )} */}
                                {createJobLanguage?.submitButton}
                            </button>
                        </div>
                    </form>
                    {/*)}*/}
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
