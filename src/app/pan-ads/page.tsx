'use client';
import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, update } from "firebase/database";
import type { User, Withdrawal } from '@/components/post-card';
import { Header } from '@/components/header';
import { LeftSidebar } from '@/components/left-sidebar';
import { RightSidebar } from '@/components/right-sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SECURITY_KEY = 'Utkarsh225';

interface PendingWithdrawal extends Withdrawal {
    isClearing?: boolean;
    clearRedeemCode?: string;
}

function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [key, setKey] = useState('');
    const { toast } = useToast();

    const handleLogin = () => {
        if (key === SECURITY_KEY) {
            onLoginSuccess();
            localStorage.setItem('pan_ads_auth', 'true');
        } else {
            toast({
                title: 'Authentication Failed',
                description: 'The security key is incorrect.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldCheck/> Admin Access</CardTitle>
                    <CardDescription>Enter the security key to access the Pan Ads panel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input 
                        type="password"
                        placeholder="Security Key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <Button onClick={handleLogin} className="w-full">Login</Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PanAdsPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [pendingWithdrawals, setPendingWithdrawals] = useState<PendingWithdrawal[]>([]);
    const { toast } = useToast();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = localStorage.getItem('pan_ads_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }

        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;

        const usersRef = ref(db, 'users');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const allUsers: User[] = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setUsers(allUsers);
            }
        });
    }, [isAuthenticated]);

    useEffect(() => {
        if (!users.length) return;

        const allPending: PendingWithdrawal[] = [];
        users.forEach(user => {
            if (user.withdrawals) {
                Object.values(user.withdrawals).forEach(withdrawal => {
                    if (withdrawal.status === 'pending') {
                        allPending.push({
                             ...withdrawal,
                             isClearing: false,
                             clearRedeemCode: ''
                        });
                    }
                });
            }
        });
        setPendingWithdrawals(allPending.sort((a,b) => a.timestamp - b.timestamp));

    }, [users]);
    
    const handleClearToggle = (withdrawalId: string) => {
        setPendingWithdrawals(prev => prev.map(w => 
            w.withdrawalId === withdrawalId ? { ...w, isClearing: !w.isClearing } : w
        ));
    };

    const handleRedeemCodeChange = (withdrawalId: string, value: string) => {
         setPendingWithdrawals(prev => prev.map(w => 
            w.withdrawalId === withdrawalId ? { ...w, clearRedeemCode: value } : w
        ));
    };

    const handleSend = async (withdrawal: PendingWithdrawal) => {
        if (!withdrawal.clearRedeemCode) {
            toast({
                title: "Redeem Code Required",
                description: "Please enter a redeem code to clear the withdrawal.",
                variant: "destructive"
            });
            return;
        }

        try {
            const updates: { [key: string]: any } = {};
            updates[`/users/${withdrawal.userId}/withdrawals/${withdrawal.withdrawalId}/status`] = 'cleared';
            updates[`/users/${withdrawal.userId}/withdrawals/${withdrawal.withdrawalId}/redeemCode`] = withdrawal.clearRedeemCode;
            
            await update(ref(db), updates);

            toast({
                title: "Withdrawal Cleared",
                description: `Request for ${withdrawal.username} has been processed.`,
            });
        } catch (error) {
            console.error("Failed to clear withdrawal:", error);
            toast({
                title: "Error",
                description: "Failed to update withdrawal status.",
                variant: "destructive"
            });
        }
    };


    if (!isAuthenticated) {
        return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    if (!currentUser) return null; // or loading spinner

    return (
        <div className="flex flex-col h-screen">
             <Header 
                currentUser={currentUser}
                onLogout={() => {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('pan_ads_auth');
                    router.push('/');
                }}
                onUpdateProfile={() => {}}
                userPosts={[]}
            />
            <div className="flex flex-1 overflow-hidden">
                <LeftSidebar 
                    currentUser={currentUser} 
                    onLogout={() => {
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('pan_ads_auth');
                        router.push('/');
                    }}
                    onUpdateProfile={() => {}}
                    userPosts={[]}
                />
                <main className="flex-1 overflow-y-auto p-4">
                     <Card>
                        <CardHeader className="p-4">
                            <div className="flex items-center gap-2">
                                 <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <CardTitle className="text-lg">Pan Ads - Withdrawal Requests</CardTitle>
                                    <CardDescription className="text-xs">Review and process pending user withdrawals.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-2">
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs">User</TableHead>
                                        <TableHead className="text-xs">Date</TableHead>
                                        <TableHead className="text-right text-xs">Amount</TableHead>
                                        <TableHead className="text-center text-xs">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingWithdrawals.length > 0 ? pendingWithdrawals.map(w => (
                                        <TableRow key={w.withdrawalId}>
                                            <TableCell className="font-medium text-xs">{w.username}</TableCell>
                                            <TableCell className="text-xs">{format(new Date(w.timestamp), 'dd MMM, h:mm a')}</TableCell>
                                            <TableCell className="text-right font-bold text-xs">₹{w.totalDeducted.toFixed(2)}</TableCell>
                                            <TableCell className="text-center space-y-2">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <Checkbox
                                                        id={`clear-${w.withdrawalId}`}
                                                        checked={w.isClearing}
                                                        onCheckedChange={() => handleClearToggle(w.withdrawalId)}
                                                    />
                                                    <label htmlFor={`clear-${w.withdrawalId}`} className="text-xs font-medium leading-none">
                                                        Clear
                                                    </label>
                                                </div>
                                                {w.isClearing && (
                                                    <div className="flex items-center gap-1 pt-2">
                                                        <Input
                                                            placeholder="Redeem code"
                                                            value={w.clearRedeemCode}
                                                            onChange={(e) => handleRedeemCodeChange(w.withdrawalId, e.target.value)}
                                                            className="h-8 text-xs"
                                                        />
                                                        <Button size="sm" className="h-8" onClick={() => handleSend(w)}>Send</Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground text-xs py-8">
                                                No pending withdrawals.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </main>
                <RightSidebar />
            </div>
        </div>
    );
}
