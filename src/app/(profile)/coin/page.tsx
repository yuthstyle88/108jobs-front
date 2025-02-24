"use client";
import TopUpHistory from "@/components/TopUpHistory";
import { ProfileImage } from "@/constants/images";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FastworkCoin = () => {
  const [amount, setAmount] = useState("");

  return (
    <div className="w-full">
      <div className="coin-gradient h-[200px] px-4 flex flex-col justify-center items-center relative overflow-hidden">
        <h1 className="text-3xl font-bold text-white mb-2">Fastwork Coin</h1>
        <p className="text-white text-lg">
          Top up your account online to make hiring freelancers more convenient.
        </p>
        <Image
          src={ProfileImage.coin_bg}
          alt="avatar"
          className="h-full absolute top-0 right-0 object-cover"
        />
      </div>

      <div className="grid-container-desktop w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="col-start-2 col-end-3 flex justify-center w-full">
          <div className="w-[528px]">
            <div className="coin-popup-gradient rounded-lg p-6 text-center shadow-lg w-full">
              <p className="text-blue-100 mb-2">Your Fastwork Coin</p>
              <p className="text-4xl font-bold text-white">0.00</p>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-gray-700 font-medium mb-1">
                  Specify the amount you want to top up.
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Minimum 100 baht and maximum 500,000 baht.
                </p>

                <div className="flex items-center space-x-2 border-1 border-border_primary rounded-lg py-4 px-4 shadow-md">
                  <FontAwesomeIcon
                    icon={faCoins}
                    className="text-[20px] text-[#EAB84B] pr-2"
                  />
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"></div>
                    <input
                      type="text"
                      placeholder="Specify the amount 100-500,000"
                      className="pl-10 pr-16 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">baht</span>
                    </div>
                  </div>
                  <button className="bg-blue-100 text-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                    Top up
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-gray-700 font-medium mb-4">
                  Or choose the amount you want immediately
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
                      Top up 5,000 baht
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
                      Top up 10,000 baht
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 text-[0.75rem] text-text_secondary border-1 border-border_primary rounded-lg bg-[#F6F7F8] ">
              <p>note :</p>
              <ul className="list-disc ml-6 leading-[1.5] m-0 p-0">
                <li>
                  <p>
                    Fastwork Coin can be used without expiration date and can be
                    used together with other discount coupons.
                  </p>
                </li>
                <li>
                  <p>
                    Fastwork Coin cannot be redeemed for cash or transferred to
                    other Fastwork accounts.
                  </p>
                </li>
                <li>
                  <p>
                    When you top up Fastwork Coin into the system, it will be
                    considered as acceptance of all terms and conditions.
                  </p>
                </li>
                <li>
                  <p>
                    If you encounter any problems in topping up Fastwork Coin or
                    making payments, please contact{" "}
                    <Link
                      href="https://static.fastwork.co/contents/support-center"
                      className="text-third underline"
                    >
                      <span>the Support Center.</span>
                    </Link>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="grid-container-desktop w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#F6F7F8]">
        <div className="col-start-2 col-end-3 bg-white">
          <TopUpHistory />
        </div>
      </div>
    </div>
  );
};

export default FastworkCoin;
