
'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, update, remove } from "firebase/database";
import { Header } from '@/components/header';
import { LeftSidebar } from '@/components/left-sidebar';
import { RightSidebar } from '@/components/right-sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, X, ShieldCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { User, CopyrightClaim } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

function AdminLoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [key, setKey] = useState('');
    const { toast } = useToast();

    const handleLogin = () => {
        if (key === 'Utkarsh225') {
            onLoginSuccess();
            localStorage.setItem('copyright_admin_auth', 'true');
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
                    <CardTitle className="flex items-center gap-2"><ShieldCheck/> Copyright Admin</CardTitle>
                    <CardDescription>Enter the security key to access the admin panel.</CardDescription>
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

export default function CopyrightAdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [claims, setClaims] = useState<CopyrightClaim[]>([]);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const auth = localStorage.getItem('copyright_admin_auth');
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
        const claimsRef = ref(db, 'copyrightClaims');
        onValue(claimsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const claimsList: CopyrightClaim[] = Object.keys(data)
                    .map(key => ({ id: key, ...data[key] }))
                    .filter(claim => claim.status === 'pending')
                    .sort((a, b) => a.date - b.date);
                setClaims(claimsList);
            } else {
                setClaims([]);
            }
        });
    }, [isAuthenticated]);

    const handleClaim = async (claim: CopyrightClaim, action: 'approve' | 'reject') => {
        setProcessingId(claim.id);
        try {
            const updates: { [key: string]: any } = {};
            const claimPath = `/copyrightClaims/${claim.id}`;
            const accusedUserStrikePath = `/users/${claim.accusedUserId}/copyrightStrikes/${claim.id}`;
            const claimantSubmittedPath = `/users/${claim.claimantId}/submittedClaims/${claim.id}`;
            const postPath = `/posts/${claim.postId}`;

            const strikeData = {
                strikeId: claim.id,
                postId: claim.postId,
                claimantId: claim.claimantId,
                claimantName: claim.claimantName,
                receivedAt: Date.now(),
                expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
                status: 'active'
            };

            if (action === 'approve') {
                updates[`${claimPath}/status`] = 'approved';
                updates[`${claimantSubmittedPath}/status`] = 'approved';
                
                if (claim.action === 'delete_and_strike') {
                    updates[accusedUserStrikePath] = strikeData;
                    updates[postPath] = null; // Delete the post
                    toast({ title: "Claim Approved", description: `A strike has been issued to ${claim.accusedUsername} and the post deleted.` });
                } else if (claim.action === 'delete_only') {
                     updates[postPath] = null; // Delete the post
                     toast({ title: "Claim Approved", description: `The post from ${claim.accusedUsername} has been deleted.` });
                } else if (claim.action === 'strike_only') {
                    updates[accusedUserStrikePath] = strikeData;
                    updates[`${postPath}/isCopyrighted`] = true; // Mark post as copyrighted
                    toast({ title: "Claim Approved", description: `A copyright strike has been issued to ${claim.accusedUsername}.` });
                }

            } else { // Reject
                updates[`${claimPath}/status`] = 'rejected';
                updates[`${claimantSubmittedPath}/status`] = 'rejected';
                toast({ title: "Claim Rejected", description: `The claim from ${claim.claimantName} has been rejected.` });
            }
            
            await update(ref(db), updates);

        } catch (error) {
            console.error("Failed to process claim:", error);
            toast({ title: "Error", description: "Failed to process the claim.", variant: "destructive" });
        } finally {
            setProcessingId(null);
        }
    };
    
     if (!isAuthenticated) {
        return <AdminLoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    if (!currentUser) return null;

    return (
        <div className="flex flex-col h-screen">
            <Header 
                currentUser={currentUser}
                onLogout={() => {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('copyright_admin_auth');
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
                        localStorage.removeItem('copyright_admin_auth');
                        router.push('/');
                    }}
                    onUpdateProfile={() => {}}
                    userPosts={[]}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Card>
                        <CardHeader className="p-4">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => router.push('/copyright')}>
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <CardTitle className="text-lg">Copyright Admin Panel</CardTitle>
                                    <CardDescription className="text-xs">Review and manage pending copyright claims.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs">Claimant</TableHead>
                                        <TableHead className="text-xs">Accused</TableHead>
                                        <TableHead className="text-xs">Date</TableHead>
                                        <TableHead className="text-xs">Post ID</TableHead>
                                        <TableHead className="text-xs">Action</TableHead>
                                        <TableHead className="text-center text-xs">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {claims.length > 0 ? claims.map(claim => (
                                        <TableRow key={claim.id} className="text-xs">
                                            <TableCell className="font-medium">{claim.claimantName}</TableCell>
                                            <TableCell>{claim.accusedUsername}</TableCell>
                                            <TableCell>{format(new Date(claim.date), 'dd MMM yy')}</TableCell>
                                            <TableCell className="font-mono">{claim.postId}</TableCell>
                                            <TableCell>
                                                <Badge variant={claim.action === 'delete_and_strike' ? 'destructive' : (claim.action === 'strike_only' ? 'secondary' : 'default')}>
                                                    {claim.action === 'delete_and_strike' ? 'Delete & Strike' : (claim.action === 'strike_only' ? 'Strike Only' : 'Delete Only')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center space-x-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    className="h-7 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                                    onClick={() => handleClaim(claim, 'approve')}
                                                    disabled={processingId === claim.id}
                                                >
                                                     {processingId === claim.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4" />}
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="destructive"
                                                    className="h-7"
                                                    onClick={() => handleClaim(claim, 'reject')}
                                                    disabled={processingId === claim.id}
                                                >
                                                    {processingId === claim.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4" />}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8 text-sm">
                                                No pending claims.
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
