"use client";
import Loading from "@/components/Loading";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { scrollToElementById } from "@/utils/scrollSmooth";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MyServices = () => {
  const {
    data: commissionLanguage,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.COMMISSION);

  const MEMBER_TIERS = [
    {
      id: "member",
      name: commissionLanguage?.tier_table_rows_0_level,
      feePercent: 12,
      minIncome: 0,
      maxIncome: 1799999,
      color: "bg-blue-400",
      icon: "🔹",
    },
    {
      id: "bronze",
      name: commissionLanguage?.tier_table_rows_1_level,
      feePercent: 10,
      minIncome: 1800000,
      maxIncome: 8199999,
      color: "bg-amber-500",
      icon: "🥉",
    },
    {
      id: "silver",
      name: commissionLanguage?.tier_table_rows_2_level,
      feePercent: 9,
      minIncome: 8200000,
      maxIncome: 24999999,
      color: "bg-gray-300",
      icon: "🥈",
    },
    {
      id: "gold",
      name: commissionLanguage?.tier_table_rows_3_level,
      feePercent: 8,
      minIncome: 25000000,
      maxIncome: 109999999,
      color: "bg-yellow-400",
      icon: "🥇",
    },
    {
      id: "platinum",
      name: commissionLanguage?.tier_table_rows_4_level,
      feePercent: 7,
      minIncome: 110000000,
      maxIncome: 349999999,
      color: "bg-gray-400",
      icon: "👑",
    },
    {
      id: "diamond",
      name: commissionLanguage?.tier_table_rows_5_level,
      feePercent: 6,
      minIncome: 350000000,
      maxIncome: Infinity,
      color: "bg-blue-300",
      icon: "💎",
    },
  ];

  const [showFaqItem, setShowFaqItem] = useState(true);

  const [memberTier, setMemberTier] = useState(MEMBER_TIERS[0]);
  const [projectPrice, setProjectPrice] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLElement>, id: number) => {
    e.preventDefault();
    scrollToElementById(`section${id}`);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  const calculateFee = (price: number, feePercent: number) => {
    return price * (feePercent / 100);
  };

  const calculateNetAmount = (price: number, feePercent: number) => {
    return price - calculateFee(price, feePercent);
  };

  const handleTierSelect = (tier: (typeof MEMBER_TIERS)[0]) => {
    setMemberTier(tier);
    setDropdownOpen(false);
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading language data</div>;

  return (
    <div className="relative p-4 md:p-10 xl:p-20">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="block sm:hidden w-full lg:w-1/3 relative">
          <div className="sticky top-20 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4 text-center">
              <h3 className="font-medium">{commissionLanguage?.header}</h3>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {commissionLanguage?.translator_type_label}
                </label>
                <div className="relative">
                  <button
                    className="w-full text-left flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="text-gray-700">
                      {memberTier.name} (
                      {commissionLanguage?.translation_fee_label}{" "}
                      {memberTier.feePercent}%)
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="text-text_primary absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {MEMBER_TIERS.map((tier) => (
                        <div
                          key={tier.id}
                          className={`p-3 hover:bg-blue-50 cursor-pointer flex items-center ${
                            tier.id === memberTier.id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleTierSelect(tier)}
                        >
                          <span>
                            {tier.name} (
                            {commissionLanguage?.translation_fee_label}{" "}
                            {tier.feePercent}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <Link
                    href="#"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    {commissionLanguage?.translator_type_additional_info}
                  </Link>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {commissionLanguage?.unit_price_label}
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="text-text_primary flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    value={projectPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setProjectPrice(value);
                    }}
                  />
                  <div className="bg-gray-100 p-3 border border-l-0 border-gray-300 rounded-r-lg text-gray-700">
                    VND
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700">
                    {commissionLanguage?.translation_fee_label}
                  </span>
                  <span className="text-blue-600 font-medium">
                    {projectPrice
                      ? formatNumber(
                          calculateFee(
                            parseInt(projectPrice) || 0,
                            memberTier.feePercent
                          )
                        )
                      : "0"}{" "}
                    VND
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <div>
                    <div className="text-gray-700">
                      {commissionLanguage?.additional_fee_label}
                    </div>
                  </div>
                  <div className="text-blue-600 font-bold">
                    {projectPrice
                      ? formatNumber(
                          calculateNetAmount(
                            parseInt(projectPrice) || 0,
                            memberTier.feePercent
                          )
                        )
                      : "0"}{" "}
                    VND
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Left Content */}
        <div className="w-full lg:w-2/3">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg mb-8 p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">
                {commissionLanguage?.header}
              </h1>
              <p className="text-lg opacity-90">
                {commissionLanguage?.subheader}
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden mb-6">
              <div
                onClick={() => setShowFaqItem(!showFaqItem)}
                className="flex justify-between items-center p-4 cursor-pointer"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium text-text_primary">
                    {commissionLanguage?.all_content_title}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    showFaqItem ? "rotate-180" : ""
                  }`}
                />
              </div>

              {showFaqItem && (
                <div className="p-4 pt-0 border-t border-gray-200">
                  <ul className="space-y-4 pt-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <Link
                        href="/content/commission#section1"
                        onClick={(e) => handleClick(e, 1)}
                      >
                        <span className="cursor-pointer hover:underline">
                          {
                            commissionLanguage?.all_content_what_is_fee_based_on_accumulated_income
                          }
                        </span>
                      </Link>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <Link
                        href="/content/commission#section2"
                        onClick={(e) => handleClick(e, 2)}
                      >
                        <span>
                          {
                            commissionLanguage?.all_content_how_is_fee_calculated
                          }
                        </span>
                      </Link>

                      <ul className="mt-2 pl-5 space-y-2">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <Link
                            href="/content/commission#section3"
                            onClick={(e) => handleClick(e, 3)}
                          >
                            <span>
                              {commissionLanguage?.all_content_example_1_title}
                            </span>
                          </Link>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <Link
                            href="/content/commission#section4"
                            onClick={(e) => handleClick(e, 4)}
                          >
                            <span>
                              {commissionLanguage?.all_content_example_2_title}
                            </span>
                          </Link>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <Link
                            href="/content/commission#section5"
                            onClick={(e) => handleClick(e, 5)}
                          >
                            <span>
                              {commissionLanguage?.all_content_example_3_title}
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <Link
                        href="/content/commission#section6"
                        onClick={(e) => handleClick(e, 6)}
                      >
                        <span>
                          {commissionLanguage?.all_content_what_is_fee_used_for}
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Membership Tiers Table */}
          <div id="section1" className="mb-8">
            <h2 className="text-xl font-medium mb-6 text-text_primary">
              {commissionLanguage?.what_is_accumulated_income_fee_title}
            </h2>
            <p className="text-gray-700 mb-6">
              {commissionLanguage?.what_is_accumulated_income_fee_description}
            </p>

            <div className="mt-4 mb-6">
              <Link
                href="/seller"
                className="text-blue-600 underline text-sm"
              >
                {commissionLanguage?.check_your_tier}
              </Link>
            </div>

            <p className="text-gray-700 mb-6">
              {commissionLanguage?.tier_table_header_name}
            </p>

            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 text-text_primary">
              <div className="grid grid-cols-3 text-sm">
                <div className="font-medium p-4 bg-gray-100">
                  {commissionLanguage?.tier_table_headers_member_level}
                </div>
                <div className="font-medium p-4 bg-gray-100">
                  {commissionLanguage?.tier_table_headers_accumulated_income}
                </div>
                <div className="font-medium p-4 bg-gray-100">
                  {
                    commissionLanguage?.tier_table_headers_service_fee_percentage
                  }
                </div>
              </div>

              {MEMBER_TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="grid grid-cols-3 border-t border-gray-200"
                >
                  <div
                    className={`p-4 flex items-center ${
                      tier.id === "member" ? "bg-blue-50" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${tier.color} mr-3`}
                    >
                      <span className="text-lg">{tier.icon}</span>
                    </div>
                    <span className="font-medium">{tier.name}</span>
                  </div>
                  <div
                    className={`p-4 ${
                      tier.id === "member" ? "bg-blue-50" : ""
                    }`}
                  >
                    {tier.maxIncome < Infinity
                      ? `${formatNumber(tier.minIncome)} - ${formatNumber(
                          tier.maxIncome
                        )}`
                      : `${formatNumber(tier.minIncome)} ${
                          commissionLanguage?.tier_table_rows_5_income_range_upper
                        }`}
                  </div>
                  <div
                    className={`p-4 font-medium ${
                      tier.id === "member" ? "bg-blue-50" : ""
                    }`}
                  >
                    {tier.feePercent}%
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-2">
              *{commissionLanguage?.tier_table_note}
            </p>
          </div>

          {/* How Fees Are Calculated */}
          <div className="mb-8">
            <h2
              id="section2"
              className="text-xl font-medium mb-6 text-text_primary"
            >
              {commissionLanguage?.how_is_fee_calculated_section_title}
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
              <li>
                {
                  commissionLanguage?.how_is_fee_calculated_section_description_1
                }
              </li>
              <li>
                {
                  commissionLanguage?.how_is_fee_calculated_section_description_2
                }
              </li>
              <li>
                {
                  commissionLanguage?.how_is_fee_calculated_section_description_3
                }
              </li>
            </ul>

            <p className="text-gray-700 mb-6">
              {
                commissionLanguage?.how_is_fee_calculated_section_freelancer_reference
              }
            </p>

            {/* Table for Phí dịch vụ được tính như thế nào */}
            <div className="overflow-hidden border border-gray-200 rounded-lg mb-6 text-text_primary">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-left font-medium text-sm text-gray-700">
                      {
                        commissionLanguage?.how_is_fee_calculated_section_calculation_steps_title
                      }
                    </th>
                    <th className="p-4 text-left font-medium text-sm text-gray-700">
                      {
                        commissionLanguage?.how_is_fee_calculated_section_calculation_steps_title_method
                      }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">
                          {
                            commissionLanguage?.how_is_fee_calculated_section_calculation_steps_step_1_title
                          }
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {
                        commissionLanguage?.how_is_fee_calculated_section_calculation_steps_step_1_description
                      }
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">
                          {
                            commissionLanguage?.how_is_fee_calculated_section_calculation_steps_step_2_title
                          }
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {
                        commissionLanguage?.how_is_fee_calculated_section_calculation_steps_step_2_description
                      }
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">
                          {
                            commissionLanguage?.how_is_fee_calculated_section_calculation_steps_step_3_title
                          }
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {
                        commissionLanguage?.how_is_fee_calculated_section_calculation_steps_step_3_description
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Example 1 */}
          <div
            id="section3"
            className="mb-8 bg-blue-50 rounded-lg p-6 text-text_primary"
          >
            <div className="bg-blue-100 rounded-lg px-4 py-2 inline-block mb-4">
              <h3 className="text-blue-800 font-medium">
                {" "}
                {commissionLanguage?.example_1_title}
              </h3>
              <span className="text-blue-700">
                {commissionLanguage?.example_1_subtitle}
              </span>
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{commissionLanguage?.example_1_details_date}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{commissionLanguage?.example_1_details_status}</span>
              </li>
            </ul>

            <p className="mb-4">
              {commissionLanguage?.example_1_details_calculation_intro}
            </p>

            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example_1_details_months_0_month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example_1_details_months_0_label}
                  </div>
                  <div className="font-bold">5.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example_1_details_months_1_month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example_1_details_months_0_label}
                  </div>
                  <div className="font-bold">2.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example_1_details_months_2_month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example_1_details_months_0_label}
                  </div>
                  <div className="font-bold">1.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-600 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example_1_details_months_3_month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example_1_details_months_3_label}
                  </div>
                  <div className="font-bold">0 VND</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center py-4 mb-4">
              <div className="h-1 w-full bg-gray-300 mb-4 relative">
                <div className="absolute inset-0 bg-blue-600 w-3/4"></div>
              </div>
              <div className="text-gray-700">
                {commissionLanguage?.example_1_details_total} 8.000.000 + 0 ={" "}
                <span className="font-bold">8.000.000 VND</span>
              </div>

              <div className="mt-6 bg-amber-500 text-white px-6 py-2 rounded-full flex items-center">
                <span className="mr-2">
                  {commissionLanguage?.tier_table_rows_1_level}
                </span>
                <span className="font-bold">
                  {commissionLanguage?.translation_fee_label} 10%
                </span>
              </div>
            </div>

            <p>{commissionLanguage?.example_1_note}</p>
            <p className="text-sm text-gray-500 mt-2 italic">
              {commissionLanguage?.example_1_additional_note}
            </p>
          </div>

          {/* Example 2 */}
          <div
            id="section4"
            className="mb-8 bg-blue-50 rounded-lg p-6 text-text_primary"
          >
            <div className="bg-blue-100 rounded-lg px-4 py-2 inline-block mb-4">
              <h3 className="text-blue-800 font-medium">
                {commissionLanguage?.example_2_title}
              </h3>
              <span className="text-blue-700">
                {commissionLanguage?.example_2_subtitle}
              </span>
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{commissionLanguage?.example_2_details_date}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{commissionLanguage?.example_2_details_status}</span>
              </li>
            </ul>

            <p className="mb-4">
              {commissionLanguage?.example_2_details_calculation_intro}
            </p>

            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example_2_details_months_0_month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example_2_details_months_0_label}
                  </div>
                  <div className="font-bold">5.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example_2_details_months_1_month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example_2_details_months_0_label}
                  </div>
                  <div className="font-bold">2.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example_2_details_months_2_month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example_2_details_months_0_label}
                  </div>
                  <div className="font-bold">1.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-600 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example_2_details_months_3_month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example_2_details_months_3_label}
                  </div>
                  <div className="font-bold">7.000.000 VND</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center py-4 mb-4">
              <div className="h-1 w-full bg-gray-300 mb-4 relative">
                <div className="absolute inset-0 bg-blue-600 w-5/6"></div>
              </div>
              <div className="text-gray-700">
                {commissionLanguage?.example_2_details_total} 8.000.000 +
                7.000.000 = <span className="font-bold">15.000.000 VND</span>
              </div>

              <div className="mt-6 bg-gray-300 text-white px-6 py-2 rounded-full flex items-center">
                <span className="mr-2">
                  {commissionLanguage?.tier_table_rows_2_level}
                </span>
                <span className="font-bold">
                  {commissionLanguage?.translation_fee_label} 9%
                </span>
              </div>
            </div>

            <p>{commissionLanguage?.example_2_note}</p>
            <p className="text-sm text-gray-500 mt-2 italic">
              {commissionLanguage?.example_2_additional_note}
            </p>
          </div>

          {/* Example 3 */}
          <div
            id="section5"
            className="mb-8 bg-blue-50 rounded-lg p-6 text-text_primary"
          >
            <div className="bg-blue-100 rounded-lg px-4 py-2 inline-block mb-4">
              <h3 className="text-blue-800 font-medium">
                {commissionLanguage?.example_3_title}
              </h3>
              <span className="text-blue-700">
                {commissionLanguage?.example_3_subtitle}
              </span>
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{commissionLanguage?.example_3_details_date}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{commissionLanguage?.example_3_details_status}</span>
              </li>
            </ul>

            <p className="mb-4">
              {commissionLanguage?.example_3_details_calculation_intro}
            </p>

            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example_3_details_months_0_month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example_2_details_months_0_label}
                  </div>
                  <div className="font-bold text-gray-300 line-through">
                    2.000.000 VND
                  </div>
                </div>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example_3_details_months_1_month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example_2_details_months_0_label}
                  </div>
                  <div className="font-bold">1.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example_3_details_months_2_month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example_2_details_months_0_label}
                  </div>
                  <div className="font-bold">7.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-600 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example_3_details_months_3_month}
                </div>
                <div className="mt-2">
                  <div>Thu nhập tính đến ngày 1 tháng 7</div>
                  <div className="font-bold">0 VND</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center py-4 mb-4">
              <div className="h-1 w-full bg-gray-300 mb-4 relative">
                <div className="absolute inset-0 bg-blue-600 w-1/2"></div>
              </div>
              <div className="text-gray-700">
                {commissionLanguage?.example_3_details_total} 1.000.000 +
                7.000.000 + 0 = <span className="font-bold">8.000.000 VND</span>
              </div>

              <div className="mt-6 bg-amber-500 text-white px-6 py-2 rounded-full flex items-center">
                <span className="mr-2">
                  {commissionLanguage?.tier_table_rows_1_level}
                </span>
                <span className="font-bold">
                  {commissionLanguage?.translation_fee_label} 10%
                </span>
              </div>
            </div>

            <p>{commissionLanguage?.example_3_note}</p>
            <p className="text-sm text-gray-500 mt-2 italic">
              {commissionLanguage?.example_3_additional_note}
            </p>
          </div>

          {/* Service Fee Purpose */}
          <div id="section6" className="mb-8">
            <h2 className="text-xl font-medium mb-6 text-text_primary">
              {commissionLanguage?.fastlane_fee_purpose_quest}
            </h2>
            <p className="text-gray-700">
              {commissionLanguage?.fastlane_fee_purpose}
            </p>
          </div>
        </div>

        {/* Right Calculator Panel - Sticky */}
        <div className="hidden sm:block w-full lg:w-1/3 relative">
          <div className="sticky top-20 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4 text-center">
              <h3 className="font-medium">{commissionLanguage?.title}</h3>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {commissionLanguage?.translator_type_label}
                </label>
                <div className="relative">
                  <button
                    className="w-full text-left flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="text-gray-700">
                      {memberTier.name} (
                      {commissionLanguage?.translation_fee_label}{" "}
                      {memberTier.feePercent}%)
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="text-text_primary absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      {MEMBER_TIERS.map((tier) => (
                        <div
                          key={tier.id}
                          className={`p-3 hover:bg-blue-50 cursor-pointer flex items-center ${
                            tier.id === memberTier.id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleTierSelect(tier)}
                        >
                          <span>
                            {tier.name} (
                            {commissionLanguage?.translation_fee_label}{" "}
                            {tier.feePercent}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <Link
                    href="#"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    {commissionLanguage?.translator_type_additional_info}
                  </Link>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {commissionLanguage?.unit_price_label}
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="text-text_primary flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    value={projectPrice}
                    onChange={(e) => {
                      // Allow only numbers and format with commas
                      const value = e.target.value.replace(/\D/g, "");
                      setProjectPrice(value);
                    }}
                  />
                  <div className="bg-gray-100 p-3 border border-l-0 border-gray-300 rounded-r-lg text-gray-700">
                    VND
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700">
                    {commissionLanguage?.translation_fee_label}
                  </span>
                  <span className="text-blue-600 font-medium">
                    {projectPrice
                      ? formatNumber(
                          calculateFee(
                            parseInt(projectPrice) || 0,
                            memberTier.feePercent
                          )
                        )
                      : "0"}{" "}
                    VND
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <div>
                    <div className="text-gray-700">
                      {commissionLanguage?.additional_fee_label}
                    </div>
                  </div>
                  <div className="text-blue-600 font-bold">
                    {projectPrice
                      ? formatNumber(
                          calculateNetAmount(
                            parseInt(projectPrice) || 0,
                            memberTier.feePercent
                          )
                        )
                      : "0"}{" "}
                    VND
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyServices;
