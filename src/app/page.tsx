'use client';
import { useState } from 'react';
import { LeftSidebar } from '@/components/left-sidebar';
import { RightSidebar } from '@/components/right-sidebar';
import { PostCard, Post, User } from '@/components/post-card';
import { CreatePost } from '@/components/create-post';
import { Header } from '@/components/header';
import { LoginPage } from '@/components/login-page';

const initialPosts: Post[] = [
    {
    id: '1',
    user: { id: 'user-1', name: 'URA Studio', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    content: 'Welcome to the new URA Social platform! This is the beginning of something amazing. We are building a community-focused social network.',
    image: 'https://picsum.photos/seed/1/800/600',
    imageHint: 'abstract tech',
    stats: {
      likes: '1.2k',
      comments: '48',
      views: '15.7k',
    },
    comments: [
        { id: 'c1', user: { name: 'Dev Team' }, text: 'Excited to be part of this journey!' },
        { id: 'c2', user: { name: 'Community Manager' }, text: 'The community is going to love this.' },
    ]
  },
  {
    id: '2',
    user: { id: 'user-2', name: 'Dev Team', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    content: 'Just pushed a major update! The feed now looks cleaner and loads faster. Let us know what you think of the new design. #webdev #react #nextjs',
    image: 'https://picsum.photos/seed/2/800/500',
    imageHint: 'coding computer',
    stats: {
      likes: '876',
      comments: '112',
      views: '12.1k',
    },
     comments: [
        { id: 'c3', user: { name: 'AI Enthusiast' }, text: 'Love the new look!' },
    ]
  },
  {
    id: '3',
    user: { id: 'user-publisher', name: 'Original Publisher', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c' },
    content: 'Having fun building this new social app. What feature should I add next? Here is a post where I should be able to see revenue.',
    image: 'https://picsum.photos/seed/sub/800/600',
    imageHint: 'developer coding',
    stats: {
      likes: '42',
      comments: '8',
      views: '1.5k', // This should generate 25Rs revenue
    },
    comments: []
  },
  {
    id: '4',
    user: { id: 'user-3', name: 'Community Manager', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    content: 'Planning our next community event. What topics are you most interested in? Drop your suggestions below! We want to hear from you.',
    image: 'https://picsum.photos/seed/3/800/700',
    imageHint: 'community event',
    stats: {
      likes: '452',
      comments: '230',
      views: '9.8k',
    },
    comments: []
  },
  {
    id: '5',
    user: { id: 'user-4', name: 'AI Enthusiast', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' },
    content: 'Exploring the latest in generative AI. The possibilities are endless! #AI #MachineLearning',
    image: 'https://picsum.photos/seed/4/800/550',
    imageHint: 'artificial intelligence',
    stats: {
      likes: '2.5k',
      comments: '150',
      views: '22.3k',
    },
    comments: []
  },
  {
    id: '6',
    user: { id: 'user-5', name: 'UX Designer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' },
    content: 'A good user experience is not just about aesthetics, it\'s about creating a seamless and intuitive journey for the user. #UX #DesignThinking',
    image: 'https://picsum.photos/seed/5/800/650',
    imageHint: 'design sketch',
    stats: {
      likes: '990',
      comments: '80',
      views: '11.5k',
    },
    comments: []
  }
];

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleCreatePost = (content: string) => {
    if (!currentUser) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      user: currentUser,
      content,
      stats: {
        likes: '0',
        comments: '0',
        views: '0',
      },
      comments: []
    };
    setPosts([newPost, ...posts]);
  };

  const handleLogin = (name: string, avatarUrl?: string) => {
    const newUser: User = {
      id: `user-${name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
      name: name,
      avatar: avatarUrl || `https://i.pravatar.cc/150?u=${name}`
    };
    setCurrentUser(newUser);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar currentUser={currentUser} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <CreatePost onCreatePost={handleCreatePost} currentUser={currentUser} />
            <div className="space-y-4 mt-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} currentUser={currentUser} />
              ))}
            </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
