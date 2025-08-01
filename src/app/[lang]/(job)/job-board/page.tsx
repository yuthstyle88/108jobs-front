"use client";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import {ProfileImage} from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState, useEffect} from "react";
import {PostSortType, JobType, GetPosts, IntendedUse} from "lemmy-js-client";
import {useHttpGet} from "@/hooks/useHttpGet";
import JobBoardTab from "@/app/[lang]/(job)/job-board/_components/JobBoardTab";
import {useTranslation} from "react-i18next";

const JobBoard = () => {
    const {t} = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);
    const [cursorHistory, setCursorHistory] = useState<string[]>([]);
    const [sort, setSort] = useState<PostSortType | undefined>(undefined);
    const [budgetMin, setBudgetMin] = useState<number | undefined>(undefined);
    const [budgetMax, setBudgetMax] = useState<number | undefined>(undefined);
    const [jobType, setJobType] = useState<JobType | undefined>(undefined);
    const [intendedUse, setIntendedUse] = useState<IntendedUse | undefined>(undefined);

    const router = useRouter();
    const {state, data: catalogData, isMutating: isCatalogLoading} = useHttpGet("listChildrenCommunities", {
        maxDepth: 3,
    });

    const {
        data: jobPostsPagination,
        isMutating: isJobsLoading,
    } = useHttpGet("getPosts", {
        catalogId: selectedCategory || undefined,
        pageCursor: currentCursor,
        sort,
        budgetMin,
        budgetMax,
        jobType,
        intendedUse,
        limit: 5,
    } as GetPosts);

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === "-") return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("th-TH-u-ca-gregory", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Handle pagination
    const handleNextPage = () => {
        if (jobPostsPagination?.nextPage) {
            setCursorHistory((prev) => [...prev, currentCursor || ""]);
            setCurrentCursor(jobPostsPagination.nextPage);
        }
    };

    const handlePrevPage = () => {
        if (cursorHistory.length > 0) {
            const prevCursor = cursorHistory[cursorHistory.length - 1];
            setCursorHistory((prev) => prev.slice(0, -1));
            setCurrentCursor(prevCursor || undefined);
        }
    };

    useEffect(() => {
        setCurrentCursor(undefined);
        setCursorHistory([]);
    }, [selectedCategory, sort, budgetMin, budgetMax, jobType, intendedUse]);

    const hasPreviousPage = cursorHistory.length > 0;
    const hasNextPage = !!jobPostsPagination?.nextPage;

    return (
        <div className="bg-[#F6F9FE] min-h-screen">
            <div className="max-w-[1283px] mx-auto py-8 px-4 md:px-6 lg:px-8 rounded-lg shadow-sm">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-blue-600 mb-1">
                        {t("profileJob.sectionJobBoard")}
                    </h2>
                    <p className="text-gray-600">{t("profileJob.subtitleJobBoard")}</p>
                </div>

                <div className="border-1 border-borderPrimary bg-white p-4 rounded-lg">
                    <div className="border-b mb-6">
                        <JobBoardTab/>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            {/* Category Filter */}
                            <div className="w-full sm:w-48">
                                <div className="relative">
                                    <select
                                        className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">{t("profileJob.dropdownSearchCategory")}</option>
                                        {catalogData?.communities.map((category) => (
                                            <option key={category.community.id} value={category.community.id}>
                                                {category.community.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Job Type Filter */}
                            <div className="w-full sm:w-48">
                                <div className="relative">
                                    <select
                                        className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                        value={jobType || ""}
                                        onChange={(e) => setJobType(e.target.value as JobType || undefined)}
                                    >
                                        <option value="">All Job Types</option>
                                        <option value={JobType.FullTime}>Full Time</option>
                                        <option value={JobType.PartTime}>Part Time</option>
                                        <option value={JobType.Contract}>Contract</option>
                                        <option value={JobType.Freelance}>Freelance</option>
                                    </select>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Intended Use Filter */}
                            <div className="w-full sm:w-48">
                                <div className="relative">
                                    <select
                                        className="appearance-none bg-white border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                        value={intendedUse || ""}
                                        onChange={(e) => setIntendedUse(e.target.value as IntendedUse || undefined)}
                                    >
                                        <option value="">All Intended Uses</option>
                                        <option value={IntendedUse.Personal}>Personal</option>
                                        <option value={IntendedUse.Business}>Business</option>
                                        <option value={IntendedUse.Unknown}>Unknown</option>
                                    </select>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Budget Filters */}
                            <div className="w-full sm:w-32">
                                <input
                                    type="number"
                                    placeholder="Min Budget"
                                    value={budgetMin || ""}
                                    onChange={(e) => setBudgetMin(e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700"
                                />
                            </div>
                            <div className="w-full sm:w-32">
                                <input
                                    type="number"
                                    placeholder="Max Budget"
                                    value={budgetMax || ""}
                                    onChange={(e) => setBudgetMax(e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Link
                                prefetch={false}
                                href="/job-board/create-job"
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                {t("profileJob.buttonPostJob")} (0/3)
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto border-1 border-borderPrimary rounded-lg">
                        {isJobsLoading ? (
                            <div className="py-12 text-center">
                                <LoadingMultiCircle/>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderTitle")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderCategory")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderJobType")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderBudget")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                        {t("profileJob.tableHeaderPostDate")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                        {t("profileJob.tableHeaderDeadline")}
                                    </th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {jobPostsPagination?.posts?.length ? (
                                    jobPostsPagination.posts.map((job) => (
                                        <tr
                                            key={job.post.id}
                                            onClick={() => router.push(`/job-board/${job.post.id}`)}
                                            className="hover:bg-gray-50 cursor-pointer"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-start">
                                                    <div className="mr-2 mt-1">
                                                        <svg
                                                            className="h-5 w-5 text-gray-400"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <path
                                                                d="M9 12h6m-3-3v6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            prefetch={false}
                                                            href={`/job-board/${job.post.id}`}
                                                            className="hover:text-blue-600 font-medium text-base text-text-primary font-sans max-w-[300px] line-clamp-1 truncate"
                                                        >
                                                            {job.post.name || job.post.embedTitle || "Untitled"}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                                                {job.community.name || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                                                {job.post.jobType || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 font-medium">
                                                {job.post.budget ? parseFloat(String(job.post.budget)).toLocaleString() : "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-text-primary">
                                                {formatDate(job.post.publishedAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-text-primary">
                                                {job.post.deadline ? formatDate(job.post.deadline) : "-"}
                                            </td>
                                            <td></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="col-span-full text-center text-gray-500 py-4">
                                            No jobs available
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {(hasPreviousPage || hasNextPage) && (
                    <div className="mt-6 flex justify-center gap-4">
                        {hasPreviousPage && (
                            <button
                                onClick={handlePrevPage}
                                className="py-2 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={isJobsLoading}
                            >
                                Previous
                            </button>
                        )}
                        {hasNextPage && (
                            <button
                                onClick={handleNextPage}
                                className="py-2 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={isJobsLoading}
                            >
                                Next
                            </button>
                        )}
                    </div>
                )}

                <div
                    className="mt-12 h-[148px] bg-[#D0E1FB] rounded-lg overflow-hidden flex justify-center items-center">
                    <Image
                        src={ProfileImage.jobBoard}
                        alt="Job Board"
                        className="w-auto h-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default JobBoard;