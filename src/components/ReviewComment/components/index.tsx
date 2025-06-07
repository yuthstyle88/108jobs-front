import { API_ROUTES } from "@/api/endpoints";
import Error from "@/app/error";
import Loading from "@/components/Loading";
import { usePrivateFetchParams } from "@/hooks/api-hooks";
import { useState } from "react";
import CommentForm from "./CommentForm";
import CommentItem, { Comment } from "./CommentItem";

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
  userId: string;
  rating: number;
};
const CommentSection = ({ userId, rating }: Props) => {
  const {
    data: reviewData,
    isLoading: isReviewLoading,
    error: errorReview,
  } = usePrivateFetchParams(
    `${API_ROUTES.profile.get_list_review}?profile_id=${userId}&page=1&limit=5`
  );
  console.log("Review Data:", reviewData,rating);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      username: "Nguyễn Văn A",
      avatar: "/placeholder.svg",
      rating: 4.5,
      comment:
        "Freelancer làm việc rất chuyên nghiệp, giao hàng đúng hạn và chất lượng tốt. Tôi sẽ tiếp tục hợp tác trong các dự án tiếp theo.",
      createdAt: "2 ngày trước",
      isOwner: true,
    },
    {
      id: "2",
      username: "Trần Thị B",
      avatar: "/placeholder.svg",
      rating: 5.0,
      comment:
        "Rất hài lòng với dịch vụ! Code clean, documentation đầy đủ và support rất tận tình.",
      createdAt: "1 tuần trước",
      isOwner: false,
    },
    {
      id: "3",
      username: "Lê Văn C",
      avatar: "/placeholder.svg",
      rating: 4.0,
      comment:
        "Làm việc ok, có một số điểm cần cải thiện nhưng nhìn chung là hài lòng.",
      createdAt: "2 tuần trước",
      isOwner: false,
    },
  ]);

  const handleAddComment = (data: { rating: number; comment: string }) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      username: "Người dùng hiện tại",
      rating: data.rating,
      comment: data.comment,
      createdAt: "Vừa xong",
      isOwner: true,
    };

    setComments([newComment, ...comments]);
  };

  const handleEditComment = (
    id: string,
    data: { rating: number; comment: string }
  ) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? { ...comment, rating: data.rating, comment: data.comment }
          : comment
      )
    );
  };

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  if (isReviewLoading) return <Loading />;
  if (errorReview) return <Error />;

  return (
    <div className="mx-auto space-y-6">
      <CommentForm onSubmit={handleAddComment} />
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="w-full flex items-center py-12 justify-center gap-2 ">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} filled={false} />
                ))}
              </div>
              <p className="text-[0.875rem] font-sans text-text_secondary text-center">
                Bắt đầu thuê freelancer này và đánh giá
              </p>
            </div>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
