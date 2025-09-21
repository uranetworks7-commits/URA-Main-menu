'use client';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ThumbsUp, MessageSquare, Share2, DollarSign, Eye, MoreHorizontal, CheckCircle, Trash2, Send, ShieldAlert, BadgeCheck, BarChart } from 'lucide-react';
import { useState, useMemo } from 'react';
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
import { UraIcon } from './ura-icon';
import { Input } from './ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ReportDialog } from './report-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


export interface User {
  id: string;
  name: string;
  avatar: string;
  isMonetized?: boolean;
  totalViews?: number;
  totalLikes?: number;
}
export interface Comment {
    id: string;
    user: User;
    text: string;
    createdAt: number;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  video?: string;
  imageHint?: string;
  likes: { [key: string]: boolean };
  comments: { [key: string]: Comment };
  views: number;
  createdAt: number;
}

interface PostCardProps {
  post: Post;
  currentUser: User;
  onDeletePost: (postId: string) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onReportPost: (postId: string, reason: string) => void;
}

const parseCount = (count: number | undefined): number => {
    if (typeof count === 'number') return count;
    return 0;
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

export function PostCard({ post, currentUser, onDeletePost, onLikePost, onAddComment, onReportPost }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  
  const likesCount = useMemo(() => Object.keys(post.likes || {}).length, [post.likes]);
  const isLiked = useMemo(() => currentUser && post.likes && post.likes[currentUser.id], [currentUser, post.likes]);

  const handleLike = () => {
    onLikePost(post.id);
  };
  
  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleShare = () => {
    alert('Share functionality is not yet implemented.');
  };
  
  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onAddComment(post.id, commentText);
      setCommentText('');
    }
  };
  
  const handleCodeReport = (code: string) => {
    if (code === '225') {
      onDeletePost(post.id);
      setIsReportDialogOpen(false);
      toast({
        title: "Post Reported and Deleted",
        description: "The post has been successfully reported and removed.",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "The report code you entered is incorrect.",
        variant: "destructive",
      });
    }
  };


  const isPublisher = post.user.id === currentUser.id;
  const viewsCount = parseCount(post.views);
  
  const isPostEligible = useMemo(() => viewsCount > 1000 && likesCount >= 5, [viewsCount, likesCount]);

  let revenue = 0;
  if (post.user.isMonetized) {
      revenue = (viewsCount / 1250) * 25;
  }
  
  const timeAgo = useMemo(() => {
    if (!post.createdAt) return 'just now';
    try {
      return formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
    } catch (e) {
      return 'just now'
    }
  }, [post.createdAt]);

  const sortedComments = useMemo(() => {
    if (!post.comments) return [];
    return Object.values(post.comments)
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [post.comments]);


  return (
    <Card>
      <CardHeader className="p-4">
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
            <p className="text-xs text-muted-foreground">Published · {timeAgo}</p>
          </div>
          <ReportDialog
            isOpen={isReportDialogOpen}
            onOpenChange={setIsReportDialogOpen}
            onTextReport={(reason) => onReportPost(post.id, reason)}
            onCodeReport={handleCodeReport}
          >
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
                 {isPostEligible && (
                    <DropdownMenuItem className="text-blue-500">
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      <span>Eligible for Monetization</span>
                    </DropdownMenuItem>
                 )}
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>{formatCount(viewsCount)} Views</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  <span>{formatCount(likesCount)} Likes</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>{formatCount(sortedComments.length)} Comments</span>
                </DropdownMenuItem>
                {isPublisher && post.user.isMonetized && (
                   <DropdownMenuItem disabled className="text-green-500">
                      <DollarSign className="mr-2 h-4 w-4" />
                      <span>₹{revenue.toFixed(2)} Revenue</span>
                   </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {isPublisher && (
                   <DropdownMenuItem onClick={() => router.push('/analytics')}>
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>View Analytics</span>
                  </DropdownMenuItem>
                )}
                {isPublisher && (
                    <DropdownMenuItem onClick={() => onDeletePost(post.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Post</span>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={() => setIsReportDialogOpen(true)} className="text-amber-500">
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  <span>Report Post</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ReportDialog>
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
       {post.video && (
          <div className="w-full bg-black">
              <video
                  src={post.video}
                  controls
                  className="w-full aspect-video"
              />
          </div>
        )}
      <div className="flex justify-between items-center text-xs text-muted-foreground p-2 px-4">
        <div className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3 text-primary" />
          <span>{formatCount(likesCount)}</span>
        </div>
        <div className="flex gap-4">
          <button onClick={handleToggleComments} className="hover:underline">
            {formatCount(sortedComments.length)} Comments
          </button>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{formatCount(viewsCount)}</span>
          </div>
          {isPublisher && post.user.isMonetized && (
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
          <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground font-semibold" onClick={handleToggleComments}>
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
                <div className="space-y-3 mb-4">
                    {sortedComments.length > 0 ? (
                        sortedComments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-2 text-xs">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={comment.user.avatar} />
                                    <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="bg-secondary rounded-lg p-2 w-full">
                                    <div className="flex justify-between">
                                      <p className="font-bold">{comment.user.name}</p>
                                      <p className="text-muted-foreground text-xs">
                                        {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'just now'}
                                      </p>
                                    </div>
                                    <p>{comment.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground">No comments yet.</p>
                    )}
                </div>
                 <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>
                        {currentUser.avatar ? currentUser.name.charAt(0) : <UraIcon className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <Input 
                      placeholder="Write a comment..."
                      className="bg-secondary border-none focus-visible:ring-0"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                    />
                    <Button size="icon" onClick={handleCommentSubmit} disabled={!commentText.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
