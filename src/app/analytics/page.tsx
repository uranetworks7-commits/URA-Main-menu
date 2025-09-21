'use client';
import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, update } from "firebase/database";
import type { Post, User, Withdrawal } from '@/components/post-card';
import { Header } from '@/components/header';
import { LeftSidebar } from '@/components/left-sidebar';
import { RightSidebar } from '@/components/right-sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { DollarSign, Eye, ThumbsUp, ArrowLeft, BadgeCheck, PartyPopper, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { WithdrawDialog } from '@/components/withdraw-dialog';

export default function AnalyticsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
       const userRef = ref(db, `users/${user.id}`);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                setCurrentUser(userData);
                localStorage.setItem('currentUser', JSON.stringify(userData));
            }
        });
    } else {
        router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (isClient) {
      const postsRef = ref(db, 'posts');
      onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const allPosts: Post[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setPosts(allPosts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
        }
      });
    }
  }, [isClient]);
  
  const userPosts = useMemo(() => {
    if (!currentUser) return [];
    return posts.filter(post => post.user.id === currentUser.id);
  }, [posts, currentUser]);

  const canBeMonetized = useMemo(() => {
      return userPosts.some(post => (post.views || 0) > 1000 && Object.keys(post.likes || {}).length >= 10);
  }, [userPosts]);

  const handleRequestMonetization = () => {
    if (!currentUser) return;
    if (canBeMonetized) {
      const userRef = ref(db, `users/${currentUser.id}`);
      update(userRef, { isMonetized: true });
      setCurrentUser(prev => prev ? { ...prev, isMonetized: true } : null);
      toast({
        title: "Congratulations! You're Monetized!",
        description: "You can now earn revenue from your posts.",
      });
    } else {
      toast({
        title: "Monetization Requirements Not Met",
        description: "You need at least one post with over 1,000 views and 10 likes.",
        variant: "destructive",
      });
    }
  };
  
  const totalRevenue = useMemo(() => {
      if (!currentUser?.isMonetized) return 0;
      return userPosts.reduce((total, post) => {
        const views = post.views || 0;
        const postRevenue = (views / 1250) * 25;
        return total + postRevenue;
    }, 0);
  }, [userPosts, currentUser?.isMonetized]);

  const totalWithdrawals = useMemo(() => {
    if (!currentUser?.withdrawals) return 0;
    return Object.values(currentUser.withdrawals).reduce((acc, w) => acc + w.totalDeducted, 0);
  }, [currentUser?.withdrawals]);
  
  const availableBalance = useMemo(() => totalRevenue - totalWithdrawals, [totalRevenue, totalWithdrawals]);

  const withdrawalHistory = useMemo(() => {
    if (!currentUser?.withdrawals) return [];
    return Object.values(currentUser.withdrawals).sort((a, b) => b.timestamp - a.timestamp);
  }, [currentUser?.withdrawals]);


  const totalViews = currentUser?.totalViews || 0;
  const totalLikes = currentUser?.totalLikes || 0;

  if (!isClient || !currentUser) {
    return null; // or a loading spinner
  }


  return (
    <>
    <div className="flex flex-col h-screen">
      <Header 
        currentUser={currentUser}
        onLogout={() => {
            localStorage.removeItem('currentUser');
            router.push('/');
        }}
        onUpdateProfile={() => {}} // Not needed on this page
        userPosts={userPosts}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar 
            currentUser={currentUser} 
            onLogout={() => {
                localStorage.removeItem('currentUser');
                router.push('/');
            }}
            onUpdateProfile={() => {}} // Not needed on this page
            userPosts={userPosts}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                            <div>
                                <CardTitle>Your Analytics</CardTitle>
                                <CardDescription>An overview of your content performance.</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                        {currentUser.isMonetized ? (
                            <>
                                <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3">
                                    <BadgeCheck className="mr-2 h-4 w-4"/>
                                    Monetized Account
                                </Badge>
                                <Button onClick={() => setIsWithdrawDialogOpen(true)}>Withdraw</Button>
                            </>
                        ) : (
                           <Button onClick={handleRequestMonetization}>Request Monetization</Button>
                        )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Available for Withdrawal</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{currentUser.isMonetized ? availableBalance.toFixed(2) : '0.00'}</div>
                                <p className="text-xs text-muted-foreground">{currentUser.isMonetized ? `Total revenue: ₹${totalRevenue.toFixed(2)}` : "Account not monetized"}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                                <Eye className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">across {userPosts.length} posts</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalLikes.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">across all of your posts</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Post</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Views</TableHead>
                                <TableHead className="text-right">Likes</TableHead>
                                <TableHead className="text-right">Comments</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userPosts.map(post => {
                                const views = post.views || 0;
                                const likes = Object.keys(post.likes || {}).length;
                                const revenue = currentUser.isMonetized ? (views / 1250) * 25 : 0;
                                const isPostEligibleForMonetization = views > 1000 && likes >= 10;

                                return (
                                    <TableRow key={post.id}>
                                        <TableCell className="max-w-xs truncate font-medium">{post.content}</TableCell>
                                        <TableCell>{format(new Date(post.createdAt), 'dd MMM yyyy')}</TableCell>
                                        <TableCell className="text-center">
                                            {currentUser.isMonetized ? (
                                                revenue > 0 ? (
                                                    <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                                        <PartyPopper className="mr-1 h-3 w-3" />
                                                        Earning
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">No Earnings</Badge>
                                                )
                                            ) : (
                                                isPostEligibleForMonetization ? (
                                                     <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                                        Eligible
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Not Eligible</Badge>
                                                )
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">{views.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{likes.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{Object.keys(post.comments || {}).length.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-medium text-green-500">₹{revenue.toFixed(2)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {currentUser.isMonetized && withdrawalHistory.length > 0 && (
                 <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                             <History className="h-6 w-6" />
                            <div>
                                <CardTitle>Redeemed History</CardTitle>
                                <CardDescription>A log of all your past withdrawals.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Redeem Code</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="text-right">Fee</TableHead>
                                    <TableHead className="text-right">Total Deducted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {withdrawalHistory.map((withdrawal, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{format(new Date(withdrawal.timestamp), 'dd MMM yyyy, h:mm a')}</TableCell>
                                        <TableCell className="font-mono">...{withdrawal.redeemCode.slice(-4)}</TableCell>
                                        <TableCell className="text-right">₹{withdrawal.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-destructive">₹{withdrawal.fee.toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-bold">₹{withdrawal.totalDeducted.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

        </main>
        <RightSidebar />
      </div>
    </div>
     {currentUser.isMonetized && (
        <WithdrawDialog
          isOpen={isWithdrawDialogOpen}
          onOpenChange={setIsWithdrawDialogOpen}
          currentUser={currentUser}
          availableBalance={availableBalance}
        />
      )}
    </>
  );
}
