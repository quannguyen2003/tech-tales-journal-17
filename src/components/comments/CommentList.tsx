
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate, Comment, deleteComment } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CommentListProps {
  comments: Comment[];
  onCommentDeleted: () => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onCommentDeleted }) => {
  const { user } = useAuth();

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      await deleteComment(commentId);
      onCommentDeleted();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  if (comments.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
            <AvatarFallback>{comment.authorName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{comment.authorName}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              {user && user.id === comment.authorId && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteComment(comment.id)}
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                >
                  Delete
                </Button>
              )}
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
