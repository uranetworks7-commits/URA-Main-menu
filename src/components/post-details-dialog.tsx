'use client';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { UraIcon } from './ura-icon';
import type { Post, User } from './post-card';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, MessageSquare, Eye, DollarSign, BadgeCheck } from 'lucide-react';
import { useMemo } from 'react';
import { Separator } from './ui/separator';

interface PostDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  post: Post;
  currentUser: User;
}

const formatCount = (count: number): string => {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (count >= 1000) {
        return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
};


export function PostDetailsDialog({ isOpen, onOpenChange, post, currentUser }: PostDetailsDialogProps) {
    if (!post) return null;

    const likesCount = useMemo(() => Object.keys(post.likes || {}).length, [post.likes]);
    const commentsCount = useMemo(() => Object.keys(post.comments || {}).length, [post.comments]);
    const viewsCount = post.views || 0;

    let revenue = 0;
    if (post.user.isMonetized) {
      if (post.video) {
        revenue = (viewsCount / 1250) * 25;
      } else if (post.image) {
        revenue = (viewsCount / 1250) * 15;
      } else {
        revenue = (viewsCount / 1250) * 10;
      }
    }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Post Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
             <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={post.user.avatar} alt={post.user.name} />
                    <AvatarFallback>
                        {post.user.avatar ? post.user.name.charAt(0) : <UraIcon className="h-6 w-6" />}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-1">
                        <p className="font-bold text-foreground">{post.user.name}</p>
                        {post.user.isMonetized && <BadgeCheck className="h-5 w-5 text-blue-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'just now'}
                    </p>
                </div>
            </div>

            <p className="text-sm break-words">{post.content}</p>

            {post.image && (
                <div className="relative w-full aspect-video bg-card rounded-md overflow-hidden">
                <Image 
                    src={post.image} 
                    alt="Post image" 
                    fill
                    className="object-cover"
                    data-ai-hint={post.imageHint}
                />
                </div>
            )}
            {post.video && (
                <div className="w-full bg-black rounded-md overflow-hidden">
                    <video
                        src={post.video}
                        controls
                        muted
                        className="w-full aspect-video"
                    />
                </div>
            )}

            <Separator />
            
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center justify-center p-2 rounded-md bg-secondary">
                    <Eye className="h-5 w-5 mb-1 text-muted-foreground" />
                    <p className="font-bold text-lg">{formatCount(viewsCount)}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-md bg-secondary">
                    <ThumbsUp className="h-5 w-5 mb-1 text-muted-foreground" />
                    <p className="font-bold text-lg">{formatCount(likesCount)}</p>
                    <p className="text-xs text-muted-foreground">Likes</p>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-md bg-secondary">
                    <MessageSquare className="h-5 w-5 mb-1 text-muted-foreground" />
                    <p className="font-bold text-lg">{formatCount(commentsCount)}</p>
                    <p className="text-xs text-muted-foreground">Comments</p>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-md bg-secondary">
                    <DollarSign className="h-5 w-5 mb-1 text-green-500" />
                    <p className="font-bold text-lg text-green-500">₹{revenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
