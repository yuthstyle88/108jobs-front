"use client";
import { API_ROUTES } from "@/api/endpoints";
import CommentSection from "@/components/ReviewComment/components";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { JobDetailResponse } from "@/types/jobDetail";
import { JobDetailLanguage } from "@/types/language";
import { ReviewResponse } from "@/types/review";
import { Coins, Handshake, MessageCircleReply, ShoppingBag } from "lucide-react";
// import { useSession } from "next-auth/react";
import Link from "next/link";
import {useSessionContext} from "@/contexts/SessionContext";

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-5 h-5 ${filled ? "text-[#E9B10C]" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

type Props = {
  language: Partial<JobDetailLanguage> | undefined | null;
  data: JobDetailResponse;
};

const ReviewCard = ({ language, data }: Props) => {
  // const { data: session } = useSession();
  const { session } = useSessionContext();
  const {
    data: reviewData,
  } = usePrivateFetchParams<ReviewResponse>(
    `${API_ROUTES.profile.get_list_review}?profile_id=${data.user.profile_id}`
  );


  return (
    <div className="grid grid-cols-[1fr] gap-y-6 pb-10">
      <h2 className="text-[1.25rem] text-third font-medium">
        {language?.reviews_from_employers}
        {` (${reviewData?.reviews.length})`}
      </h2>
      <div className="bg-white rounded-xl shadow-sm p-2 md:p-6">
        <div className="flex items-center gap-8 justify-between mb-6">
          <div className="flex flex-col gap-2 items-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
              <span className="text-[24px] md:text-4xl font-bold text-blue-600">
                {Number(data.rating).toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500 text-[12px] md:text-sm ml-2">
              จาก 5
            </span>
          </div>
          <div className="flex-1 w-full lg:mx-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MessageCircleReply className="w-[20px] h-[20px] text-text_primary"/>
                <span className="text-gray-700 text-sm sm:text-base">
                  {language?.response_speed}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Handshake className="w-[20px] h-[20px] text-text_primary"/>
                <span className="text-gray-700 text-sm sm:text-base">
                  {language?.friendly_and_expert}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-[20px] h-[20px] text-text_primary"/>
                <span className="text-gray-700 text-sm sm:text-base">
                  {language?.service_provision}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-[20px] h-[20px] text-text_primary"/>
                <span className="text-gray-700 text-sm sm:text-base">
                  {language?.value_for_money}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {session ? (
        <div className="px-4 py-8">
          <CommentSection profileId={data.user.profile_id} />
        </div>
      ) : (
        <div className="w-full flex items-center py-12 justify-center gap-2 ">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={false} />
              ))}
            </div>
            <div className="text-[0.875rem] font-sans text-text_secondary text-center">
              Vui lòng{" "}
              <Link prefetch={false} href="/login" className="text-third underline">
                đăng nhập
              </Link>{" "}
              để đánh giá
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
