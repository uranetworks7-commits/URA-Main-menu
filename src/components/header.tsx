'use client';

import { Search, Home, Users, Clapperboard, Store, Bell, MessageCircle, UserCircle, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
import { LeftSidebar } from './left-sidebar';

export function Header() {
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
            <LeftSidebar />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
           <svg
              className="h-8 w-8 text-primary"
              viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          <h1 className="text-xl font-bold text-primary hidden sm:block">URA Social</h1>
        </div>
        <div className="relative ml-4 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search URA Social" className="pl-8 w-64 bg-background" />
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
        <Button variant="ghost" size="icon" className="rounded-full bg-secondary hover:bg-muted">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-secondary hover:bg-muted">
          <MessageCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-secondary hover:bg-muted">
          <UserCircle className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
