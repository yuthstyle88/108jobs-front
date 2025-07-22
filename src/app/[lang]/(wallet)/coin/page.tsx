"use client";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import TopUpHistory from "@/components/TopUpHistory";
import { ProfileImage } from "@/constants/images";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FastjobCoin = () => {
  const [amount, setAmount] = useState("");

  const {
    data: coinLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.COINS);

  if (isLoading) return <Loading />;
  if (error) return <Error/>;

  return (
    <div className="w-full">
      <div className="coin-gradient h-[300px] sm:h-[200px] px-4 flex flex-col justify-center items-center relative overflow-hidden">
        <h1 className="text-3xl font-bold text-white mb-2">
          {coinLanguageData?.titleFastworkCoin}
        </h1>
        <p className="text-white text-lg text-center">
          {coinLanguageData?.subtitleFastworkCoin}
        </p>
        <Image
          src={ProfileImage.coinBg}
          alt="avatar"
          className="h-full absolute top-0 right-[-130px] sm:right-0"
        />
      </div>

      <div className="grid-container-desktop-banner w-full py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="col-start-2 col-end-3 flex justify-center w-full">
          <div className="max-w-[528px]">
            <div className="coin-popup-gradient rounded-lg p-6 text-center shadow-lg w-full">
              <p className="text-blue-100 mb-2">
                {coinLanguageData?.labelYourCoin}
              </p>
              <p className="text-4xl font-bold text-white">0.00</p>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-gray-700 font-medium mb-1">
                  {coinLanguageData?.labelSpecifyAmount}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {coinLanguageData?.noteMinMax}
                </p>

                <div className="flex items-center space-x-2 border-1 border-borderPrimary rounded-lg py-4 px-4 shadow-md">
                  <FontAwesomeIcon
                    icon={faCoins}
                    className="text-[20px] text-[#EAB84B] pr-2"
                  />
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"></div>
                    <input
                      type="text"
                      placeholder="Specify the amount 100-500,000"
                      className="text-text-primary pl-10 pr-16 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">baht</span>
                    </div>
                  </div>
                  <button className="bg-blue-100 text-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                    {coinLanguageData?.buttonTopUp}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-gray-700 font-medium mb-4">
                  {coinLanguageData?.labelChooseAmount}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon={faCoins}
                        className="text-[20px] text-[#EAB84B] "
                      />
                      <span className="text-gray-700">5,000 Coins</span>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      {coinLanguageData?.buttonTopUp} 5,000 baht
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon={faCoins}
                        className="text-[20px] text-[#EAB84B] "
                      />
                      <span className="text-gray-700">10,000 Coins</span>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      {coinLanguageData?.buttonTopUp} 10,000 baht
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 text-[0.75rem] text-text-secondary border-1 border-borderPrimary rounded-lg bg-[#F6F7F8] ">
              <p>note :</p>
              <ul>
                {coinLanguageData?.noteCoinTerms?.map((term, index) => {
                  const keywords = [
                    "the Support Center",
                    "Trung tâm hỗ trợ",
                    "ศูนย์ช่วยเหลือ",
                  ];

                  const keyword = keywords.find((kw) => term.includes(kw));

                  if (keyword) {
                    const parts = term.split(keyword);

                    return (
                      <li key={index}>
                        {parts[0]}
                        <Link prefetch={false} href="" className="text-third underline">
                          <span>{keyword}</span>
                        </Link>
                        {parts[1]}
                      </li>
                    );
                  }

                  return <li key={index}>{term}</li>;
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-lg">
        <div className="col-start-2 col-end-3 bg-white">
          <TopUpHistory data={coinLanguageData} />
        </div>
      </div>
    </div>
  );
};

export default FastjobCoin;
