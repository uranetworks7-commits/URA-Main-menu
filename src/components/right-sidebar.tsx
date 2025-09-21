'use client';
import { Video, Gift, Search, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const sponsoredItems = [{ title: 'Publish Your Ad', description: 'Get seen by thousands of users today. Click to create your ad campaign.', link: 'youradshere.com' }];

const contacts = [
  { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' },
  { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' },
  { name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c' },
  { name: 'Emily Davis', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
];

export function RightSidebar() {
  return (
    <aside className="hidden lg:block w-80 bg-card border-l border-border p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Sponsored</h3>
        {sponsoredItems.map((item) => (
          <a href="#" key={item.title} className="block p-2 rounded-lg hover:bg-secondary">
            <p className="font-bold text-primary">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <p className="text-xs text-accent">{item.link}</p>
          </a>
        ))}
      </div>
      <Separator />
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-foreground">Contacts</h3>
          <div className="flex gap-2 text-muted-foreground">
            <Video className="h-5 w-5" />
            <Search className="h-5 w-5" />
            <MoreHorizontal className="h-5 w-5" />
          </div>
        </div>
        <div className="space-y-2">
          {contacts.map((contact) => (
            <Button variant="ghost" key={contact.name} className="w-full justify-start gap-3 h-12">
              <Avatar>
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">{contact.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
}
