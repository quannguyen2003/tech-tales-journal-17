
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { createComment } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const formSchema = z.object({
  content: z.string().min(2, 'Comment must be at least 2 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface CommentFormProps {
  articleId: string;
  parentId?: string;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ articleId, parentId, onCommentAdded }) => {
  const { user, isAuthenticated } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to comment');
      return;
    }

    try {
      await createComment({
        content: values.content,
        articleId,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
        parentId,
      });
      
      form.reset();
      onCommentAdded();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-muted p-4 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">Please log in to join the conversation.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Add a comment..." 
                  {...field} 
                  className="min-h-[80px] resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm">Post Comment</Button>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
