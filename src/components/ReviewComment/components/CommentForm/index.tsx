import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import React from "react";
import { useForm } from "react-hook-form";
import StarRating from "../StarRatings";

interface CommentFormData {
  rating: number;
  comment: string;
}

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => void;
  onCancel?: () => void;
  initialData?: CommentFormData;
  isEditing?: boolean;
}



const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    defaultValues: {
      rating: initialData?.rating || 0,
      comment: initialData?.comment || "",
    },
  });

  const currentRating = watch("rating");

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating);
  };

  const handleFormSubmit = (data: CommentFormData) => {
    onSubmit(data);
    if (!isEditing) {
      reset(); 
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {isEditing ? "Chỉnh sửa đánh giá" : "Thêm đánh giá mới"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Đánh giá của bạn
            </label>
            <StarRating
              rating={currentRating}
              onRatingChange={handleRatingChange}
              size={24}
            />
            {errors.rating && (
              <p className="text-sm text-red-600 mt-1">
                Vui lòng chọn số sao đánh giá
              </p>
            )}
            <input
              type="hidden"
              {...register("rating", {
                required: "Vui lòng chọn số sao đánh giá",
                min: { value: 0.5, message: "Đánh giá tối thiểu là 0.5 sao" },
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Nhận xét</label>
            <Textarea
              {...register("comment", {
                required: "Vui lòng nhập nhận xét",
                minLength: {
                  value: 10,
                  message: "Nhận xét phải có ít nhất 10 ký tự",
                },
              })}
              placeholder="Chia sẻ trải nghiệm của bạn về freelancer này..."
              rows={4}
              className="resize-none"
            />
            {errors.comment && (
              <p className="text-sm text-red-600 mt-1">
                {errors.comment.message}
              </p>
            )}
          </div>

          <div className="flex space-x-2">
            {isEditing && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Hủy
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting
                ? "Đang gửi..."
                : isEditing
                ? "Cập nhật"
                : "Gửi đánh giá"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommentForm;
