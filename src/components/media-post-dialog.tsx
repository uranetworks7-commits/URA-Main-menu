'use client';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface MediaPostDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    mediaType?: 'image' | 'video';
    initialContent: string;
    onCreatePost: (content: string, url: string) => void;
    postLimitReached: boolean;
}

const formSchema = z.object({
  content: z.string().min(1, { message: "Post content cannot be empty." }),
  mediaUrl: z.string().url({ message: "Please enter a valid URL." }),
});

export function MediaPostDialog({ 
    isOpen, 
    onOpenChange, 
    mediaType, 
    initialContent, 
    onCreatePost,
    postLimitReached
}: MediaPostDialogProps) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialContent,
      mediaUrl: "",
    },
  });
  
  useEffect(() => {
    form.setValue('content', initialContent);
  }, [initialContent, form]);

  useEffect(() => {
    if (!isOpen) {
      form.reset({ content: initialContent, mediaUrl: '' });
    }
  }, [isOpen, form, initialContent]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    onCreatePost(values.content, values.mediaUrl);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create {mediaType === 'image' ? 'Image' : 'Video'} Post</DialogTitle>
          <DialogDescription>
            Write your post and provide a URL for your {mediaType}.
          </DialogDescription>
        </DialogHeader>

        {postLimitReached ? (
           <Alert variant="destructive">
             <AlertCircle className="h-4 w-4" />
             <AlertTitle>Daily Post Limit Reached</AlertTitle>
             <AlertDescription>
                You can only create one post per day. Please try again tomorrow.
             </AlertDescription>
           </Alert>
        ) : (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Post Content</FormLabel>
                                <FormControl>
                                <Textarea placeholder="What's on your mind?" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mediaUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{mediaType === 'image' ? 'Image' : 'Video'} URL</FormLabel>
                                <FormControl>
                                <Input placeholder={`https://example.com/your-${mediaType}.jpg`} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Post</Button>
                    </DialogFooter>
                </form>
            </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
