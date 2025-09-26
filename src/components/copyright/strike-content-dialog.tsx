
'use client';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CopyrightStrike } from '@/lib/types';
import { Badge } from '../ui/badge';
import { FileWarning } from 'lucide-react';

interface StrikeContentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  strike: CopyrightStrike;
}

export function StrikeContentDialog({ isOpen, onOpenChange, strike }: StrikeContentDialogProps) {
  if (!strike) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Copyrighted Content</DialogTitle>
          <DialogDescription>
            This is the content associated with the strike you received from {strike.claimantName}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 rounded-lg border p-4">
            
            <p className="text-sm bg-secondary p-3 rounded-md break-words">
                <span className="font-bold text-muted-foreground">Post Text: </span>
                {strike.postContent}
            </p>

            {strike.imageUrl && (
                <div className="relative w-full aspect-video bg-card rounded-md overflow-hidden">
                <Image 
                    src={strike.imageUrl} 
                    alt="Copyrighted image" 
                    fill
                    className="object-cover"
                />
                </div>
            )}
            {strike.videoUrl && (
                <div className="w-full bg-black rounded-md overflow-hidden">
                    <video
                        src={strike.videoUrl}
                        controls
                        muted
                        className="w-full aspect-video"
                    />
                </div>
            )}

            {!strike.imageUrl && !strike.videoUrl && (
                 <div className="text-center py-6 text-muted-foreground">
                    <FileWarning className="mx-auto h-8 w-8 mb-2" />
                    <p>No media was attached to this strike.</p>
                </div>
            )}
            <Badge variant="destructive" className="w-full justify-center">This content was removed from the platform.</Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}
