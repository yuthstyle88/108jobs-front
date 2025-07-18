import { API_ROUTES } from "@/api/endpoints";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrivateDelete, usePrivatePut } from "@/hooks/api-hooks";
import useNotification from "@/hooks/useNotification";
import { Review } from "@/types/review";
import { formatDistanceToNow, Locale } from "date-fns";
import { enUS, th, vi } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";
import CommentForm from "../CommentForm";
import StarRating from "../StarRatings";

export const dateFnsLocaleMap: Record<string, Locale> = {
  en: enUS,
  vi: vi,
  th: th,
};

interface CommentItemProps {
  comment: Review;
  mutate: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, mutate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { successMessage } = useNotification();
  const { lang: currentLang } = useLanguage();
  const locale = dateFnsLocaleMap[currentLang] || dateFnsLocaleMap["en"];

  const { trigger: updateComment, isMutating: isUpdating } = usePrivatePut(
    `${API_ROUTES.profile.commentReview}/${comment.id}`
  );

  const { trigger: deleteComment, isMutating: isDeleting } = usePrivateDelete(
    `${API_ROUTES.profile.commentReview}/${comment.id}`
  );

  const handleEdit = async (data: { rating: number; content: string }) => {
    await updateComment(data);
    await mutate();
    successMessage("review", "updateComment");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this review?")) {
      await deleteComment({});
      await mutate();
      successMessage("review", "deleteComment");
    }
  };

  if (isEditing) {
    return (
      <CommentForm
        onSubmit={handleEdit}
        onCancel={() => setIsEditing(false)}
        initialData={{ rating: comment.rating, content: comment.content }}
        isEditing={true}
        isPostMutating={isUpdating}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={comment.reviewerAvatar}
              alt={comment.reviewerName}
            />
            <AvatarFallback>
              {comment.reviewerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-sm">
                  {comment.reviewerName}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: locale,
                  })}
                </p>
              </div>
              {comment.isOwner && (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              )}
            </div>

            <div className="mb-3">
              <StarRating rating={comment.rating} readonly size={16} />
            </div>

            <p className="text-sm text-text-primary leading-relaxed">
              {comment.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentItem;
