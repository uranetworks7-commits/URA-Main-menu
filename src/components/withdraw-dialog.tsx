'use client';
import { useState, useEffect, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from './post-card';
import { db } from '@/lib/firebase';
import { ref, push, update } from "firebase/database";

interface WithdrawDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    currentUser: User;
    availableBalance: number;
}

const formSchema = z.object({
  amount: z.coerce.number().min(15, { message: "Withdrawal amount must be at least ₹15." }),
});

export function WithdrawDialog({ 
    isOpen, 
    onOpenChange, 
    currentUser,
    availableBalance
}: WithdrawDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '' as any,
    },
  });

  const amount = form.watch('amount');
  const fee = useMemo(() => (amount || 0) * 0.33, [amount]);
  const totalDeducted = useMemo(() => (amount || 0) + fee, [amount, fee]);

  useEffect(() => {
    if (!isOpen) {
      form.reset({ amount: '' as any });
      setIsSubmitting(false);
    }
  }, [isOpen, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    if (totalDeducted > availableBalance) {
      form.setError("amount", { 
        type: "manual", 
        message: "Insufficient balance to cover the amount and fee."
      });
      setIsSubmitting(false);
      return;
    }

    try {
        const newWithdrawalRef = push(ref(db, `users/${currentUser.id}/withdrawals`));
        const withdrawalId = newWithdrawalRef.key;
        
        if (!withdrawalId) {
            throw new Error("Could not generate withdrawal ID");
        }

        const withdrawalData = {
            userId: currentUser.id,
            withdrawalId: withdrawalId,
            username: currentUser.name,
            amount: values.amount,
            fee: fee,
            totalDeducted: totalDeducted,
            redeemCode: '', // This will be set by the admin
            timestamp: Date.now(),
            status: 'pending' as const,
        };

        await update(ref(db), {
            [`/users/${currentUser.id}/withdrawals/${withdrawalId}`]: withdrawalData
        });

        toast({
            title: "Withdrawal Request Submitted",
            description: `Your request for ₹${values.amount.toFixed(2)} is pending approval.`,
        });
        onOpenChange(false);

    } catch (error) {
        console.error("Withdrawal request failed:", error);
        toast({
            title: "Request Failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Enter the amount you wish to withdraw. Your request will be reviewed by an admin. A 33% transaction fee will be applied upon approval.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount to Withdraw (₹)</FormLabel>
                            <FormControl>
                               <Input 
                                 type="number"
                                 placeholder="e.g. 50" 
                                 {...field} 
                                 onChange={e => field.onChange(e.target.value === '' ? '' : e.target.valueAsNumber)}
                                 value={field.value === undefined || field.value === null ? '' : field.value}
                               />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {amount > 0 && (
                    <div className="text-sm space-y-1 text-muted-foreground p-3 bg-secondary rounded-md">
                        <div className="flex justify-between">
                            <span>Withdrawal Amount:</span>
                            <span className="font-medium text-foreground">₹{amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Fee (33%):</span>
                            <span className="font-medium text-foreground">₹{fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-foreground">
                            <span>Total to be Deducted:</span>
                            <span>₹{totalDeducted.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between pt-2 mt-2 border-t border-border">
                            <span>Your available balance:</span>
                            <span>₹{availableBalance.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Request Withdrawal
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
