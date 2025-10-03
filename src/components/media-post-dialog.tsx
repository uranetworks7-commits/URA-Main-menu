
'use client';
import { useState, useEffect, useRef } from 'react';
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
import { AlertCircle, Upload, Loader2 } from 'lucide-react';
import { uploadFile } from '@/lib/file-upload';
import { useToast } from '@/hooks/use-toast';

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
  mediaUrl: z.string().url({ message: "Please upload a file to get a valid URL." }),
});

export function MediaPostDialog({ 
    isOpen, 
    onOpenChange, 
    mediaType, 
    initialContent, 
    onCreatePost,
    postLimitReached
}: MediaPostDialogProps) {
    
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
        const url = await uploadFile(file);
        form.setValue('mediaUrl', url, { shouldValidate: true });
        toast({
            title: "Upload Successful",
            description: "Your file has been uploaded and the URL is ready.",
        });
    } catch (error) {
        toast({
            title: "Upload Failed",
            description: "Could not upload the file. Please try again.",
            variant: "destructive",
        });
        form.setValue('mediaUrl', '');
    } finally {
        setIsUploading(false);
    }
  };


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
            Write your post and upload a file from your device.
          </DialogDescription>
        </DialogHeader>

        {postLimitReached ? (
           <Alert variant="destructive">
             <AlertCircle className="h-4 w-4" />
             <AlertTitle>Daily Post Limit Reached</AlertTitle>
             <AlertDescription>
                You can only create up to 2 posts per day. Please try again tomorrow.
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
                                <FormLabel>Your {mediaType}</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder={`Your ${mediaType} URL will appear here`}
                                            readOnly
                                            {...field}
                                        />
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                        >
                                            {isUploading ? (
                                                <Loader2 className="h-4 w-4 animate-spin"/>
                                            ) : (
                                                <Upload className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <input
                                          type="file"
                                          ref={fileInputRef}
                                          onChange={handleFileChange}
                                          className="hidden"
                                          accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={!form.formState.isValid || isUploading}>
                            {isUploading ? 'Uploading...' : 'Post'}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
