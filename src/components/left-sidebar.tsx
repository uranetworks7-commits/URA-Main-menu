'use client';
import {
  Users,
  Rss,
  Store,
  Clapperboard,
  Calendar,
  Clock,
  Bookmark,
  Flag,
  Settings,
  ShieldQuestion,
  UserCircle,
} from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

const mainLinks = [
  { icon: UserCircle, label: 'Your Name' }, // Placeholder
  { icon: Users, label: 'Friends' },
  { icon: Rss, label: 'Feeds' },
  { icon: Store, label: 'Marketplace' },
  { icon: Clapperboard, label: 'Watch' },
  { icon: Calendar, label: 'Events' },
  { icon: Clock, label: 'Memories' },
  { icon: Bookmark, label: 'Saved' },
  { icon: Flag, label: 'Pages' },
];

const settingLinks = [
  { icon: Settings, label: 'Settings & Privacy' },
  { icon: ShieldQuestion, label: 'Help & Support' },
];

export function LeftSidebar() {
  return (
    <aside className="hidden md:block w-80 bg-card border-r border-border">
      <ScrollArea className="h-full p-4">
        <nav className="space-y-1">
          {mainLinks.map(({ icon: Icon, label }) => (
            <Button key={label} variant="ghost" className="w-full justify-start gap-3 px-3">
              <Icon className="h-5 w-5 text-primary" />
              <span className="font-semibold">{label}</span>
            </Button>
          ))}
        </nav>
        <Separator className="my-4" />
        <nav className="space-y-1">
          {settingLinks.map(({ icon: Icon, label }) => (
            <Button key={label} variant="ghost" className="w-full justify-start gap-3 px-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">{label}</span>
            </Button>
          ))}
        </nav>
        <div className="p-4 mt-4 text-xs text-muted-foreground">
          <p>Privacy · Terms · Advertising · Ad Choices · Cookies · More · URA Network © 2025</p>
        </div>
      </ScrollArea>
    </aside>
  );
}
