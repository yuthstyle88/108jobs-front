import { JobDetailLanguage } from "@/types/language";

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className={`w-5 h-5 ${filled ? "text-[#E9B10C]" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon key={star} filled={star <= rating} />
      ))}
    </div>
  );
};

type Props = {
  language: Partial<JobDetailLanguage> | undefined | null;
};

const ReviewCard = ({ language }: Props) => {
  return (
    <div className="grid grid-cols-[1fr] gap-y-6">
      <h2 className="text-[1.25rem] text-third font-medium">
        {language?.reviews_from_employers} (921)
      </h2>
      <div className="mx-auto bg-white rounded-xl shadow-sm p-2 md:p-6">
        <div className="flex items-center gap-8 justify-between mb-6">
          <div className="flex flex-col gap-2 items-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
              <span className="text-[24px] md:text-4xl font-bold text-blue-600">4.9</span>
            </div>
            <span className="text-gray-500 text-[12px] md:text-sm ml-2">จาก 5</span>
          </div>
          <div className="flex-1 w-full lg:mx-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-700 text-sm sm:text-base">{language?.response_speed}</span>
                <RatingStars rating={5} />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-700 text-sm sm:text-base">{language?.friendly_and_expert}</span>
                <RatingStars rating={5} />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-700 text-sm sm:text-base">{language?.service_provision}</span>
                <RatingStars rating={5} />
              </div>
              <div className="flex items-center gap-2 justify-between">
                <span className="text-gray-700 text-sm sm:text-base">{language?.value_for_money}</span>
                <RatingStars rating={5} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              id: 1,
              name: "***** (ไม่เปิดเผยชื่อ)",
              date: "18/02/2025",
              rating: 5.0,
            },
            {
              id: 2,
              name: "jfkkfdff",
              date: "18/02/2025",
              rating: 5.0,
            },
          ].map((review) => (
            <div
              key={review.id}
              className="flex items-center justify-between py-4 border-t"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-500"
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
                <div>
                  <div className="font-medium text-gray-900">{review.name}</div>
                  <div className="text-sm text-gray-500">{review.date}</div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <StarIcon filled={true} />
                <span className="font-medium text-text_primary">
                  {review.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
