'use client';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ThumbsUp, MessageSquare, Share2, DollarSign, Eye } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  imageHint?: string;
  stats: {
    likes: string;
    comments: string;
    views: string;
    revenue: string;
  };
}

interface PostCardProps {
  post: Post;
}

const parseCount = (countStr: string): number => {
    if (countStr.toLowerCase().endsWith('k')) {
      return parseFloat(countStr.slice(0, -1)) * 1000;
    }
    if (countStr.toLowerCase().endsWith('m')) {
      return parseFloat(countStr.slice(0, -1)) * 1000000;
    }
    return parseInt(countStr.replace(/,/g, ''), 10) || 0;
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


export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(parseCount(post.stats.likes));

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleComment = () => {
    // Placeholder for comment functionality
    alert('Comment functionality is not yet implemented.');
  };

  const handleShare = () => {
    // Placeholder for share functionality
    alert('Share functionality is not yet implemented.');
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-foreground">{post.user.name}</p>
            <p className="text-xs text-muted-foreground">Sponsored · Just now</p>
          </div>
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
          <span>{post.stats.comments} Comments</span>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.stats.views}</span>
          </div>
          <div className="flex items-center gap-1 text-green-500">
            <DollarSign className="h-4 w-4" />
            <span>{post.stats.revenue} Revenue</span>
          </div>
        </div>
      </div>
      <CardFooter className="p-0 border-t mx-4">
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
      </CardFooter>
    </Card>
  );
}
