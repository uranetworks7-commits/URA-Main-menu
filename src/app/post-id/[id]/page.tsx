
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Copy } from 'lucide-react';

export default function PostIdPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const postId = params.id as string;

    const handleCopy = () => {
        if (!postId) return;
        navigator.clipboard.writeText(postId).then(() => {
            toast({ title: "Post ID Copied!", description: "The ID has been copied to your clipboard." });
        }).catch(err => {
            // This might fail in sandboxed environments like iframes without permission
            console.error("Failed to copy Post ID:", err);
            toast({ title: "Failed to Copy", description: "Could not copy ID. This may be due to browser security settings.", variant: "destructive" });
        });
    };

    if (!postId) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Card className="w-full max-w-md m-4">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>Post ID not found.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Card className="w-full max-w-md m-4">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <CardTitle>Post ID</CardTitle>
                                <CardDescription>Use this ID for copyright claims.</CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-secondary rounded-md font-mono text-sm break-all">
                        {postId}
                    </div>
                    <Button onClick={handleCopy} className="w-full">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy ID
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
