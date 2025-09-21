'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, set, push, remove, update, query, orderByChild, equalTo, get } from "firebase/database";
import { LeftSidebar } from '@/components/left-sidebar';
import { RightSidebar } from '@/components/right-sidebar';
import { PostCard, Post, User, Comment } from '@/components/post-card';
import { CreatePost } from '@/components/create-post';
import { Header } from '@/components/header';
import { LoginPage } from '@/components/login-page';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UraIcon } from '@/components/ura-icon';

const initialPosts: Omit<Post, 'id' | 'createdAt'>[] = [
    {
    user: { id: 'user-1', name: 'URA Studio', avatar: `https://placehold.co/150x150/222/fff?text=U`, isMonetized: false, totalViews: 0, totalLikes: 0 },
    content: 'Welcome to the new URA-X platform! This is the beginning of something amazing. We are building a community-focused social network.',
    image: 'https://picsum.photos/seed/1/800/600',
    imageHint: 'abstract tech',
    likes: {},
    comments: {},
    views: 1200,
  },
  {
    user: { id: 'user-2', name: 'Dev Team', avatar: `https://placehold.co/150x150/222/fff?text=D`, isMonetized: false, totalViews: 0, totalLikes: 0 },
    content: 'Just pushed a major update! The feed now looks cleaner and loads faster. Let us know what you think of the new design. #webdev #react #nextjs',
    image: 'https://picsum.photos/seed/2/800/500',
    imageHint: 'coding computer',
    likes: {},
    comments: {},
    views: 876,
  },
  {
    user: { id: 'user-publisher', name: 'Original Publisher', avatar: `https://placehold.co/150x150/222/fff?text=O`, isMonetized: true, totalViews: 0, totalLikes: 0 },
    content: 'Having fun building this new social app. What feature should I add next? Here is a post where I should be able to see revenue.',
    image: 'https://picsum.photos/seed/sub/800/600',
    imageHint: 'developer coding',
    likes: { 'user-2': true, 'user-1': true },
    comments: {},
    views: 1500,
  },
];

function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-background flex items-center justify-center z-[100]">
            <div className="flex flex-col items-center gap-4">
                <svg className="x-loader h-24 w-24 text-primary" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 20 20 L 80 80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    <path d="M 80 20 L 20 80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </svg>
                <h1 className="text-3xl font-bold text-primary animate-pulse">URA-X</h1>
            </div>
        </div>
    )
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => setIsLoading(false), 2000); // Simulate loading for 2 seconds
    return () => clearTimeout(timer);
  }, []);
  
  const getTodayPostCount = useCallback(() => {
    if (!currentUser) return 0;
    const today = new Date().toISOString().split('T')[0];
    const key = `postCount_${currentUser.id}_${today}`;
    return parseInt(localStorage.getItem(key) || '0', 10);
  }, [currentUser]);

  const incrementTodayPostCount = useCallback(() => {
    if (!currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const key = `postCount_${currentUser.id}_${today}`;
    const count = getTodayPostCount();
    localStorage.setItem(key, (count + 1).toString());
  }, [currentUser, getTodayPostCount]);

  const decrementTodayPostCount = useCallback(() => {
    if (!currentUser) return;
    const today = new Date().toISOString().split('T')[0];
    const key = `postCount_${currentUser.id}_${today}`;
    let count = getTodayPostCount();
    count = Math.max(0, count - 1);
    localStorage.setItem(key, count.toString());
  }, [currentUser, getTodayPostCount]);


  useEffect(() => {
    if (isClient) {
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
      }

      const postsRef = ref(db, 'posts');
      onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const postsList: Post[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setPosts(postsList);
        } else {
          // Seed the database if it's empty
          initialPosts.forEach((post) => {
            const newPostRef = push(ref(db, 'posts'));
            const postWithTimestamp: Omit<Post, 'id'> = {
              ...post,
              createdAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 3), // random post from last 3 days
            };
            set(newPostRef, postWithTimestamp);
          });
        }
      });
    }
  }, [isClient]);

  // Update user stats periodically
    useEffect(() => {
        if (!currentUser || posts.length === 0) return;

        const interval = setInterval(() => {
            const userPosts = posts.filter(p => p.user.id === currentUser.id);
            const totalViews = userPosts.reduce((acc, post) => acc + (post.views || 0), 0);
            const totalLikes = userPosts.reduce((acc, post) => acc + Object.keys(post.likes || {}).length, 0);
            
            const userRef = ref(db, `users/${currentUser.id}`);
            const updates: Partial<User> = {};

            if (totalViews !== currentUser.totalViews) {
                updates.totalViews = totalViews;
            }
            if (totalLikes !== currentUser.totalLikes) {
                updates.totalLikes = totalLikes;
            }
            
            if (Object.keys(updates).length > 0) {
                update(userRef, updates);
            }

        }, 1000 * 30); // Update every 30 seconds

        return () => clearInterval(interval);

    }, [posts, currentUser]);
  
  // Automatic view increase simulation
  useEffect(() => {
    if (!isClient || posts.length === 0) return;

    const interval = setInterval(() => {
        const thirtySecondsAgo = Date.now() - 30 * 1000;
        
        posts.forEach(post => {
            if ((post.createdAt || 0) > thirtySecondsAgo) {
                // Skip posts newer than 30 seconds
                return;
            }

            const currentViews = post.views || 0;
            const fiveDaysAgo = Date.now() - 5 * 24 * 60 * 60 * 1000;
            let newViews = currentViews;

            if ((post.createdAt || 0) > fiveDaysAgo) {
                // For posts newer than 5 days
                // 5% chance for a viral burst of 100-350 views
                if (Math.random() < 0.05) {
                    newViews += Math.floor(Math.random() * 251) + 100; // 100 to 350
                } else {
                    // Otherwise, add 1-25 views
                    newViews += Math.floor(Math.random() * 25) + 1;
                }
            } else {
                // For posts older than 5 days, add 1-3 views
                newViews += Math.floor(Math.random() * 3) + 1;
            }
            
            // Cap views at 2000 and update if changed
            if (newViews > currentViews) {
                update(ref(db, `posts/${post.id}`), { views: Math.min(newViews, 2000) });
            }
        });
    }, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, [isClient, posts]);

  const handleCreatePost = (content: string, mediaType?: 'image' | 'video', mediaUrl?: string) => {
    if (!currentUser) return;
    
    const postCount = getTodayPostCount();
    if (postCount >= 2) {
      toast({
        title: "Post Limit Reached",
        description: "You can only create up to 2 posts per day.",
        variant: "destructive",
      });
      return;
    }

    const newPostData: Omit<Post, 'id'> = {
      user: currentUser,
      content,
      likes: {},
      comments: {},
      views: Math.floor(Math.random() * 16),
      createdAt: Date.now(),
    };

    if (mediaType === 'image' && mediaUrl) {
      (newPostData as any).image = mediaUrl;
    } else if (mediaType === 'video' && mediaUrl) {
      (newPostData as any).video = mediaUrl;
    }
    
    const newPostRef = push(ref(db, 'posts'));
    set(newPostRef, newPostData);
    incrementTodayPostCount();
  };
  
  const handleDeletePost = (postId: string) => {
    if (!currentUser) return;

    const postToDelete = posts.find(p => p.id === postId);
    if (!postToDelete) return;

    // Decrement stats
    const viewsLost = postToDelete.views || 0;
    const likesLost = Object.keys(postToDelete.likes || {}).length;
    
    const userRef = ref(db, `users/${currentUser.id}`);
    const updates: Partial<User> = {
        totalViews: Math.max(0, (currentUser.totalViews || 0) - viewsLost),
        totalLikes: Math.max(0, (currentUser.totalLikes || 0) - likesLost),
    };
    update(userRef, updates);

    // Remove post from DB
    const postRef = ref(db, `posts/${postId}`);
    remove(postRef);
    
    // Decrement daily post count
    decrementTodayPostCount();
  };
  
  const handleReportPost = (postId: string, reason: string) => {
    const reportsRef = ref(db, `reports/${postId}`);
    const newReportRef = push(reportsRef);
    set(newReportRef, {
      reason,
      reportedBy: currentUser?.id,
      timestamp: Date.now(),
    });
    toast({
      title: "Post Reported",
      description: "Thank you for your feedback. We will review this post.",
    });
  };

  const handleLikePost = (postId: string) => {
    if (!currentUser) return;
    const postRef = ref(db, `posts/${postId}/likes/${currentUser.id}`);
    const post = posts.find(p => p.id === postId);
    if (post && post.likes && post.likes[currentUser.id]) {
      // Unlike
      remove(postRef);
    } else {
      // Like
      set(postRef, true);
    }
  };

  const handleAddComment = (postId: string, commentText: string) => {
    if (!currentUser) return;
    const commentsRef = ref(db, `posts/${postId}/comments`);
    const newCommentRef = push(commentsRef);
    const newComment: Omit<Comment, 'id'> = {
      user: currentUser,
      text: commentText,
      createdAt: Date.now(),
    };
    set(newCommentRef, newComment);
  };


  const handleUpdateProfile = (name: string, avatarUrl: string) => {
    if (!currentUser) return;
    
    // Update user in Firebase DB
    const userRef = ref(db, `users/${currentUser.id}`);
    update(userRef, { name, avatar: avatarUrl });

    // No need to call setCurrentUser here, onValue listener will do it.
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

 const handleLogin = async (name: string, avatarUrl?: string) => {
    const usersRef = ref(db, 'users');
    const q = query(usersRef, orderByChild('name'), equalTo(name));
    const snapshot = await get(q);

    if (snapshot.exists()) {
      // User exists, log them in
      const userData = snapshot.val();
      const userId = Object.keys(userData)[0];
      const existingUser = { id: userId, ...userData[userId] };
      localStorage.setItem('currentUser', JSON.stringify(existingUser));
      setCurrentUser(existingUser);
    } else {
        toast({
            title: "Login Failed",
            description: "No account with that name exists. Account creation is disabled.",
            variant: "destructive",
        });
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };
  
  const userPosts = useMemo(() => {
    if (!currentUser) return [];
    return posts.filter(post => post.user.id === currentUser.id);
  }, [posts, currentUser]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) {
      return posts;
    }
    return posts.filter(post =>
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);


  if (!isClient || isLoading) {
    return <LoadingScreen />; 
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  const postCountToday = getTodayPostCount();

  return (
    <div className="flex flex-col h-screen">
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        onUpdateProfile={handleUpdateProfile}
        userPosts={userPosts}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar 
            currentUser={currentUser} 
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
            userPosts={userPosts}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <CreatePost 
                onCreatePost={handleCreatePost} 
                currentUser={currentUser}
                postCountToday={postCountToday}
            />
            <div className="relative my-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-8 w-full bg-card" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    currentUser={currentUser}
                    onDeletePost={handleDeletePost}
                    onLikePost={handleLikePost}
                    onAddComment={handleAddComment}
                    onReportPost={handleReportPost}
                />
              ))}
            </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}

    
