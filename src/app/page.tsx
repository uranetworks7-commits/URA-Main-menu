'use client';
import { useState } from 'react';
import { LeftSidebar } from '@/components/left-sidebar';
import { RightSidebar } from '@/components/right-sidebar';
import { PostCard, Post } from '@/components/post-card';
import { CreatePost } from '@/components/create-post';
import { Header } from '@/components/header';
import { ScrollArea } from '@/components/ui/scroll-area';

// Initialize Firebase (placeholder)
// To enable Firebase, you would create a firebase.ts file and import it here
// import { app } from '@/lib/firebase';

const initialPosts: Post[] = [
    {
    id: '1',
    user: { name: 'URA Studio', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    content: 'Welcome to the new URA Social platform! This is the beginning of something amazing. We are building a community-focused social network.',
    image: 'https://picsum.photos/seed/1/800/600',
    imageHint: 'abstract tech',
    stats: {
      likes: '1.2k',
      comments: '48',
      views: '15.7k',
      revenue: '$25.50'
    }
  },
  {
    id: '2',
    user: { name: 'Dev Team', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    content: 'Just pushed a major update! The feed now looks cleaner and loads faster. Let us know what you think of the new design. #webdev #react #nextjs',
    image: 'https://picsum.photos/seed/2/800/500',
    imageHint: 'coding computer',
    stats: {
      likes: '876',
      comments: '112',
      views: '12.1k',
      revenue: '$18.20'
    }
  },
  {
    id: '3',
    user: { name: 'Community Manager', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    content: 'Planning our next community event. What topics are you most interested in? Drop your suggestions below! We want to hear from you.',
    image: 'https://picsum.photos/seed/3/800/700',
    imageHint: 'community event',
    stats: {
      likes: '452',
      comments: '230',
      views: '9.8k',
      revenue: '$12.75'
    }
  },
  {
    id: '4',
    user: { name: 'AI Enthusiast', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' },
    content: 'Exploring the latest in generative AI. The possibilities are endless! #AI #MachineLearning',
    image: 'https://picsum.photos/seed/4/800/550',
    imageHint: 'artificial intelligence',
    stats: {
      likes: '2.5k',
      comments: '150',
      views: '22.3k',
      revenue: '$45.10'
    }
  },
  {
    id: '5',
    user: { name: 'UX Designer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' },
    content: 'A good user experience is not just about aesthetics, it\'s about creating a seamless and intuitive journey for the user. #UX #DesignThinking',
    image: 'https://picsum.photos/seed/5/800/650',
    imageHint: 'design sketch',
    stats: {
      likes: '990',
      comments: '80',
      views: '11.5k',
      revenue: '$15.00'
    }
  }
];

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleCreatePost = (content: string) => {
    const newPost: Post = {
      id: (posts.length + 1).toString(),
      user: { name: 'Your Name', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c' }, // Placeholder for logged in user
      content,
      stats: {
        likes: '0',
        comments: '0',
        views: '0',
        revenue: '$0.00'
      }
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <CreatePost onCreatePost={handleCreatePost} />
            <div className="space-y-4 mt-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
