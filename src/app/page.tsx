'use client';
import { useState, useEffect } from 'react';
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
    { id: 'post-R4JpUT_BoY', user: { id: 'user-R4JpUT_BoY', name: 'R4JpUT_BoY', avatar: 'https://i.pravatar.cc/150?u=R4JpUT_BoY' }, content: 'New high score! Can anyone beat this?', image: 'https://picsum.photos/seed/p1/800/600', stats: { likes: '150', comments: '20', views: '1.2k' }, comments: [] },
    { id: 'post-Xx_Venom_xX', user: { id: 'user-Xx_Venom_xX', name: 'Xx_Venom_xX', avatar: 'https://i.pravatar.cc/150?u=Xx_Venom_xX' }, content: 'Just chilling and playing some games.', image: 'https://picsum.photos/seed/p2/800/600', stats: { likes: '200', comments: '30', views: '1.8k' }, comments: [] },
    { id: 'post-Daku_99', user: { id: 'user-Daku_99', name: 'Daku_99', avatar: 'https://i.pravatar.cc/150?u=Daku_99' }, content: 'This new update is lit! #gaming', image: 'https://picsum.photos/seed/p3/800/600', stats: { likes: '120', comments: '15', views: '1.1k' }, comments: [] },
    { id: 'post-Shadow_King', user: { id: 'user-Shadow_King', name: 'Shadow_King', avatar: 'https://i.pravatar.cc/150?u=Shadow_King' }, content: 'In the shadows, I reign supreme.', image: 'https://picsum.photos/seed/p4/800/600', stats: { likes: '300', comments: '40', views: '2.5k' }, comments: [] },
    { id: 'post-RDX_Ansh', user: { id: 'user-RDX_Ansh', name: 'RDX_Ansh', avatar: 'https://i.pravatar.cc/150?u=RDX_Ansh' }, content: 'Explosive gameplay today!', image: 'https://picsum.photos/seed/p5/800/600', stats: { likes: '180', comments: '25', views: '1.5k' }, comments: [] },
    { id: 'post-UtkxSh', user: { id: 'user-UtkxSh', name: 'UtkxSh', avatar: 'https://i.pravatar.cc/150?u=UtkxSh' }, content: 'Loving the new skin.', image: 'https://picsum.photos/seed/p6/800/600', stats: { likes: '90', comments: '10', views: '900' }, comments: [] },
    { id: 'post-Killer_OP', user: { id: 'user-Killer_OP', name: 'Killer_OP', avatar: 'https://i.pravatar.cc/150?u=Killer_OP' }, content: 'Overpowered and loving it!', image: 'https://picsum.photos/seed/p7/800/600', stats: { likes: '250', comments: '35', views: '2.2k' }, comments: [] },
    { id: 'post-MR_LOOT3R', user: { id: 'user-MR_LOOT3R', name: 'MR_LOOT3R', avatar: 'https://i.pravatar.cc/150?u=MR_LOOT3R' }, content: 'Got some epic loot today.', image: 'https://picsum.photos/seed/p8/800/600', stats: { likes: '160', comments: '22', views: '1.4k' }, comments: [] },
    { id: 'post-Sniper_Ajay', user: { id: 'user-Sniper_Ajay', name: 'Sniper_Ajay', avatar: 'https://i.pravatar.cc/150?u=Sniper_Ajay' }, content: 'Headshot! #sniper', image: 'https://picsum.photos/seed/p9/800/600', stats: { likes: '220', comments: '32', views: '2k' }, comments: [] },
    { id: 'post-Thug_Rohit', user: { id: 'user-Thug_Rohit', name: 'Thug_Rohit', avatar: 'https://i.pravatar.cc/150?u=Thug_Rohit' }, content: 'Thug life.', image: 'https://picsum.photos/seed/p10/800/600', stats: { likes: '190', comments: '28', views: '1.6k' }, comments: [] },
    { id: 'post-iTz_Psycho', user: { id: 'user-iTz_Psycho', name: 'iTz_Psycho', avatar: 'https://i.pravatar.cc/150?u=iTz_Psycho' }, content: 'Going psycho mode.', image: 'https://picsum.photos/seed/p11/800/600', stats: { likes: '280', comments: '38', views: '2.4k' }, comments: [] },
    { id: 'post-Løne_Wølf', user: { id: 'user-Løne_Wølf', name: 'Løne_Wølf', avatar: 'https://i.pravatar.cc/150?u=Løne_Wølf' }, content: 'I walk alone.', image: 'https://picsum.photos/seed/p12/800/600', stats: { likes: '320', comments: '45', views: '2.8k' }, comments: [] },
    { id: 'post-Devil_Akash', user: { id: 'user-Devil_Akash', name: 'Devil_Akash', avatar: 'https://i.pravatar.cc/150?u=Devil_Akash' }, content: 'Unleashing the devil within.', image: 'https://picsum.photos/seed/p13/800/600', stats: { likes: '260', comments: '36', views: '2.3k' }, comments: [] },
    { id: 'post-Hunter_07', user: { id: 'user-Hunter_07', name: 'Hunter_07', avatar: 'https://i.pravatar.cc/150?u=Hunter_07' }, content: 'On the hunt for victory.', image: 'https://picsum.photos/seed/p14/800/600', stats: { likes: '210', comments: '31', views: '1.9k' }, comments: [] },
    { id: 'post-Alpha_RDX', user: { id: 'user-Alpha_RDX', name: 'Alpha_RDX', avatar: 'https://i.pravatar.cc/150?u=Alpha_RDX' }, content: 'Alpha of the pack.', image: 'https://picsum.photos/seed/p15/800/600', stats: { likes: '350', comments: '50', views: '3k' }, comments: [] },
    { id: 'post-BossYadav', user: { id: 'user-BossYadav', name: 'BossYadav', avatar: 'https://i.pravatar.cc/150?u=BossYadav' }, content: 'Like a boss.', image: 'https://picsum.photos/seed/p16/800/600', stats: { likes: '230', comments: '33', views: '2.1k' }, comments: [] },
    { id: 'post-DARK_Samrat', user: { id: 'user-DARK_Samrat', name: 'DARK_Samrat', avatar: 'https://i.pravatar.cc/150?u=DARK_Samrat' }, content: 'The dark emperor.', image: 'https://picsum.photos/seed/p17/800/600', stats: { likes: '290', comments: '39', views: '2.6k' }, comments: [] },
    { id: 'post-RX_Prince', user: { id: 'user-RX_Prince', name: 'RX_Prince', avatar: 'https://i.pravatar.cc/150?u=RX_Prince' }, content: 'Royalty in the game.', image: 'https://picsum.photos/seed/p18/800/600', stats: { likes: '240', comments: '34', views: '2.2k' }, comments: [] },
    { id: 'post-Nawabi_Boy', user: { id: 'user-Nawabi_Boy', name: 'Nawabi_Boy', avatar: 'https://i.pravatar.cc/150?u=Nawabi_Boy' }, content: 'Living the Nawabi life.', image: 'https://picsum.photos/seed/p19/800/600', stats: { likes: '200', comments: '29', views: '1.7k' }, comments: [] },
    { id: 'post-GAMER_Ravi', user: { id: 'user-GAMER_Ravi', name: 'GAMER_Ravi', avatar: 'https://i.pravatar.cc/150?u=GAMER_Ravi' }, content: 'Just another day of gaming.', image: 'https://picsum.photos/seed/p20/800/600', stats: { likes: '170', comments: '24', views: '1.5k' }, comments: [] },
    { id: 'post-Rudra_999', user: { id: 'user-Rudra_999', name: 'Rudra_999', avatar: 'https://i.pravatar.cc/150?u=Rudra_999' }, content: 'The fury of Rudra.', image: 'https://picsum.photos/seed/p21/800/600', stats: { likes: '310', comments: '42', views: '2.7k' }, comments: [] },
    { id: 'post-Don_Rajput', user: { id: 'user-Don_Rajput', name: 'Don_Rajput', avatar: 'https://i.pravatar.cc/150?u=Don_Rajput' }, content: 'The Don has arrived.', image: 'https://picsum.photos/seed/p22/800/600', stats: { likes: '270', comments: '37', views: '2.4k' }, comments: [] },
    { id: 'post-Aadi_Fury', user: { id: 'user-Aadi_Fury', name: 'Aadi_Fury', avatar: 'https://i.pravatar.cc/150?u=Aadi_Fury' }, content: 'Feel my fury.', image: 'https://picsum.photos/seed/p23/800/600', stats: { likes: '260', comments: '36', views: '2.3k' }, comments: [] },
    { id: 'post-ViperX', user: { id: 'user-ViperX', name: 'ViperX', avatar: 'https://i.pravatar.cc/150?u=ViperX' }, content: 'Strike like a viper.', image: 'https://picsum.photos/seed/p24/800/600', stats: { likes: '280', comments: '38', views: '2.5k' }, comments: [] },
    { id: 'post-HellBoy_Aryan', user: { id: 'user-HellBoy_Aryan', name: 'HellBoy_Aryan', avatar: 'https://i.pravatar.cc/150?u=HellBoy_Aryan' }, content: 'Straight from hell.', image: 'https://picsum.photos/seed/p25/800/600', stats: { likes: '300', comments: '40', views: '2.6k' }, comments: [] },
    { id: 'post-SKULL_Master', user: { id: 'user-SKULL_Master', name: 'SKULL_Master', avatar: 'https://i.pravatar.cc/150?u=SKULL_Master' }, content: 'Master of skulls.', image: 'https://picsum.photos/seed/p26/800/600', stats: { likes: '330', comments: '44', views: '2.9k' }, comments: [] },
    { id: 'post-Cobra_YT', user: { id: 'user-Cobra_YT', name: 'Cobra_YT', avatar: 'https://i.pravatar.cc/150?u=Cobra_YT' }, content: 'Cobra on YouTube!', image: 'https://picsum.photos/seed/p27/800/600', stats: { likes: '240', comments: '33', views: '2.1k' }, comments: [] },
    { id: 'post-Bullet_Boy', user: { id: 'user-Bullet_Boy', name: 'Bullet_Boy', avatar: 'https://i.pravatar.cc/150?u=Bullet_Boy' }, content: 'Faster than a bullet.', image: 'https://picsum.photos/seed/p28/800/600', stats: { likes: '220', comments: '31', views: '2k' }, comments: [] },
    { id: 'post-S4NkY', user: { id: 'user-S4NkY', name: 'S4NkY', avatar: 'https://i.pravatar.cc/150?u=S4NkY' }, content: 'Just being Sanky.', image: 'https://picsum.photos/seed/p29/800/600', stats: { likes: '150', comments: '21', views: '1.3k' }, comments: [] },
    { id: 'post-Toxic_RDX', user: { id: 'user-Toxic_RDX', name: 'Toxic_RDX', avatar: 'https://i.pravatar.cc/150?u=Toxic_RDX' }, content: 'Toxicity at its finest.', image: 'https://picsum.photos/seed/p30/800/600', stats: { likes: '290', comments: '39', views: '2.5k' }, comments: [] },
    { id: 'post-MR._Unknown', user: { id: 'user-MR._Unknown', name: 'MR. Unknown', avatar: 'https://i.pravatar.cc/150?u=MR._Unknown' }, content: 'Who am I?', image: 'https://picsum.photos/seed/p31/800/600', stats: { likes: '340', comments: '46', views: '3k' }, comments: [] },
    { id: 'post-AK_47_Bhai', user: { id: 'user-AK_47_Bhai', name: 'AK_47_Bhai', avatar: 'https://i.pravatar.cc/150?u=AK_47_Bhai' }, content: 'AK-47 is my best friend.', image: 'https://picsum.photos/seed/p32/800/600', stats: { likes: '280', comments: '38', views: '2.6k' }, comments: [] },
    { id: 'post-ᴍᴇɢᴀ_ʙᴏʏ', user: { id: 'user-ᴍᴇɢᴀ_ʙᴏʏ', name: 'ᴍᴇɢᴀ_ʙᴏʏ', avatar: 'https://i.pravatar.cc/150?u=ᴍᴇɢᴀ_ʙᴏʏ' }, content: 'Mega power!', image: 'https://picsum.photos/seed/p33/800/600', stats: { likes: '260', comments: '35', views: '2.4k' }, comments: [] },
    { id: 'post-Beast_Raaj', user: { id: 'user-Beast_Raaj', name: 'Beast_Raaj', avatar: 'https://i.pravatar.cc/150?u=Beast_Raaj' }, content: 'Unleash the beast.', image: 'https://picsum.photos/seed/p34/800/600', stats: { likes: '320', comments: '43', views: '2.8k' }, comments: [] },
    { id: 'post-Ghost_Yadav', user: { id: 'user-Ghost_Yadav', name: 'Ghost_Yadav', avatar: 'https://i.pravatar.cc/150?u=Ghost_Yadav' }, content: 'Now you see me, now you don\'t.', image: 'https://picsum.photos/seed/p35/800/600', stats: { likes: '310', comments: '41', views: '2.7k' }, comments: [] },
    { id: 'post-ᏒᎥᎥᏢᎥᴋᴇ', user: { id: 'user-ᏒᎥᎥᏢᎥᴋᴇ', name: 'ᏒᎥᎥᏢᎥᴋᴇ', avatar: 'https://i.pravatar.cc/150?u=ᏒᎥᎥᏢᎥᴋᴇ' }, content: 'Spike it!', image: 'https://picsum.photos/seed/p36/800/600', stats: { likes: '200', comments: '28', views: '1.8k' }, comments: [] },
    { id: 'post-Sn1per_Raj', user: { id: 'user-Sn1per_Raj', name: 'Sn1per_Raj', avatar: 'https://i.pravatar.cc/150?u=Sn1per_Raj' }, content: 'One shot, one kill.', image: 'https://picsum.photos/seed/p37/800/600', stats: { likes: '270', comments: '37', views: '2.5k' }, comments: [] },
    { id: 'post-Xtreme_Aadi', user: { id: 'user-Xtreme_Aadi', name: 'Xtreme_Aadi', avatar: 'https://i.pravatar.cc/150?u=Xtreme_Aadi' }, content: 'Living on the edge.', image: 'https://picsum.photos/seed/p38/800/600', stats: { likes: '250', comments: '34', views: '2.3k' }, comments: [] },
    { id: 'post-Rocky_OP', user: { id: 'user-Rocky_OP', name: 'Rocky_OP', avatar: 'https://i.pravatar.cc/150?u=Rocky_OP' }, content: 'Rocky is Overpowered!', image: 'https://picsum.photos/seed/p39/800/600', stats: { likes: '300', comments: '40', views: '2.7k' }, comments: [] },
    { id: 'post-Mafia_Sumit', user: { id: 'user-Mafia_Sumit', name: 'Mafia_Sumit', avatar: 'https://i.pravatar.cc/150?u=Mafia_Sumit' }, content: 'The mafia boss.', image: 'https://picsum.photos/seed/p40/800/600', stats: { likes: '280', comments: '38', views: '2.6k' }, comments: [] },
    { id: 'post-BholenathX', user: { id: 'user-BholenathX', name: 'BholenathX', avatar: 'https://i.pravatar.cc/150?u=BholenathX' }, content: 'Har Har Mahadev.', image: 'https://picsum.photos/seed/p41/800/600', stats: { likes: '350', comments: '50', views: '3.1k' }, comments: [] },
    { id: 'post-Zero_K1ng', user: { id: 'user-Zero_K1ng', name: 'Zero_K1ng', avatar: 'https://i.pravatar.cc/150?u=Zero_K1ng' }, content: 'King from zero.', image: 'https://picsum.photos/seed/p42/800/600', stats: { likes: '290', comments: '39', views: '2.6k' }, comments: [] },
    { id: 'post-Thunder_Boy', user: { id: 'user-Thunder_Boy', name: 'Thunder_Boy', avatar: 'https://i.pravatar.cc/150?u=Thunder_Boy' }, content: 'Feel the thunder.', image: 'https://picsum.photos/seed/p43/800/600', stats: { likes: '260', comments: '36', views: '2.4k' }, comments: [] },
    { id: 'post-Zⱥyan', user: { id: 'user-Zⱥyan', name: 'Zⱥyan', avatar: 'https://i.pravatar.cc/150?u=Zⱥyan' }, content: 'Zayan in the house.', image: 'https://picsum.photos/seed/p44/800/600', stats: { likes: '210', comments: '30', views: '1.9k' }, comments: [] },
    { id: 'post-Dragon_Manish', user: { id: 'user-Dragon_Manish', name: 'Dragon_Manish', avatar: 'https://i.pravatar.cc/150?u=Dragon_Manish' }, content: 'Breathing fire.', image: 'https://picsum.photos/seed/p45/800/600', stats: { likes: '330', comments: '45', views: '2.9k' }, comments: [] },
    { id: 'post-Sasta_Shroud', user: { id: 'user-Sasta_Shroud', name: 'Sasta_Shroud', avatar: 'https://i.pravatar.cc/150?u=Sasta_Shroud' }, content: 'Not the real Shroud, but close.', image: 'https://picsum.photos/seed/p46/800/600', stats: { likes: '240', comments: '33', views: '2.2k' }, comments: [] },
    { id: 'post-RX100_Gamer', user: { id: 'user-RX100_Gamer', name: 'RX100_Gamer', avatar: 'https://i.pravatar.cc/150?u=RX100_Gamer' }, content: 'Riding and gaming.', image: 'https://picsum.photos/seed/p47/800/600', stats: { likes: '220', comments: '31', views: '2.1k' }, comments: [] },
    { id: 'post-Dark_Legend', user: { id: 'user-Dark_Legend', name: 'Dark_Legend', avatar: 'https://i.pravatar.cc/150?u=Dark_Legend' }, content: 'A legend in the dark.', image: 'https://picsum.photos/seed/p48/800/600', stats: { likes: '360', comments: '52', views: '3.2k' }, comments: [] },
    { id: 'post-Hacker_Bro', user: { id: 'user-Hacker_Bro', name: 'Hacker_Bro', avatar: 'https://i.pravatar.cc/150?u=Hacker_Bro' }, content: 'Hacking my way to the top.', image: 'https://picsum.photos/seed/p49/800/600', stats: { likes: '290', comments: '39', views: '2.7k' }, comments: [] },
    { id: 'post-King_99', user: { id: 'user-King_99', name: 'King_99', avatar: 'https://i.pravatar.cc/150?u=King_99' }, content: 'The one true king.', image: 'https://picsum.photos/seed/p50/800/600', stats: { likes: '380', comments: '55', views: '3.5k' }, comments: [] },
    { id: 'post-Queen_Anu', user: { id: 'user-Queen_Anu', name: 'Queen_Anu', avatar: 'https://i.pravatar.cc/150?u=Queen_Anu' }, content: 'The queen of the game.', image: 'https://picsum.photos/seed/p51/800/600', stats: { likes: '370', comments: '53', views: '3.4k' }, comments: [] },
    { id: 'post-Angel_Riya', user: { id: 'user-Angel_Riya', name: 'Angel_Riya', avatar: 'https://i.pravatar.cc/150?u=Angel_Riya' }, content: 'Playing like an angel.', image: 'https://picsum.photos/seed/p52/800/600', stats: { likes: '340', comments: '48', views: '3.1k' }, comments: [] },
    { id: 'post-D3si_GirlX', user: { id: 'user-D3si_GirlX', name: 'D3si_GirlX', avatar: 'https://i.pravatar.cc/150?u=D3si_GirlX' }, content: 'Desi and proud.', image: 'https://picsum.photos/seed/p53/800/600', stats: { likes: '280', comments: '38', views: '2.6k' }, comments: [] },
    { id: 'post-Gamer_Priya', user: { id: 'user-Gamer_Priya', name: 'Gamer_Priya', avatar: 'https://i.pravatar.cc/150?u=Gamer_Priya' }, content: 'Priya the gamer.', image: 'https://picsum.photos/seed/p54/800/600', stats: { likes: '260', comments: '36', views: '2.4k' }, comments: [] },
    { id: 'post-MissFire_07', user: { id: 'user-MissFire_07', name: 'MissFire_07', avatar: 'https://i.pravatar.cc/150?u=MissFire_07' }, content: 'Oops, did I miss?', image: 'https://picsum.photos/seed/p55/800/600', stats: { likes: '230', comments: '32', views: '2.2k' }, comments: [] },
    { id: 'post-Cutee_Aaru', user: { id: 'user-Cutee_Aaru', name: 'Cutee_Aaru', avatar: 'https://i.pravatar.cc/150?u=Cutee_Aaru' }, content: 'Cute but deadly.', image: 'https://picsum.photos/seed/p56/800/600', stats: { likes: '290', comments: '39', views: '2.7k' }, comments: [] },
    { id: 'post-Xx_Nikita_xX', user: { id: 'user-Xx_Nikita_xX', name: 'Xx_Nikita_xX', avatar: 'https://i.pravatar.cc/150?u=Xx_Nikita_xX' }, content: 'Nikita here!', image: 'https://picsum.photos/seed/p57/800/600', stats: { likes: '270', comments: '37', views: '2.5k' }, comments: [] },
    { id: 'post-Devil_Girl', user: { id: 'user-Devil_Girl', name: 'Devil_Girl', avatar: 'https://i.pravatar.cc/150?u=Devil_Girl' }, content: 'The devil in disguise.', image: 'https://picsum.photos/seed/p58/800/600', stats: { likes: '310', comments: '42', views: '2.8k' }, comments: [] },
    { id: 'post-Pinky_OP', user: { id: 'user-Pinky_OP', name: 'Pinky_OP', avatar: 'https://i.pravatar.cc/150?u=Pinky_OP' }, content: 'Pinky is OP!', image: 'https://picsum.photos/seed/p59/800/600', stats: { likes: '250', comments: '35', views: '2.3k' }, comments: [] },
];

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user data exists in local storage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

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
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));


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
    localStorage.setItem('currentUser', JSON.stringify(newUser));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
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
