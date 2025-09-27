
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';

interface PostIdDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  postId: string;
}

export function PostIdDialog({ isOpen, onOpenChange, postId }: PostIdDialogProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(postId).then(() => {
      toast({
        title: 'Post ID Copied!',
        description: 'The ID has been copied to your clipboard.',
      });
      onOpenChange(false);
    }).catch(err => {
      console.error("Failed to copy Post ID:", err);
      toast({
        title: "Failed to Copy",
        description: "Could not copy ID. Please select the text and copy manually.",
        variant: "destructive"
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post ID</DialogTitle>
          <DialogDescription>
            Use this ID for reporting issues or for copyright claims. Select the text to copy.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="post-id-input">Post ID</Label>
            <div className="flex gap-2">
                <Input
                id="post-id-input"
                value={postId}
                readOnly
                className="font-mono"
                />
                <Button onClick={handleCopy} size="icon" variant="outline">
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
