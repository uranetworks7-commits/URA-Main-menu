'use client';

import { useState } from 'react';
import { User, Bot, UserCog, Info, Gamepad2, Users, Coins, LogOut, Home as HomeIcon } from 'lucide-react';
import { MenuButton } from '@/components/menu-button';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [iframeSrc, setIframeSrc] = useState<string>('about:blank');

  const handleMenuClick = (url: string) => {
    setIframeSrc(url);
  };

  return (
    <div className="flex h-screen bg-background font-body">
      <aside className="w-64 flex flex-col p-4 border-r">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-primary font-headline">
            URA APP
          </h1>
        </header>
        <nav className="flex flex-col gap-2 flex-grow">
          <Button variant="ghost" className="justify-start gap-2" onClick={() => handleMenuClick('about:blank')}>
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Button>
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/menu1.html')}
            icon={<Bot className="h-6 w-6" />}
            label="Ai Services"
            isButton={true}
          />
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/menu2.html')}
            icon={<UserCog className="h-6 w-6" />}
            label="Account, UPDATES AND REPORT"
            isButton={true}
          />
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/menu3.html')}
            icon={<Info className="h-6 w-6" />}
            label="More info & Features"
            isButton={true}
          />
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/menu4.html')}
            icon={<Gamepad2 className="h-6 w-6" />}
            label="Gaming zone"
            isButton={true}
          />
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/menu5.html')}
            icon={<Users className="h-6 w-6" />}
            label="Public Features"
            isButton={true}
          />
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/menu6.html')}
            icon={<Coins className="h-6 w-6" />}
            label="Lucks and trade"
            isButton={true}
          />
        </nav>
        <div className="mt-auto flex flex-col gap-2">
            <MenuButton
                onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/index.html')}
                icon={<LogOut className="h-6 w-6" />}
                label="Exit Button"
                colorClassName="text-destructive"
                isButton={true}
            />
            <footer className="w-full text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                URA network @2025
              </p>
            </footer>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-end p-2 border-b">
           <Button variant="ghost" size="icon" aria-label="User Profile" onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/pppp.html')}>
              <User className="h-6 w-6 text-primary" />
            </Button>
        </header>
        <div className="flex-grow bg-white">
          <iframe
            id="frame"
            src={iframeSrc}
            className="w-full h-full border-0"
            title="Content"
          />
        </div>
      </main>
    </div>
  );
}
