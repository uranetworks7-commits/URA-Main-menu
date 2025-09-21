'use client';
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, set, push, remove, update } from "firebase/database";
import { LeftSidebar } from '@/components/left-sidebar';
import { RightSidebar } from '@/components/right-sidebar';
import { PostCard, Post, User, Comment } from '@/components/post-card';
import { CreatePost } from '@/components/create-post';
import { Header } from '@/components/header';
import { LoginPage } from '@/components/login-page';
import { useToast } from "@/hooks/use-toast";

const initialPosts: Omit<Post, 'id' | 'createdAt'>[] = [
    {
    user: { id: 'user-1', name: 'URA Studio', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    content: 'Welcome to the new URA Social platform! This is the beginning of something amazing. We are building a community-focused social network.',
    image: 'https://picsum.photos/seed/1/800/600',
    imageHint: 'abstract tech',
    likes: {},
    comments: [],
    views: 1200,
  },
  {
    user: { id: 'user-2', name: 'Dev Team', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    content: 'Just pushed a major update! The feed now looks cleaner and loads faster. Let us know what you think of the new design. #webdev #react #nextjs',
    image: 'https://picsum.photos/seed/2/800/500',
    imageHint: 'coding computer',
    likes: {},
    comments: [],
    views: 876,
  },
  {
    user: { id: 'user-publisher', name: 'Original Publisher', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c' },
    content: 'Having fun building this new social app. What feature should I add next? Here is a post where I should be able to see revenue.',
    image: 'https://picsum.photos/seed/sub/800/600',
    imageHint: 'developer coding',
    likes: {},
    comments: [],
    views: 1500,
  },
];


export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
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


  useEffect(() => {
    if (isClient) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const postsRef = ref(db, 'posts');
      onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const postsList: Post[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          })).sort((a, b) => b.createdAt - a.createdAt);
          setPosts(postsList);
        } else {
          // Seed the database if it's empty
          initialPosts.forEach((post) => {
            const newPostRef = push(ref(db, 'posts'));
            if (newPostRef.key) {
              const postWithTimestamp: Omit<Post, 'id'> = {
                ...post,
                createdAt: Date.now(),
              };
              set(newPostRef, postWithTimestamp);
            }
          });
        }
      });
    }
  }, [isClient]);
  
  // Automatic view increase simulation
  useEffect(() => {
    if (!isClient || posts.length === 0) return;

    const interval = setInterval(() => {
        const fiveDaysAgo = Date.now() - 5 * 24 * 60 * 60 * 1000;
        
        posts.forEach(post => {
            if (post.createdAt > fiveDaysAgo) {
                const viewsRef = ref(db, `posts/${post.id}/views`);
                const currentViews = post.views || 0;
                const newViews = currentViews + Math.floor(Math.random() * 29) + 1;
                set(viewsRef, newViews);
            }
        });
    }, 60000); // Update every minute to simulate daily increase

    return () => clearInterval(interval);
  }, [isClient, posts]);

  const handleCreatePost = (content: string) => {
    if (!currentUser) return;
    
    const postCount = getTodayPostCount();
    if (postCount >= 10) {
      toast({
        title: "Post Limit Reached",
        description: "You can only create up to 10 posts per day.",
        variant: "destructive",
      });
      return;
    }

    const newPostData: Omit<Post, 'id'> = {
      user: currentUser,
      content,
      image: `https://picsum.photos/seed/${Date.now()}/800/600`,
      likes: {},
      comments: [],
      views: 0,
      createdAt: Date.now(),
    };
    const newPostRef = push(ref(db, 'posts'));
    set(newPostRef, newPostData);
    incrementTodayPostCount();
  };
  
  const handleDeletePost = (postId: string) => {
    const postRef = ref(db, `posts/${postId}`);
    remove(postRef);
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
    const newComment: Comment = {
      id: newCommentRef.key!,
      user: currentUser,
      text: commentText,
      createdAt: Date.now(),
    };
    set(newCommentRef, newComment);
  };


  const handleUpdateProfile = (name: string, avatarUrl: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, name, avatar: avatarUrl };
    
    // Update user in Firebase DB
    const userRef = ref(db, `users/${currentUser.id}`);
    update(userRef, { name, avatar: avatarUrl });

    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleLogin = (name: string, avatarUrl?: string) => {
    const userId = `user-${name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;
    const newUser: User = {
      id: userId,
      name: name,
      avatar: avatarUrl || '',
    };
    
    // Save user to Firebase
    const userRef = ref(db, `users/${userId}`);
    set(userRef, newUser);
    
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  if (!isClient) {
    return null; // or a loading spinner
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
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar 
            currentUser={currentUser} 
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <CreatePost 
                onCreatePost={handleCreatePost} 
                currentUser={currentUser}
                postCountToday={postCountToday}
            />
            <div className="space-y-4 mt-4">
              {posts.map((post) => (
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
