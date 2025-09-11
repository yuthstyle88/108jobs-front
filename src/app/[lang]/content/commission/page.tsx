"use client";
import {LanguageFile} from "@/constants/language";
import {getNamespace} from "@/utils/i18nHelper";
import {scrollToElementById} from "@/utils/scrollSmooth";
import {ChevronDown} from "lucide-react";
import Link from "next/link";
import {useState} from "react";


const MyServices = () => {
  const commissionLanguage = getNamespace(LanguageFile.COMMISSION);

  const MEMBER_TIERS = [
    {
      id: "member",
      name: commissionLanguage?.tierTableRows0Level,
      feePercent: 12,
      minIncome: 0,
      maxIncome: 1799999,
      color: "bg-blue-400",
      icon: "🔹",
    },
    {
      id: "bronze",
      name: commissionLanguage?.tierTableRows1Level,
      feePercent: 10,
      minIncome: 1800000,
      maxIncome: 8199999,
      color: "bg-amber-500",
      icon: "🥉",
    },
    {
      id: "silver",
      name: commissionLanguage?.tierTableRows2Level,
      feePercent: 9,
      minIncome: 8200000,
      maxIncome: 24999999,
      color: "bg-gray-300",
      icon: "🥈",
    },
    {
      id: "gold",
      name: commissionLanguage?.tierTableRows3Level,
      feePercent: 8,
      minIncome: 25000000,
      maxIncome: 109999999,
      color: "bg-yellow-400",
      icon: "🥇",
    },
    {
      id: "platinum",
      name: commissionLanguage?.tierTableRows4Level,
      feePercent: 7,
      minIncome: 110000000,
      maxIncome: 349999999,
      color: "bg-gray-400",
      icon: "👑",
    },
    {
      id: "diamond",
      name: commissionLanguage?.tierTableRows5Level,
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
    return price - calculateFee(price,
      feePercent);
  };

  const handleTierSelect = (tier: (typeof MEMBER_TIERS)[0]) => {
    setMemberTier(tier);
    setDropdownOpen(false);
  };

  return (
    <div className="relative p-4 md:p-10 xl:p-20">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="block sm:hidden w-full lg:w-1/3 relative">
          <div className="sticky top-20 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary text-white p-4 text-center">
              <h3 className="font-medium">{commissionLanguage?.header}</h3>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {commissionLanguage?.translatorTypeLabel}
                </label>
                <div className="relative">
                  <button
                    className="w-full text-left flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="text-gray-700">
                      {memberTier.name} (
                      {commissionLanguage?.translationFeeLabel}{" "}
                      {memberTier.feePercent}%)
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="text-text-primary absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
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
                            {commissionLanguage?.translationFeeLabel}{" "}
                            {tier.feePercent}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <Link prefetch={false}
                        href="#"
                        className="text-primary hover:underline text-xs"
                  >
                    {commissionLanguage?.translatorTypeAdditionalInfo}
                  </Link>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {commissionLanguage?.unitPriceLabel}
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="text-text-primary flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    value={projectPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g,
                        "");
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
                    {commissionLanguage?.translationFeeLabel}
                  </span>
                  <span className="text-primary font-medium">
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
                      {commissionLanguage?.additionalFeeLabel}
                    </div>
                  </div>
                  <div className="text-primary font-bold">
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
                  <span className="font-medium text-text-primary">
                    {commissionLanguage?.allContentTitle}
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
                      <Link prefetch={false}
                            href="/content/commission#section1"
                            onClick={(e) => handleClick(e,
                              1)}
                      >
                        <span className="cursor-pointer hover:underline">
                          {
                            commissionLanguage?.allContentWhatIsFeeBasedOnAccumulatedIncome
                          }
                        </span>
                      </Link>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <Link prefetch={false}
                            href="/content/commission#section2"
                            onClick={(e) => handleClick(e,
                              2)}
                      >
                        <span>
                          {
                            commissionLanguage?.allContentHowIsFeeCalculated
                          }
                        </span>
                      </Link>

                      <ul className="mt-2 pl-5 space-y-2">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <Link prefetch={false}
                                href="/content/commission#section3"
                                onClick={(e) => handleClick(e,
                                  3)}
                          >
                            <span>
                              {commissionLanguage?.allContentExample1Title}
                            </span>
                          </Link>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <Link prefetch={false}
                                href="/content/commission#section4"
                                onClick={(e) => handleClick(e,
                                  4)}
                          >
                            <span>
                              {commissionLanguage?.allContentExample2Title}
                            </span>
                          </Link>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <Link prefetch={false}
                                href="/content/commission#section5"
                                onClick={(e) => handleClick(e,
                                  5)}
                          >
                            <span>
                              {commissionLanguage?.allContentExample3Title}
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <Link prefetch={false}
                            href="/content/commission#section6"
                            onClick={(e) => handleClick(e,
                              6)}
                      >
                        <span>
                          {commissionLanguage?.allContentWhatIsFeeUsedFor}
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
            <h2 className="text-xl font-medium mb-6 text-text-primary">
              {commissionLanguage?.whatIsAccumulatedIncomeFeeTitle}
            </h2>
            <p className="text-gray-700 mb-6">
              {commissionLanguage?.whatIsAccumulatedIncomeFeeDescription}
            </p>

            <div className="mt-4 mb-6">
              <Link prefetch={false}
                    href="/seller"
                    className="text-primary underline text-sm"
              >
                {commissionLanguage?.checkYourTier}
              </Link>
            </div>

            <p className="text-gray-700 mb-6">
              {commissionLanguage?.tierTableHeaderName}
            </p>

            <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 text-text-primary">
              <div className="grid grid-cols-3 text-sm">
                <div className="font-medium p-4 bg-gray-100">
                  {commissionLanguage?.tierTableHeadersMemberLevel}
                </div>
                <div className="font-medium p-4 bg-gray-100">
                  {commissionLanguage?.tierTableHeadersAccumulatedIncome}
                </div>
                <div className="font-medium p-4 bg-gray-100">
                  {
                    commissionLanguage?.tierTableHeadersServiceFeePercentage
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
                        commissionLanguage?.tierTableRows5IncomeRangeUpper
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
              *{commissionLanguage?.tierTableNote}
            </p>
          </div>

          {/* How Fees Are Calculated */}
          <div className="mb-8">
            <h2
              id="section2"
              className="text-xl font-medium mb-6 text-text-primary"
            >
              {commissionLanguage?.howIsFeeCalculatedSectionTitle}
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
              <li>
                {
                  commissionLanguage?.howIsFeeCalculatedSectionDescription1
                }
              </li>
              <li>
                {
                  commissionLanguage?.howIsFeeCalculatedSectionDescription2
                }
              </li>
              <li>
                {
                  commissionLanguage?.howIsFeeCalculatedSectionDescription3
                }
              </li>
            </ul>

            <p className="text-gray-700 mb-6">
              {
                commissionLanguage?.howIsFeeCalculatedSectionFreelancerReference
              }
            </p>

            {/* Table for Phí dịch vụ được tính như thế nào */}
            <div className="overflow-hidden border border-gray-200 rounded-lg mb-6 text-text-primary">
              <table className="w-full">
                <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 text-left font-medium text-sm text-gray-700">
                    {
                      commissionLanguage?.howIsFeeCalculatedSectionCalculationStepsTitle
                    }
                  </th>
                  <th className="p-4 text-left font-medium text-sm text-gray-700">
                    {
                      commissionLanguage?.howIsFeeCalculatedSectionCalculationStepsTitleMethod
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
                            commissionLanguage?.howIsFeeCalculatedSectionCalculationStepsStep1Title
                          }
                        </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {
                      commissionLanguage?.howIsFeeCalculatedSectionCalculationStepsStep1Description
                    }
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-4">
                    <div className="flex items-center">
                        <span className="font-medium mr-2">
                          {
                            commissionLanguage?.howIsFeeCalculatedSectionCalculationStepsStep2Title
                          }
                        </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {
                      commissionLanguage?.howIsFeeCalculatedSectionCalculationStepsStep2Description
                    }
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="p-4">
                    <div className="flex items-center">
                        <span className="font-medium mr-2">
                          {
                            commissionLanguage?.howIsFeeCalculatedSectionCalculationStepsStep3Title
                          }
                        </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {
                      commissionLanguage?.howIsFeeCalculatedSectionCalculationStepsStep3Description
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
            className="mb-8 bg-blue-50 rounded-lg p-6 text-text-primary"
          >
            <div className="bg-blue-100 rounded-lg px-4 py-2 inline-block mb-4">
              <h3 className="text-blue-800 font-medium">
                {" "}
                {commissionLanguage?.example1Title}
              </h3>
              <span className="text-blue-700">
                {commissionLanguage?.example1Subtitle}
              </span>
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{commissionLanguage?.example1DetailsDate}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{commissionLanguage?.example1DetailsStatus}</span>
              </li>
            </ul>

            <p className="mb-4">
              {commissionLanguage?.example1DetailsCalculationIntro}
            </p>

            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example1DetailsMonths0Month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example1DetailsMonths0Label}
                  </div>
                  <div className="font-bold">5.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example1DetailsMonths1Month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example1DetailsMonths0Label}
                  </div>
                  <div className="font-bold">2.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example1DetailsMonths2Month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example1DetailsMonths0Label}
                  </div>
                  <div className="font-bold">1.000.000 VND</div>
                </div>
              </div>
              <div className="bg-primary text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example1DetailsMonths3Month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example1DetailsMonths3Label}
                  </div>
                  <div className="font-bold">0 VND</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center py-4 mb-4">
              <div className="h-1 w-full bg-gray-300 mb-4 relative">
                <div className="absolute inset-0 bg-primary w-3/4"></div>
              </div>
              <div className="text-gray-700">
                {commissionLanguage?.example1DetailsTotal} 8.000.000 + 0 ={" "}
                <span className="font-bold">8.000.000 VND</span>
              </div>

              <div className="mt-6 bg-amber-500 text-white px-6 py-2 rounded-full flex items-center">
                <span className="mr-2">
                  {commissionLanguage?.tierTableRows1Level}
                </span>
                <span className="font-bold">
                  {commissionLanguage?.translationFeeLabel} 10%
                </span>
              </div>
            </div>

            <p>{commissionLanguage?.example1Note}</p>
            <p className="text-sm text-gray-500 mt-2 italic">
              {commissionLanguage?.example1AdditionalNote}
            </p>
          </div>

          {/* Example 2 */}
          <div
            id="section4"
            className="mb-8 bg-blue-50 rounded-lg p-6 text-text-primary"
          >
            <div className="bg-blue-100 rounded-lg px-4 py-2 inline-block mb-4">
              <h3 className="text-blue-800 font-medium">
                {commissionLanguage?.example2Title}
              </h3>
              <span className="text-blue-700">
                {commissionLanguage?.example2Subtitle}
              </span>
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{commissionLanguage?.example2DetailsDate}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{commissionLanguage?.example2DetailsStatus}</span>
              </li>
            </ul>

            <p className="mb-4">
              {commissionLanguage?.example2DetailsCalculationIntro}
            </p>

            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example2DetailsMonths0Month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example2DetailsMonths0Label}
                  </div>
                  <div className="font-bold">5.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example2DetailsMonths1Month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example2DetailsMonths0Label}
                  </div>
                  <div className="font-bold">2.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example2DetailsMonths2Month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example2DetailsMonths0Label}
                  </div>
                  <div className="font-bold">1.000.000 VND</div>
                </div>
              </div>
              <div className="bg-primary text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example2DetailsMonths3Month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example2DetailsMonths3Label}
                  </div>
                  <div className="font-bold">7.000.000 VND</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center py-4 mb-4">
              <div className="h-1 w-full bg-gray-300 mb-4 relative">
                <div className="absolute inset-0 bg-primary w-5/6"></div>
              </div>
              <div className="text-gray-700">
                {commissionLanguage?.example2DetailsTotal} 8.000.000 +
                7.000.000 = <span className="font-bold">15.000.000 VND</span>
              </div>

              <div className="mt-6 bg-gray-300 text-white px-6 py-2 rounded-full flex items-center">
                <span className="mr-2">
                  {commissionLanguage?.tierTableRows2Level}
                </span>
                <span className="font-bold">
                  {commissionLanguage?.translationFeeLabel} 9%
                </span>
              </div>
            </div>

            <p>{commissionLanguage?.example2Note}</p>
            <p className="text-sm text-gray-500 mt-2 italic">
              {commissionLanguage?.example2AdditionalNote}
            </p>
          </div>

          {/* Example 3 */}
          <div
            id="section5"
            className="mb-8 bg-blue-50 rounded-lg p-6 text-text-primary"
          >
            <div className="bg-blue-100 rounded-lg px-4 py-2 inline-block mb-4">
              <h3 className="text-blue-800 font-medium">
                {commissionLanguage?.example3Title}
              </h3>
              <span className="text-blue-700">
                {commissionLanguage?.example3Subtitle}
              </span>
            </div>

            <ul className="space-y-3 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{commissionLanguage?.example3DetailsDate}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>{commissionLanguage?.example3DetailsStatus}</span>
              </li>
            </ul>

            <p className="mb-4">
              {commissionLanguage?.example3DetailsCalculationIntro}
            </p>

            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example3DetailsMonths0Month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example2DetailsMonths0Label}
                  </div>
                  <div className="font-bold text-gray-300 line-through">
                    2.000.000 VND
                  </div>
                </div>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example3DetailsMonths1Month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example2DetailsMonths0Label}
                  </div>
                  <div className="font-bold">1.000.000 VND</div>
                </div>
              </div>
              <div className="bg-blue-400 text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example3DetailsMonths2Month}
                </div>
                <div className="mt-2">
                  <div>
                    {commissionLanguage?.example2DetailsMonths0Label}
                  </div>
                  <div className="font-bold">7.000.000 VND</div>
                </div>
              </div>
              <div className="bg-primary text-white rounded-lg p-3 text-center">
                <div className="font-medium">
                  {commissionLanguage?.example3DetailsMonths3Month}
                </div>
                <div className="mt-2">
                  <div>Thu nhập tính đến ngày 1 tháng 7</div>
                  <div className="font-bold">0 VND</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center py-4 mb-4">
              <div className="h-1 w-full bg-gray-300 mb-4 relative">
                <div className="absolute inset-0 bg-primary w-1/2"></div>
              </div>
              <div className="text-gray-700">
                {commissionLanguage?.example3DetailsTotal} 1.000.000 +
                7.000.000 + 0 = <span className="font-bold">8.000.000 VND</span>
              </div>

              <div className="mt-6 bg-amber-500 text-white px-6 py-2 rounded-full flex items-center">
                <span className="mr-2">
                  {commissionLanguage?.tierTableRows1Level}
                </span>
                <span className="font-bold">
                  {commissionLanguage?.translationFeeLabel} 10%
                </span>
              </div>
            </div>

            <p>{commissionLanguage?.example3Note}</p>
            <p className="text-sm text-gray-500 mt-2 italic">
              {commissionLanguage?.example3AdditionalNote}
            </p>
          </div>

          {/* Service Fee Purpose */}
          <div id="section6" className="mb-8">
            <h2 className="text-xl font-medium mb-6 text-text-primary">
              {commissionLanguage?.fastlaneFeePurposeQuest}
            </h2>
            <p className="text-gray-700">
              {commissionLanguage?.fastlaneFeePurpose}
            </p>
          </div>
        </div>

        {/* Right Calculator Panel - Sticky */}
        <div className="hidden sm:block w-full lg:w-1/3 relative">
          <div className="sticky top-20 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary text-white p-4 text-center">
              <h3 className="font-medium">{commissionLanguage?.title}</h3>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {commissionLanguage?.translatorTypeLabel}
                </label>
                <div className="relative">
                  <button
                    className="w-full text-left flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="text-gray-700">
                      {memberTier.name} (
                      {commissionLanguage?.translationFeeLabel}{" "}
                      {memberTier.feePercent}%)
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="text-text-primary absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
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
                            {commissionLanguage?.translationFeeLabel}{" "}
                            {tier.feePercent}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <Link prefetch={false}
                        href="#"
                        className="text-primary hover:underline text-xs"
                  >
                    {commissionLanguage?.translatorTypeAdditionalInfo}
                  </Link>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {commissionLanguage?.unitPriceLabel}
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="text-text-primary flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    value={projectPrice}
                    onChange={(e) => {
                      // Allow only numbers and format with commas
                      const value = e.target.value.replace(/\D/g,
                        "");
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
                    {commissionLanguage?.translationFeeLabel}
                  </span>
                  <span className="text-primary font-medium">
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
                      {commissionLanguage?.additionalFeeLabel}
                    </div>
                  </div>
                  <div className="text-primary font-bold">
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
