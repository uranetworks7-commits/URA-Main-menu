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
  },
  {
    id: 'h1',
    user: { id: 'user-hindi-1', name: 'कविता पटेल', avatar: 'https://i.pravatar.cc/150?u=hindi1' },
    content: 'आज का दिन बहुत सुन्दर है। सुबह की सैर पर प्रकृति का अद्भुत नज़ारा देखने को मिला। #सुबह #प्रकृति',
    image: 'https://picsum.photos/seed/hindi1/800/600',
    imageHint: 'morning nature',
    stats: {
      likes: '1.1k',
      comments: '32',
      views: '14.2k',
    },
    comments: []
  },
  {
    id: 'h2',
    user: { id: 'user-hindi-2', name: 'रोहन शर्मा', avatar: 'https://i.pravatar.cc/150?u=hindi2' },
    content: 'भारतीय व्यंजनों का कोई जवाब नहीं। आज मैंने घर पर छोले भटूरे बनाए। #खाना #भारतीयव्यंजन',
    image: 'https://picsum.photos/seed/hindi2/800/650',
    imageHint: 'indian food',
    stats: {
      likes: '2.3k',
      comments: '150',
      views: '20.1k',
    },
    comments: []
  },
  {
    id: 'h3',
    user: { id: 'user-hindi-3', name: 'प्रिया सिंह', avatar: 'https://i.pravatar.cc/150?u=hindi3' },
    content: 'नई किताब पढ़ना शुरू किया है। साहित्य में खो जाने का अपना ही मज़ा है। आपकी पसंदीदा किताब कौन सी है?',
    image: 'https://picsum.photos/seed/hindi3/800/500',
    imageHint: 'reading book',
    stats: {
      likes: '750',
      comments: '90',
      views: '8.5k',
    },
    comments: []
  },
  {
    id: 'h4',
    user: { id: 'user-hindi-4', name: 'अमित कुमार', avatar: 'https://i.pravatar.cc/150?u=hindi4' },
    content: 'क्रिकेट का फाइनल मैच देखना हमेशा रोमांचक होता है। टीम इंडिया को शुभकामनाएँ! #क्रिकेट #TeamIndia',
    image: 'https://picsum.photos/seed/hindi4/800/550',
    imageHint: 'cricket match',
    stats: {
      likes: '5.2k',
      comments: '400',
      views: '55k',
    },
    comments: []
  },
    {
    id: 'h5',
    user: { id: 'user-hindi-5', name: 'सोनिया गुप्ता', avatar: 'https://i.pravatar.cc/150?u=hindi5' },
    content: 'आने वाली छुट्टियों में कहाँ घूमने जाएं? कृपया अपने सुझाव दें। #यात्रा #छुट्टियां',
    image: 'https://picsum.photos/seed/hindi5/800/700',
    imageHint: 'travel planning',
    stats: {
      likes: '980',
      comments: '120',
      views: '11.8k',
    },
    comments: []
  },
  {
    id: 'h6',
    user: { id: 'user-hindi-6', name: 'राज मल्होत्रा', avatar: 'https://i.pravatar.cc/150?u=hindi6' },
    content: 'फिटनेस के लिए योग सबसे अच्छा व्यायाम है। स्वस्थ रहें, मस्त रहें। #योग #स्वास्थ्य',
    image: 'https://picsum.photos/seed/hindi6/800/450',
    imageHint: 'yoga fitness',
    stats: {
      likes: '1.8k',
      comments: '85',
      views: '19.2k',
    },
    comments: []
  },
  {
    id: 'h7',
    user: { id: 'user-hindi-7', name: 'नेहा बंसल', avatar: 'https://i.pravatar.cc/150?u=hindi7' },
    content: 'बॉलीवुड की क्लासिक फिल्में आज भी उतनी ही मनोरंजक हैं। आपकी पसंदीदा फिल्म कौन सी है? #बॉलीवुड #फिल्में',
    image: 'https://picsum.photos/seed/hindi7/800/620',
    imageHint: 'classic cinema',
    stats: {
      likes: '630',
      comments: '75',
      views: '7.9k',
    },
    comments: []
  },
  {
    id: 'h8',
    user: { id: 'user-hindi-8', name: 'विक्रम राठौर', avatar: 'https://i.pravatar.cc/150?u=hindi8' },
    content: 'टेक्नोलॉजी की दुनिया हर दिन बदल रही है। नए गैजेट्स और इनोवेशन के बारे में जानना दिलचस्प है। #टेक्नोलॉजी',
    image: 'https://picsum.photos/seed/hindi8/800/580',
    imageHint: 'technology gadgets',
    stats: {
      likes: '3.1k',
      comments: '210',
      views: '30k',
    },
    comments: []
  },
  {
    id: 'h9',
    user: { id: 'user-hindi-9', name: 'पूजा चौधरी', avatar: 'https://i.pravatar.cc/150?u=hindi9' },
    content: 'बागवानी करना एक शांतिपूर्ण अनुभव है। अपने बगीचे में नए फूल लगाए। #बागवानी #फूल',
    image: 'https://picsum.photos/seed/hindi9/800/680',
    imageHint: 'gardening flowers',
    stats: {
      likes: '1.5k',
      comments: '95',
      views: '16.5k',
    },
    comments: []
  },
  {
    id: 'h10',
    user: { id: 'user-hindi-10', name: 'सुमित सिंह', avatar: 'https://i.pravatar.cc/150?u=hindi10' },
    content: 'संगीत आत्मा का भोजन है। आज पुराने हिंदी गाने सुन रहा हूँ। #संगीत #पुरानेगाने',
    image: 'https://picsum.photos/seed/hindi10/800/520',
    imageHint: 'listening music',
    stats: {
      likes: '2.8k',
      comments: '180',
      views: '25.5k',
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
  
  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleUpdateProfile = (name: string, avatarUrl: string) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, name, avatar: avatarUrl };
    setCurrentUser(updatedUser);

    // Update user info on their posts as well
    setPosts(posts.map(post => {
      if (post.user.id === currentUser.id) {
        return { ...post, user: updatedUser };
      }
      return post;
    }));
  };

  const handleLogin = (name: string, avatarUrl?: string) => {
    const newUser: User = {
      id: `user-${name.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`,
      name: name,
      avatar: avatarUrl || '',
    };
    setCurrentUser(newUser);
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar 
            currentUser={currentUser} 
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <CreatePost onCreatePost={handleCreatePost} currentUser={currentUser} />
            <div className="space-y-4 mt-4">
              {posts.map((post) => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    currentUser={currentUser}
                    onDeletePost={handleDeletePost}
                />
              ))}
            </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
