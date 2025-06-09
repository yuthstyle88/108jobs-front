import LoadingCircle from "@/components/LoadingCircle";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import React from "react";
import { useForm } from "react-hook-form";
import StarRating from "../StarRatings";

interface CommentFormData {
  rating: number;
  content: string;
}

interface CommentFormProps {
  onSubmit: (data: CommentFormData) => void;
  onCancel?: () => void;
  initialData?: CommentFormData;
  isEditing?: boolean;
  isPostMutating?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  isPostMutating,
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
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    defaultValues: {
      rating: initialData?.rating || 0,
      content: initialData?.content || "",
    },
  });

  const currentRating = watch("rating");

  const handleFormSubmit = async (data: CommentFormData) => {
    try {
      await onSubmit(data);
      if (!isEditing) reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "An error occurred.";
      setError("content", { type: "manual", message });
    }
  };

  const handleRatingChange = (rating: number) => {
    setValue("rating", rating);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {isEditing ? "Edit review" : "Add new review"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Your review
            </label>
            <StarRating
              rating={currentRating}
              onRatingChange={handleRatingChange}
              size={24}
            />
            <input
              type="hidden"
              {...register("rating", {
                required: "Please select star rating",
                min: { value: 0.5, message: "Minimum rating is 1 star " },
              })}
            />
            {errors.rating && (
              <p className="text-sm text-red-600 mt-1">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Comment</label>
            <Textarea
              {...register("content", {
                required: "Please enter a comment",
                minLength: {
                  value: 10,
                  message: "Comments must be at least 10 characters long",
                },
              })}
              placeholder="Share your experience with this freelancer..."
              rows={4}
              className="resize-none"
            />
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">
                {errors.content.message}
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
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || isPostMutating}
              className="flex-1"
            >
              {isSubmitting || isPostMutating ? (
                <LoadingCircle />
              ) : isEditing ? (
                "Update"
              ) : (
                "Submit a review"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommentForm;
