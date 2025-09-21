'use client';
import { UserCircle, Video, Image as ImageIcon, Smile } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

export function CreatePost() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <UserCircle className="h-10 w-10 text-muted-foreground" />
          <Button variant="outline" className="flex-1 justify-start rounded-full bg-secondary h-10 text-muted-foreground hover:bg-muted">
            What's on your mind?
          </Button>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-around">
          <Button variant="ghost" className="flex-1 gap-2">
            <Video className="h-6 w-6 text-red-500" /> Live video
          </Button>
          <Button variant="ghost" className="flex-1 gap-2">
            <ImageIcon className="h-6 w-6 text-green-500" /> Photo/video
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 hidden sm:flex">
            <Smile className="h-6 w-6 text-yellow-500" /> Feeling/activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
