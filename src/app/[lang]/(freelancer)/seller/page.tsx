"use client";
import { API_ROUTES } from "@/api/endpoints";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import { LanguageFile } from "@/constants/language";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrivateFetch } from "@/hooks/api-hooks";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { ProfileData } from "@/types/userData";
import { interpolateDouble } from "@/utils/interpolate";
import {
  faArrowRight,
  faEye,
  faInfoCircle,
  faLineChart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const SellerHome = () => {
  const chartData = [
    { name: "Th02 24", value: 0 },
    { name: "Th03 24", value: 0 },
    { name: "Th04 24", value: 0 },
    { name: "Th05 24", value: 0 },
    { name: "Th06 24", value: 0 },
    { name: "Th07 24", value: 0 },
    { name: "Th08 24", value: 0 },
    { name: "Th09 24", value: 0 },
    { name: "Th10 24", value: 0 },
    { name: "Th11 24", value: 0 },
    { name: "Th12 24", value: 0 },
    { name: "Th01 25", value: 0 },
    { name: "Th02 25", value: 0 },
  ];

  const { data: user } = usePrivateFetch<ProfileData>(
    API_ROUTES.profile.getProfile
  );
const { lang } = useLanguage();
  const {
    data: sellerOverviewLanguage,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.SELLER_OVERVIEW);

  if (isLoading) return <Loading />;
  if (error) return <Error/>;

  return (
    <main className="min-h-screen">
      <section className="bg-white rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start">
          <div className="flex flex-row md:flex-col gap-6 md:gap-0">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block mb-2">
              <h3 className="font-medium">
                {sellerOverviewLanguage?.memberLabel}
              </h3>
              <p className="text-sm">{sellerOverviewLanguage?.serviceFee}</p>
            </div>
            <div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-blue-600 font-medium">đ0,00</span>
                <span className="text-gray-400">/ 800.000,00</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">
                  {interpolateDouble(
                    sellerOverviewLanguage?.accumulatedIncome || "",
                    { n: 3 }
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm">
              {interpolateDouble(
                sellerOverviewLanguage?.accumulateMore || "",
                { n: "đ1.800.000,00" }
              )}
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              {sellerOverviewLanguage?.upgradeMembership}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg p-6 bg-white">
        <div className="flex flex-col md:flex-row gap-2 items-center md:gap-2 mb-4 ">
          <div className="p-2 bg-blue-600 rounded text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-lg text-textPrimary font-medium">
            {sellerOverviewLanguage?.freelancerSetupTitle}
          </h2>
          <span className="text-sm text-gray-500">
            {sellerOverviewLanguage?.freelancerSetupSteps}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:gap-0 items-center justify-between p-4 border border-green-100 rounded-lg bg-green-50">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-textPrimary">
                  {sellerOverviewLanguage?.step1Title}
                </p>
              </div>
            </div>
            <span className="text-green-500">
              {sellerOverviewLanguage?.step1Status}
            </span>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:gap-0 items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-textPrimary">
                  {sellerOverviewLanguage?.step2Title}
                </p>
                <p className="text-sm text-gray-500">
                  {sellerOverviewLanguage?.step2Desc}
                </p>
              </div>
            </div>
            <Link prefetch={false}
              href="/seller/my-service"
              className="flex flex-row items-center gap-2"
            >
              <button className="text-blue-600 hover:underline">
                {sellerOverviewLanguage?.step2Action}
              </button>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-[14px] text-third"
              />
            </Link>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:gap-0 items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-textPrimary">
                  {sellerOverviewLanguage?.step3Title}
                </p>
                <p className="text-sm text-gray-500">
                  {sellerOverviewLanguage?.step3Desc}
                </p>
              </div>
            </div>
            <Link prefetch={false}
              href={`${lang}/user/${user?.user.username}`}
              className="flex flex-row items-center gap-2"
            >
              <button className="text-blue-600 hover:underline">
                {sellerOverviewLanguage?.step3Action}
              </button>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-[14px] text-third"
              />
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-white rounded-lg my-6 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3 mt-6">
            <div className="p-2 bg-blue-100 rounded">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-medium text-textPrimary">
                {sellerOverviewLanguage?.ongoingProjectsTitle}
              </h2>
              <p className="text-sm text-gray-500">
                0 {sellerOverviewLanguage?.ongoingProjectsCount}
              </p>
            </div>
          </div>
          <Link prefetch={false}
            href="/seller/project-management"
            className="text-blue-600 hover:underline flex items-center text-sm"
          >
            {sellerOverviewLanguage?.seeMore}
            <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 border-b border-gray-200">
            <div className="flex items-center">
              <span className="font-medium text-sm text-gray-700">
                {sellerOverviewLanguage?.projectColumnName}
              </span>
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="w-4 h-4 ml-1 text-gray-400"
              />
            </div>
            <div className="font-medium text-sm text-gray-700">
              {sellerOverviewLanguage?.projectColumnCode}
            </div>
            <div className="flex items-center">
              <span className="font-medium text-sm text-gray-700">
                {sellerOverviewLanguage?.projectColumnAmount}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-sm text-gray-700">
                {sellerOverviewLanguage?.projectColumnDeadline}
              </span>
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="w-4 h-4 ml-1 text-gray-400"
              />
            </div>
          </div>
          <div className="py-12 flex flex-col items-center justify-center text-gray-500">
            <svg
              className="w-10 h-10 mb-3 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm">{sellerOverviewLanguage?.noProjects}</p>
          </div>
        </div>
      </section>

      {/* Detailed Statistics Section */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800 px-4">
        {sellerOverviewLanguage?.detailsTitle}
      </h2>

      {/* Overview Chart */}
      <section className="bg-white rounded-lg py-6 px-2 md:px-6 md:py-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded">
            <FontAwesomeIcon
              icon={faLineChart}
              className="w-5 h-5 text-blue-500"
            />
          </div>
          <div>
            <h3 className="font-medium text-textPrimary">
              {sellerOverviewLanguage?.hiringOverviewTitle}
            </h3>
            <p className="text-sm text-gray-500">
              {sellerOverviewLanguage?.hiringNote}
            </p>
          </div>
        </div>

        <div className="flex items-center mb-2 gap-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-300 rounded-full"></span>
            <span className="text-sm text-gray-600">
              {sellerOverviewLanguage?.legendIncome}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-gray-800 rounded-full"></span>
            <span className="text-sm text-gray-600">
              {sellerOverviewLanguage?.legendCompletedProjects}
            </span>
          </div>
        </div>

        <div className="h-64 text-textPrimary">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickSize={0}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="value"
                stroke="#82ca9d"
                dot={{ fill: "#82ca9d" }}
                activeDot={{ r: 8 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Access Rate Section */}
      <section className="bg-white rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded">
            <FontAwesomeIcon icon={faEye} className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium text-textPrimary">
              {sellerOverviewLanguage?.accessHireRateTitle}
            </h3>
            <p className="text-sm text-gray-500">
              {sellerOverviewLanguage?.accessHireNote}
            </p>
          </div>
        </div>

        <div className="py-12 flex flex-col items-center justify-center text-gray-500">
          <svg
            className="w-10 h-10 mb-3 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm">{sellerOverviewLanguage?.noData}</p>
        </div>
      </section>
    </main>
  );
};

export default SellerHome;
