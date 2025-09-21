'use client';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ThumbsUp, MessageSquare, Share2, DollarSign, Eye } from 'lucide-react';

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

export function PostCard({ post }: PostCardProps) {
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
          <span>{post.stats.likes}</span>
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
          <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold">
            <ThumbsUp className="h-5 w-5" /> Like
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold">
            <MessageSquare className="h-5 w-5" /> Comment
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold">
            <Share2 className="h-5 w-5" /> Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
