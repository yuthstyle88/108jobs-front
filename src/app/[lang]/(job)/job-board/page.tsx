"use client";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import {ProfileImage} from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState, useEffect, useMemo, useCallback} from "react";
import {PostSortType, JobType, GetPosts, IntendedUse} from "lemmy-js-client";
import {useHttpGet} from "@/hooks/useHttpGet";
import JobBoardTab from "@/app/[lang]/(job)/job-board/_components/JobBoardTab";
import {useTranslation} from "react-i18next";
import {slugToCamelCase} from "@/utils/helpers";

const ITEMS_PER_PAGE = 20;

interface FilterState {
    category: string;
    jobType: JobType | undefined;
    intendedUse: IntendedUse | undefined;
    budgetMin: number | undefined;
    budgetMax: number | undefined;
    sort: PostSortType | undefined;
}

const JobBoard = () => {
    const {t} = useTranslation();
    const router = useRouter();

    const [filters, setFilters] = useState<FilterState>({
        category: "",
        jobType: undefined,
        intendedUse: undefined,
        budgetMin: undefined,
        budgetMax: undefined,
        sort: undefined,
    });
    const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);
    const [cursorHistory, setCursorHistory] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        state: catalogState,
        data: catalogData,
        isMutating: isCatalogLoading
    } = useHttpGet("listChildrenCommunities", {
        maxDepth: 3,
    });

    const {
        data: jobPostsPagination,
        isMutating: isJobsLoading,
    } = useHttpGet("getPosts", {
        catalogId: filters.category || undefined,
        pageCursor: currentCursor,
        sort: filters.sort,
        budgetMin: filters.budgetMin,
        budgetMax: filters.budgetMax,
        jobType: filters.jobType,
        intendedUse: filters.intendedUse,
        limit: ITEMS_PER_PAGE,
    } as GetPosts);

    const hasPreviousPage = useMemo(() => cursorHistory.length > 0, [cursorHistory]);
    const hasNextPage = useMemo(() => !!jobPostsPagination?.nextPage, [jobPostsPagination?.nextPage]);
    const totalJobs = useMemo(() => jobPostsPagination?.posts?.length || 0, [jobPostsPagination?.posts]);

    const formatDate = useCallback((dateString: string) => {
        if (!dateString || dateString === "-") return "-";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("th-TH-u-ca-gregory", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "-";
        }
    }, []);

    const formatBudget = useCallback((budget: string | number | null | undefined) => {
        if (!budget) return "-";
        try {
            const amount = parseFloat(String(budget));
            return isNaN(amount) ? "-" : amount.toLocaleString();
        } catch (error) {
            console.error("Error formatting budget:", error);
            return "-";
        }
    }, []);

    const getJobTypeLabel = useCallback((jobType: string | null | undefined) => {
        if (!jobType) return "-";
        const typeMap: Record<string, string> = {
            [JobType.FullTime]: t("profileJob.tableFullTimeLabel"),
            [JobType.PartTime]: t("profileJob.tablePartTimeLabel"),
            [JobType.Contract]: t("profileJob.tableContractLabel"),
            [JobType.Freelance]: t("profileJob.tableFreelanceLabel"),
        };
        return typeMap[jobType] || jobType;
    }, []);

    const handleFilterChange = useCallback((key: keyof FilterState, value: unknown) => {
        setFilters(prev => ({...prev, [key]: value}));
    }, []);

    const handleNextPage = useCallback(() => {
        if (jobPostsPagination?.nextPage) {
            setCursorHistory(prev => [...prev, currentCursor || ""]);
            setCurrentCursor(jobPostsPagination.nextPage);
        }
    }, [jobPostsPagination?.nextPage, currentCursor]);

    const handlePrevPage = useCallback(() => {
        if (cursorHistory.length > 0) {
            const prevCursor = cursorHistory[cursorHistory.length - 1];
            setCursorHistory(prev => prev.slice(0, -1));
            setCurrentCursor(prevCursor || undefined);
        }
    }, [cursorHistory]);

    const handleJobClick = useCallback((jobId: number) => {
        router.push(`/job-board/${jobId}`);
    }, [router]);

    const handleBudgetInput = useCallback((type: 'min' | 'max', value: string) => {
        const numValue = value ? parseInt(value) : undefined;
        if (numValue !== undefined && numValue < 0) return;

        handleFilterChange(type === 'min' ? 'budgetMin' : 'budgetMax', numValue);
    }, [handleFilterChange]);

    const clearFilters = useCallback(() => {
        setFilters({
            category: "",
            jobType: undefined,
            intendedUse: undefined,
            budgetMin: undefined,
            budgetMax: undefined,
            sort: undefined,
        });
    }, []);

    const hasActiveFilters = useMemo(() => {
        return filters.category || filters.jobType || filters.intendedUse ||
            filters.budgetMin || filters.budgetMax || filters.sort;
    }, [filters]);

    useEffect(() => {
        setCurrentCursor(undefined);
        setCursorHistory([]);
    }, [filters.category, filters.sort, filters.budgetMin, filters.budgetMax, filters.jobType, filters.intendedUse]);

    useEffect(() => {
        setIsLoading(isJobsLoading);
    }, [isJobsLoading]);

    if (catalogState.state === "failed") {
        return (
            <div className="bg-[#F6F9FE] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">{t("global.failedToLoadCategories")}</h2>
                    <p className="text-gray-600">{t("global.tryRefreshingPage")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F6F9FE] min-h-screen">
            <div className="max-w-[1283px] mx-auto py-8 px-4 md:px-6 lg:px-8 rounded-lg shadow-sm">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-blue-600 mb-1">
                        {t("profileJob.sectionJobBoard")}
                    </h1>
                    <p className="text-gray-600">{t("profileJob.subtitleJobBoard")}</p>
                </div>

                <div className="border-1 border-borderPrimary bg-white p-4 rounded-lg">
                    {/* Tab Navigation */}
                    <div className="border-b">
                        <JobBoardTab/>
                    </div>

                    {/* Filters Section */}
                    <div
                        className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-6 sm:p-8 mb-8 space-y-6 md:space-y-0 md:flex md:flex-wrap md:items-end md:justify-between transition-all duration-300">
                        {/* Filters Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                            {/* Category Filter */}
                            <div className="relative group">
                                <label htmlFor="category-filter"
                                       className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-hover:text-blue-600">
                                    {t("profileJob.dropdownSearchCategory")}
                                </label>
                                <select
                                    id="category-filter"
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-blue-300"
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange("category", e.target.value)}
                                    disabled={isCatalogLoading}
                                >
                                    <option value="">{t("profileJob.dropdownSearchCategory")}</option>
                                    {catalogData?.communities?.map((category) => (
                                        <option key={category.community.id} value={category.community.id}>
                                            {t(`catalogs.${slugToCamelCase(category.community.slug)}`)}
                                        </option>
                                    ))}
                                </select>
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 top-7">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Job Type Filter */}
                            <div className="relative group">
                                <label htmlFor="job-type-filter"
                                       className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-hover:text-blue-600">
                                    {t("profileJob.dropdownSearchType")}
                                </label>
                                <select
                                    id="job-type-filter"
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-blue-300"
                                    value={filters.jobType || ""}
                                    onChange={(e) => handleFilterChange("jobType", e.target.value as JobType || undefined)}
                                >
                                    <option value="">{t("profileJob.tableAllJobTypesPlaceholder")}</option>
                                    <option value={JobType.FullTime}>{getJobTypeLabel(JobType.FullTime)}</option>
                                    <option value={JobType.PartTime}>{getJobTypeLabel(JobType.PartTime)}</option>
                                    <option value={JobType.Contract}>{getJobTypeLabel(JobType.Contract)}</option>
                                    <option value={JobType.Freelance}>{getJobTypeLabel(JobType.Freelance)}</option>
                                </select>
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 top-7">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Intended Use Filter */}
                            <div className="relative group">
                                <label htmlFor="intended-use-filter"
                                       className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-hover:text-blue-600">
                                    {t("profileJob.dropdownSearchIntendedUse")}
                                </label>
                                <select
                                    id="intended-use-filter"
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-blue-300"
                                    value={filters.intendedUse || ""}
                                    onChange={(e) => handleFilterChange("intendedUse", e.target.value as IntendedUse || undefined)}
                                >
                                    <option value="">{t("profileJob.tableAllIntendedUsesPlaceholder")}</option>
                                    <option
                                        value={IntendedUse.Personal}>{t("profileJob.tablePersonalSelection")}</option>
                                    <option
                                        value={IntendedUse.Business}>{t("profileJob.tableBusinessSelection")}</option>
                                    <option value={IntendedUse.Unknown}>{t("profileJob.tableUnknownSelection")}</option>
                                </select>
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 top-7">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Budget Inputs */}
                            <div className="flex flex-col gap-2">
                                <label
                                    className="block text-sm font-semibold text-gray-700">{t("profileJob.dropdownSearchBudget")}</label>
                                <div className="flex gap-3">
                                    <input
                                        id="budget-min"
                                        type="number"
                                        min="0"
                                        placeholder={t("profileJob.minBudgetPlaceholder")}
                                        value={filters.budgetMin || ""}
                                        onChange={(e) => handleBudgetInput("min", e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-blue-300"
                                    />
                                    <input
                                        id="budget-max"
                                        type="number"
                                        min="0"
                                        placeholder={t("profileJob.maxBudgetPlaceholder")}
                                        value={filters.budgetMax || ""}
                                        onChange={(e) => handleBudgetInput("max", e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-blue-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Post Job Button */}
                        <div className="w-full md:w-auto text-right">
                            <Link
                                prefetch={false}
                                href="/job-board/create-job"
                                className="inline-flex items-center bg-blue-600   text-white py-3 px-6 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M12 4v16m8-8H4"/>
                                </svg>
                                {t("profileJob.buttonPostJob")} (0/3)
                            </Link>
                        </div>
                    </div>


                    {/* Results Summary */}
                    {!isLoading && totalJobs > 0 && (
                        <div className="mb-4 text-sm text-gray-600">
                            Showing {totalJobs} job{totalJobs !== 1 ? 's' : ''}
                            {hasPreviousPage && ` (page ${cursorHistory.length + 1})`}
                        </div>
                    )}

                    {/* Jobs Table */}
                    <div className="overflow-x-auto border-1 border-borderPrimary rounded-lg">
                        {isLoading ? (
                            <div className="py-12 text-center">
                                <LoadingMultiCircle/>
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200" role="table"
                                   aria-label="Job listings">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderTitle")}
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderCategory")}
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderJobType")}
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {t("profileJob.tableHeaderBudget")}
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                        {t("profileJob.tableHeaderPostDate")}
                                    </th>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                        {t("profileJob.tableHeaderDeadline")}
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {jobPostsPagination?.posts?.length ? (
                                    jobPostsPagination.posts.map((job) => (
                                        <tr
                                            key={job.post.id}
                                            onClick={() => handleJobClick(job.post.id)}
                                            className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleJobClick(job.post.id);
                                                }
                                            }}
                                            aria-label={`View job: ${job.post.name || job.post.embedTitle || "Untitled"}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-start">
                                                    <div className="mr-2 mt-1 flex-shrink-0">
                                                        <svg
                                                            className="h-5 w-5 text-gray-400"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            aria-hidden="true"
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
                                                    <div className="min-w-0 flex-1">
                                                        <Link
                                                            prefetch={false}
                                                            href={`/job-board/${job.post.id}`}
                                                            className="hover:text-blue-600 font-medium text-base text-text-primary font-sans block truncate"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {job.post.name || job.post.embedTitle || "Untitled"}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                                                {t(`catalogs.${slugToCamelCase(job.community.slug)}`) || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                                                {getJobTypeLabel(job.post.jobType)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900 font-medium">
                                                {formatBudget(job.post.budget)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-text-primary">
                                                {formatDate(job.post.publishedAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-base text-text-primary">
                                                {job.post.deadline ? formatDate(job.post.deadline) : "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <span className="sr-only">View job details</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="col-span-full text-center text-gray-500 py-8">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-gray-300 mb-4" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M9 12h6m-3-3v6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                </svg>
                                                <p className="text-lg font-medium">
                                                    {hasActiveFilters ? t("profileJob.noJobsTitleWithFilters") : t("profileJob.noJobsTitleNoFilters")}
                                                </p>
                                                <p className="text-sm">
                                                    {hasActiveFilters
                                                        ? t("profileJob.noJobsDescriptionWithFilters")
                                                        : t("profileJob.noJobsDescriptionNoFilters")
                                                    }
                                                </p>
                                                {hasActiveFilters && (
                                                    <button
                                                        onClick={clearFilters}
                                                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        {t("profileJob.clearAllFilters")}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {(hasPreviousPage || hasNextPage) && (
                    <div className="mt-6 flex justify-center gap-4">
                        {hasPreviousPage && (
                            <button
                                onClick={handlePrevPage}
                                className="py-2 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={isLoading}
                                aria-label="Go to previous page"
                            >
                                {t("profileJob.previousButton")}
                            </button>
                        )}
                        {hasNextPage && (
                            <button
                                onClick={handleNextPage}
                                className="py-2 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={isLoading}
                                aria-label="Go to next page"
                            >
                                {t("profileJob.nextButton")}
                            </button>
                        )}
                    </div>
                )}

                {/* Footer Banner */}
                <div
                    className="mt-12 h-[148px] bg-[#D0E1FB] rounded-lg overflow-hidden flex justify-center items-center">
                    <Image
                        src={ProfileImage.jobBoard}
                        alt="Job Board"
                        className="w-auto h-full object-contain"
                        priority={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default JobBoard;