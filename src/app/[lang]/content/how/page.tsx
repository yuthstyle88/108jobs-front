"use client";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import { AssetIcon, ContentIcon } from "@/constants/icons";
import { LanguageFile } from "@/constants/language";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const EMPLOYERS = [
  {
    id: 1,
    title: "Choose a service that you want.",
    description:
      "Discover and choose freelancers from the following categories:",
    list: [
      "Graphic & Design",
      "Marketing and Advertising",
      "Writing and Translation",
      "Photography Video",
      "Web & Programming",
      "Consultant",
      "Lifestyle",
    ],
  },
  {
    id: 2,
    title: "Discuss work details with freelancers.",
    description: "Discuss your work scope",
    list: [
      "You can talk to freelancers for details and price of work",
      "If the details of employment have been agreed, Freelancers will send you a quote.",
      "The system does not allow you to send LINE, phone number, email before payment",
    ],
  },
  {
    id: 3,
    title: "Make a payment via system",
    description:
      "The system works as a mediator holding your money until a freelance completes his job.",
    list: [
      "Verify hiring detail in quotation",
      "You can make payment via Fastjob by the following methods:",
      "Scan promptpay QR code",
      "Credit Card",
      "Fastjob Coin",
      "TrueMoney Wallet",
      "After payment successfully, you can exchange the personal contact info.",
    ],
  },
  {
    id: 4,
    title: "Wait for the freelancer to turn in your work.",
    description: "Check out the delivered final work by freelancers.",
    list: [
      "Click approve work, If submitted final work is matched with quotation agreement",
      "Freelancer will get cash credit only after you approved work",
      "Freelance work will be approved by the system within 7 days. If you do not review or submit a request to modify the work.",
      "You can reject the final work and allow freelancers to edit their work. This depends on the agreement of both parties.",
      "You can sue for the work. If the freelancer is not working as promised.",
    ],
  },
  {
    id: 5,
    title: "Rate and Review",
    description: "To develop fastwork's community",
    list: [
      "Rate and Review buyer for the benefit of other freelancers",
      "Rate and review your satisfaction with Fastjob system to improve the service even further",
    ],
  },
];

const SELLERS = [
  {
    id: 1,
    title: "Post your work on Fastjob to present your ability to buyer",
    description: "Post your service under the following categories:",
    list: [
      "Graphic & Design",
      "Marketing and Advertising",
      "Writing and Translation",
      "Photography Video",
      "Web & Programming",
      "Consultant",
      "Lifestyle",
    ],
  },
  {
    id: 2,
    title: "Discuss work details with freelancers and create quotation",
    description: "Discuss the details and brief the job with the buyer.",
    list: [
      "Discuss on work details and send a quote to buyer",
      "The system does not allow you to send LINE, phone number, email before payment",
    ],
  },
  {
    id: 3,
    title: "Wait for client payment",
    description: "Client must pay via system before you start working.",
    list: [
      "System will notify once payment is complete",
      "Work only after receiving confirmation",
    ],
  },
  {
    id: 4,
    title: "Deliver the final work",
    description: "Submit work via system and wait for client approval.",
    list: [
      "Client can approve or request revisions",
      "You’ll receive credit after client approval or after 7 days",
    ],
  },
  {
    id: 5,
    title: "Get paid and receive feedback",
    description: "Build your reputation with great reviews.",
    list: [
      "Withdraw earnings via supported methods",
      "Encourage client to leave a review",
    ],
  },
];

const HowSellAndBuy = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const {
    data: couponLanguageData,
    isLoading,
    error,
  } = useGlobalTranslate(LanguageFile.COUPON);

  const tabs = [
    {
      name: couponLanguageData?.tabForHiring,
      content: couponLanguageData?.messageNoOffers,
    },
    {
      name: couponLanguageData?.tabForFreelancers,
      content: couponLanguageData?.messageNoOffers,
    },
  ];

  const currentSteps = selectedTab === 0 ? EMPLOYERS : SELLERS;

  if (isLoading) return <Loading />;
  if (error) return <Error/>;
  return (
    <>
      <main>
        <section
          className="flex items-center justify-center w-full h-[200px] relative overflow-hidden"
          style={{ background: "linear-gradient(282deg, #27c8f8, #1850c2)" }}
        >
          <div className="px-[1.5rem] relative">
            <div className="text-center text-white">
              <h1 className="text-[28px]">How to buy/sell on Fastjob?</h1>
              <p className="text-[16px]">
                Number one, freelance market-place website.
              </p>
            </div>
          </div>
          <div className="absolute right-[-100px] bottom-[150px] h-[150px] ml-auto opacity-30 pointer-events-none">
            <Image
              src={AssetIcon.logoIcon}
              alt="Logo"
              width={350}
              height={350}
            />
          </div>
        </section>
        <section className="py-24 grid grid-container-desktop-banner pt-[4rem]">
          <div className="col-start-2 col-end-3">
            <div className="text-center w-full">
              <h1 className="font-sans text-[1.5rem] text-text-primary font-semibold mb-12">
                Easy steps to get started with Fastjob
              </h1>
            </div>
          </div>
          <div className="col-start-2 col-end-3 flex flex-row items-start gap-6 p-4 md:p-0">
            <div className="hidden xl:block sticky top-4">
              <Image
                src={selectedTab === 0 ? ContentIcon.buyer : ContentIcon.seller}
                alt="Seller Icon"
                width={500}
                height={500}
                className="max-w-full w-[500px]"
              />
            </div>
            <div className="z-10 relative flex-1 ">
              <div className="flex items-center md:items-start border-b border-gray-300">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`${
                      selectedTab === index
                        ? "border-b-2 border-blue-500 text-blue-500 flex-1 md:block"
                        : "text-gray-500 flex-1 md:block"
                    } py-2 px-4 text-lg font-medium`}
                    onClick={() => setSelectedTab(index)}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
              <div className="mt-6 gap-6 grid grid-cols-1 ">
                {currentSteps.map((item, index) => (
                  <div
                    key={`${item.id}` + `${index}`}
                    className="shadow-how-shadow border-1 border-borderSecondary rounded-xl bg-white p-6"
                  >
                    <div className="flex items-center flex-row gap-3">
                      <div className="w-8 flex justify-center items-center h-8 text-[1.25rem] text-white bg-third rounded-full">
                        {item.id}
                      </div>
                      <p className="text-[1.25rem] font-semibold flex-1 font-sans text-text-primary">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-[0.875rem] mt-3 text-text-secondary ">
                      {item.description}
                    </p>
                    <ul className="pl-6 mt-2 list-disc gap-2 text-[0.875rem] text-text-secondary grid grid-cols-1">
                      {item.list.map((list, index) => (
                        <li key={index}>{list}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-start-2 col-end-3 mt-12 block md:flex justify-end items-end px-4 md:px-0">
            {selectedTab === 0 ? (
              <Link prefetch={false} href="/" className="">
                <button className="submit-button-custom py-2 px-4 w-full md:w-fit flex flex-row justify-center md:justify-start gap-2">
                  <p>Choose a service that you want.</p>
                  <ArrowRight className="w-5" />
                </button>
              </Link>
            ) : (
              <Link prefetch={false} href="/start-selling" className="">
                <button className="submit-button-custom py-2 px-4 w-full md:w-fit flex flex-row justify-center md:justify-start gap-2">
                  <p>Register to be a Freelancer.</p>
                  <ArrowRight className="w-5" />
                </button>
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default HowSellAndBuy;
