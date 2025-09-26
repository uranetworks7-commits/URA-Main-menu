
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TriangleAlert, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';
import { ref, push, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface CtrRequestDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    currentUser: User;
    users: { [key: string]: User };
}

const ctrFormSchema = z.object({
    postId: z.string().min(5, { message: "A valid Post ID is required." }),
    accusedUsername: z.string().min(1, "You must enter the username you are accusing."),
    action: z.enum(['delete_only', 'delete_and_strike'], {
        required_error: "You must select an action."
    }),
    originalContentUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    signature: z.string().min(3, "A signature is required."),
});

function SuccessAnimation() {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <svg className="h-24 w-24 text-green-500 mb-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="283" strokeDashoffset="283" className="animate-draw-circle" style={{ animation: 'draw-circle 1s ease-out forwards' }} />
                <path d="M30 50 L45 65 L70 40" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" className="animate-draw-check" style={{ animation: 'draw-check 0.5s ease-out 0.8s forwards' }} />
            </svg>
            <h3 className="text-xl font-bold">Success!</h3>
            <p className="text-muted-foreground">Your CTR has been submitted for review.</p>
        </div>
    )
}

export function CtrRequestDialog({ isOpen, onOpenChange, currentUser, users }: CtrRequestDialogProps) {
    const [step, setStep] = useState<'warn' | 'form' | 'processing' | 'success'>('warn');
    const { toast } = useToast();

    const form = useForm<z.infer<typeof ctrFormSchema>>({
        resolver: zodResolver(ctrFormSchema),
        defaultValues: {
            postId: "",
            accusedUsername: "",
            originalContentUrl: "",
            signature: "",
        },
    });

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setStep('warn');
            form.reset();
        }, 300);
    };

    async function onSubmit(values: z.infer<typeof ctrFormSchema>) {
        setStep('processing');
        try {
            const accusedUserEntry = Object.entries(users).find(([id, user]) => user.name === values.accusedUsername);

            if (!accusedUserEntry) {
                toast({ title: "User Not Found", description: `Could not find a user with the username "${values.accusedUsername}".`, variant: "destructive" });
                setStep('form');
                return;
            }

            const [accusedUserId, accusedUser] = accusedUserEntry;

            const claimRef = push(ref(db, 'copyrightClaims'));
            const claimId = claimRef.key;
            if (!claimId) throw new Error("Could not generate claim ID");

            const newClaim = {
                id: claimId,
                claimantId: currentUser.id,
                claimantName: currentUser.name,
                claimantSignature: values.signature,
                accusedUserId: accusedUserId,
                accusedUsername: accusedUser.name,
                postId: values.postId,
                action: values.action,
                originalContentUrl: values.originalContentUrl || '',
                date: Date.now(),
                status: 'pending' as const,
            };

            const updates: { [key: string]: any } = {};
            updates[`/copyrightClaims/${claimId}`] = newClaim;
            updates[`/users/${currentUser.id}/submittedClaims/${claimId}`] = newClaim;

            await update(ref(db), updates);
            
            setStep('success');

        } catch (error) {
            console.error("Failed to submit claim:", error);
            toast({ title: "Submission Failed", description: "Could not submit your claim. Please try again.", variant: "destructive" });
            setStep('form');
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-w-md">
                {step !== 'success' && (
                    <DialogHeader>
                        <DialogTitle>Copyright Takedown Request (CTR)</DialogTitle>
                    </DialogHeader>
                )}

                {step === 'warn' && (
                    <>
                        <Alert variant="destructive">
                            <TriangleAlert className="h-4 w-4" />
                            <AlertTitle>Warning!</AlertTitle>
                            <AlertDescription>
                                Submitting fraudulent copyright claims is a violation of our terms of service. Accounts found to be abusing this system may be terminated permanently.
                            </AlertDescription>
                        </Alert>
                        <DialogFooter>
                            <Button variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button onClick={() => setStep('form')}>I Understand, Continue</Button>
                        </DialogFooter>
                    </>
                )}

                {step === 'form' && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="accusedUsername"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Accused User's Username</FormLabel>
                                        <FormControl><Input placeholder="Enter the username you are accusing" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="postId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Infringing Post ID</FormLabel>
                                        <FormControl><Input placeholder="Paste the ID of the infringing post" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="action"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Requested Action</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                            >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                <RadioGroupItem value="delete_only" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                Delete the content
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                <RadioGroupItem value="delete_and_strike" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                Delete the content and issue a copyright strike
                                                </FormLabel>
                                            </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="originalContentUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Original Content URL (Optional)</FormLabel>
                                        <FormControl><Input placeholder="https://example.com/my-video.mp4" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="signature"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Your Full Legal Name (Signature)</FormLabel>
                                        <FormControl><Input placeholder="Your legal name" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <DialogFooter>
                                <Button variant="secondary" onClick={() => setStep('warn')}>Back</Button>
                                <Button type="submit">Submit Claim</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}

                {step === 'processing' && (
                     <div className="flex flex-col items-center justify-center text-center p-8">
                        <svg className="x-loader h-24 w-24 text-primary mb-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <rect className="box" x="10" y="10" width="80" height="80" rx="10" ry="10" stroke="currentColor" strokeWidth="6" fill="none" />
                            <path className="x-line-1" d="M 30 30 L 70 70" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                            <path className="x-line-2" d="M 70 30 L 30 70" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                        </svg>
                        <h3 className="text-xl font-bold animate-pulse">Processing...</h3>
                        <p className="text-muted-foreground">Submitting your claim securely.</p>
                    </div>
                )}
                
                {step === 'success' && (
                    <>
                        <SuccessAnimation />
                        <DialogFooter>
                            <Button onClick={handleClose}>Done</Button>
                        </DialogFooter>
                    </>
                )}

            </DialogContent>
        </Dialog>
    );
}
