'use client';

import { Search, Home, Users, Clapperboard, Store, Menu, LogOut, Settings, BarChart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
import { LeftSidebar } from './left-sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ProfileSettingsDialog } from './profile-settings-dialog';
import type { User, Post } from './post-card';
import { useState } from 'react';
import { UraIcon } from './ura-icon';
import Link from 'next/link';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onUpdateProfile: (name: string, avatarUrl: string) => void;
  userPosts: Post[];
}


export function Header({ currentUser, onLogout, onUpdateProfile, userPosts }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-4 bg-card border-b border-border shadow-sm">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-card">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            {currentUser && <LeftSidebar currentUser={currentUser} onLogout={onLogout} onUpdateProfile={onUpdateProfile} userPosts={userPosts} />}
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
           <svg className="h-8 w-8 text-primary" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M 20 20 L 80 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                <path d="M 80 20 L 20 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            </svg>
          <h1 className="text-xl font-bold text-primary hidden sm:block">URA-X</h1>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-2">
        <Button variant="ghost" size="icon" className="w-24 h-12 rounded-lg hover:bg-secondary">
          <Home className="h-6 w-6 text-primary" />
        </Button>
        <Button variant="ghost" size="icon" className="w-24 h-12 rounded-lg hover:bg-secondary">
          <Users className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="w-24 h-12 rounded-lg hover:bg-secondary">
          <Clapperboard className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="w-24 h-12 rounded-lg hover:bg-secondary">
          <Store className="h-6 w-6" />
        </Button>
      </nav>
      <div className="flex items-center gap-2">
        <Link href="/analytics">
          <Button variant="ghost" size="icon" className="rounded-full bg-secondary hover:bg-muted">
            <BarChart className="h-5 w-5" />
          </Button>
        </Link>
        {currentUser && (
          <ProfileSettingsDialog 
              currentUser={currentUser}
              onUpdateProfile={onUpdateProfile}
              isOpen={isSettingsOpen}
              onOpenChange={setIsSettingsOpen}
            >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-secondary hover:bg-muted">
                     <Avatar className="h-8 w-8">
                       <AvatarImage src={currentUser.avatar} />
                       <AvatarFallback>
                         {currentUser.avatar ? currentUser.name.charAt(0) : <UraIcon className="h-5 w-5" />}
                       </AvatarFallback>
                     </Avatar>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                      <Avatar>
                          <AvatarImage src={currentUser.avatar} />
                          <AvatarFallback>
                            {currentUser.avatar ? currentUser.name.charAt(0) : <UraIcon className="h-6 w-6" />}
                          </AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="font-bold">{currentUser.name}</p>
                          <p className="text-xs text-muted-foreground">View your profile</p>
                      </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setIsSettingsOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings & Privacy</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ProfileSettingsDialog>
        )}
      </div>
    </header>
  );
}
