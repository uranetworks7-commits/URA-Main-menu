'use client';
import { useState } from 'react';
import { Video, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import type { User } from './post-card';
import { UraIcon } from './ura-icon';


interface CreatePostProps {
  onCreatePost: (content: string) => void;
  currentUser: User;
}

export function CreatePost({ onCreatePost, currentUser }: CreatePostProps) {
  const [postContent, setPostContent] = useState('');

  const handlePost = () => {
    if (postContent.trim()) {
      onCreatePost(postContent);
      setPostContent('');
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>
                {currentUser.avatar ? currentUser.name.charAt(0) : <UraIcon className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>
          <div className="w-full">
            <Textarea
              placeholder="What's on your mind?"
              className="bg-secondary border-none focus-visible:ring-0 text-base"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1 gap-2">
                <Video className="h-6 w-6 text-red-500" /> Live
            </Button>
            <Button variant="ghost" className="flex-1 gap-2">
                <ImageIcon className="h-6 w-6 text-green-500" /> Photo
            </Button>
             <Button variant="ghost" className="flex-1 gap-2">
                <ImageIcon className="h-6 w-6 text-blue-500" /> Video
            </Button>
          </div>
          <Button onClick={handlePost} disabled={!postContent.trim()}>
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
