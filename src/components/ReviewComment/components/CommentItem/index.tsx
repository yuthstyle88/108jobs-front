
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Edit, Trash2 } from 'lucide-react';
import StarRating from '../StarRatings';
import CommentForm from '../CommentForm';

export interface Comment {
  id: string;
  username: string;
  avatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  isOwner?: boolean;
}

interface CommentItemProps {
  comment: Comment;
  onEdit: (id: string, data: { rating: number; comment: string }) => void;
  onDelete: (id: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (data: { rating: number; comment: string }) => {
    onEdit(comment.id, data);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      onDelete(comment.id);
    }
  };

  if (isEditing) {
    return (
      <CommentForm
        onSubmit={handleEdit}
        onCancel={() => setIsEditing(false)}
        initialData={{ rating: comment.rating, comment: comment.comment }}
        isEditing={true}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={comment.avatar} alt={comment.username} />
            <AvatarFallback>
              {comment.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-sm">{comment.username}</h4>
                <p className="text-xs text-muted-foreground">{comment.createdAt}</p>
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
            
            <p className="text-sm text-text_primary leading-relaxed">
              {comment.comment}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentItem;
