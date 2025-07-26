"use client";
import { API_ROUTES } from "@/api/endpoints";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import {
  usePrivateFetchParams,
  usePrivatePost
} from "@/hooks/api-hooks";
import useNotification from "@/hooks/useNotification";
import { ReviewResponse } from "lemmy-js-client";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

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
  profileId: string;
};
const CommentSection = ({ profileId }: Props) => {

  const { successMessage } = useNotification();
  const {
    data: reviewData,
    isLoading: isReviewLoading,
    error: errorReview,
    mutate: mutateReviews,
  } = usePrivateFetchParams<ReviewResponse>(
    `${API_ROUTES.profile.getListReview}?profileId=${profileId}&page=1&limit=5`
  );


  const { trigger: postComment, isMutating: isPostMutating } = usePrivatePost(
    API_ROUTES.profile.commentReview
  );

  const handleSubmitComment = async (data: {
    rating: number;
    content: string;
  }) => {
    await postComment({ profileId: profileId, ...data });
    successMessage("review", "postComment");
    mutateReviews();
  };

  if (isReviewLoading) return <Loading />;
  if (errorReview) return <Error />;

  return (
    <div className="mx-auto space-y-6">
      <CommentForm
        onSubmit={handleSubmitComment}
        isPostMutating={isPostMutating}
      />
      <div className="space-y-4">
        {reviewData?.reviews.length === 0 ? (
          <div className="w-full flex items-center py-12 justify-center gap-2 ">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} filled={false} />
                ))}
              </div>
              <p className="text-[0.875rem] font-sans text-text-secondary text-center">
                Start hiring this freelancer and rate
              </p>
            </div>
          </div>
        ) : (
          reviewData?.reviews.map((review) => (
            <CommentItem
              key={review.id}
              comment={review}
              mutate={mutateReviews}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
