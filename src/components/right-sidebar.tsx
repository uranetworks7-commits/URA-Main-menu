'use client';
import { Video, Gift, Search, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const sponsoredItems = [{ title: 'Publish Your Ad', description: 'Get seen by thousands of users today. Click to create your ad campaign.', link: 'youradshere.com' }];

const contacts = [
  { name: 'R4JpUT_BoY', avatar: 'https://i.pravatar.cc/150?u=R4JpUT_BoY' },
  { name: 'Xx_Venom_xX', avatar: 'https://i.pravatar.cc/150?u=Xx_Venom_xX' },
  { name: 'Daku_99', avatar: 'https://i.pravatar.cc/150?u=Daku_99' },
  { name: 'Shadow_King', avatar: 'https://i.pravatar.cc/150?u=Shadow_King' },
  { name: 'RDX_Ansh', avatar: 'https://i.pravatar.cc/150?u=RDX_Ansh' },
  { name: 'UtkxSh', avatar: 'https://i.pravatar.cc/150?u=UtkxSh' },
  { name: 'Killer_OP', avatar: 'https://i.pravatar.cc/150?u=Killer_OP' },
  { name: 'MR_LOOT3R', avatar: 'https://i.pravatar.cc/150?u=MR_LOOT3R' },
  { name: 'Sniper_Ajay', avatar: 'https://i.pravatar.cc/150?u=Sniper_Ajay' },
  { name: 'Thug_Rohit', avatar: 'https://i.pravatar.cc/150?u=Thug_Rohit' },
  { name: 'Queen_Anu', avatar: 'https://i.pravatar.cc/150?u=Queen_Anu' },
  { name: 'Angel_Riya', avatar: 'https://i.pravatar.cc/150?u=Angel_Riya' },
  { name: 'Gamer_Priya', avatar: 'https://i.pravatar.cc/150?u=Gamer_Priya' },
  { name: 'Xx_Nikita_xX', avatar: 'https://i.pravatar.cc/150?u=Xx_Nikita_xX' },
  { name: 'Devil_Girl', avatar: 'https://i.pravatar.cc/150?u=Devil_Girl' },
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
