'use client';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ThumbsUp, MessageSquare, Share2, DollarSign, Eye, MoreHorizontal, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from './ui/separator';

export interface User {
  id: string;
  name: string;
  avatar: string;
}
export interface Comment {
    id: string;
    user: { name: string };
    text: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  imageHint?: string;
  stats: {
    likes: string;
    comments: string;
    views: string;
  };
  comments: Comment[];
}

interface PostCardProps {
  post: Post;
  currentUser: User;
}

const parseCount = (countStr: string): number => {
    if (!countStr) return 0;
    const lowerCaseStr = countStr.toLowerCase();
    if (lowerCaseStr.endsWith('k')) {
      return parseFloat(lowerCaseStr.slice(0, -1)) * 1000;
    }
    if (lowerCaseStr.endsWith('m')) {
      return parseFloat(lowerCaseStr.slice(0, -1)) * 1000000;
    }
    return parseInt(lowerCaseStr.replace(/,/g, ''), 10) || 0;
};

const formatCount = (count: number): string => {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (count >= 1000) {
        return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
};

export function PostCard({ post, currentUser }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(parseCount(post.stats.likes));
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleShare = () => {
    alert('Share functionality is not yet implemented.');
  };

  const isPublisher = post.user.id === currentUser.id;
  const viewsCount = parseCount(post.stats.views);
  
  let revenue = 0;
  if (isPublisher) {
      if (viewsCount > 1000 && viewsCount < 2000) {
          revenue = 25;
      }
      // Future revenue logic can be added here
  }

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-bold text-foreground">{post.user.name}</p>
            <p className="text-xs text-muted-foreground">Published · Just now</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Post Details</DropdownMenuLabel>
               <DropdownMenuItem>
                 <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                 <span>Published</span>
               </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Eye className="mr-2 h-4 w-4" />
                <span>{post.stats.views} Views</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <ThumbsUp className="mr-2 h-4 w-4" />
                <span>{formatCount(likes)} Likes</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>{post.stats.comments} Comments</span>
              </DropdownMenuItem>
              {isPublisher && revenue > 0 && (
                 <DropdownMenuItem disabled className="text-green-500">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>₹{revenue.toFixed(2)} Revenue</span>
                 </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-2">
        <p>{post.content}</p>
      </CardContent>
      {post.image && (
        <div className="relative w-full aspect-video bg-card">
           <Image 
            src={post.image} 
            alt="Post image" 
            fill
            className="object-cover"
            data-ai-hint={post.imageHint}
          />
        </div>
      )}
      <div className="flex justify-between items-center text-xs text-muted-foreground p-2 px-4">
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3 text-primary" />
          <span>{formatCount(likes)}</span>
        </div>
        <div className="flex gap-4">
          <button onClick={handleComment} className="hover:underline">
            {post.stats.comments} Comments
          </button>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.stats.views}</span>
          </div>
          {isPublisher && revenue > 0 && (
             <div className="flex items-center gap-1 text-green-500">
               <DollarSign className="h-4 w-4" />
               <span>₹{revenue.toFixed(2)} Revenue</span>
             </div>
          )}
        </div>
      </div>
      <CardFooter className="p-0 border-t mx-4 flex-col items-start">
        <div className="flex justify-around w-full">
          <Button variant="ghost" className={cn("flex-1 gap-2 font-semibold", isLiked ? "text-primary" : "text-muted-foreground")} onClick={handleLike}>
            <ThumbsUp className="h-5 w-5" /> Like
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold" onClick={handleComment}>
            <MessageSquare className="h-5 w-5" /> Comment
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold" onClick={handleShare}>
            <Share2 className="h-5 w-5" /> Share
          </Button>
        </div>
        {showComments && (
            <div className="w-full p-4 pt-2">
                <Separator className="mb-4" />
                <h4 className="text-sm font-semibold mb-2">Comments</h4>
                <div className="space-y-3">
                    {post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-2 text-xs">
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="bg-secondary rounded-lg p-2">
                                    <p className="font-bold">{comment.user.name}</p>
                                    <p>{comment.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground">No comments yet.</p>
                    )}
                </div>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
