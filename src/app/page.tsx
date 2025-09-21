'use client';

import { useState } from 'react';
import { User, Bot, UserCog, Info, Gamepad2, Users, Coins, LogOut, ArrowLeft } from 'lucide-react';
import { MenuButton } from '@/components/menu-button';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  const handleMenuClick = (url: string) => {
    setIframeSrc(url);
  };

  const handleBackClick = () => {
    setIframeSrc(null);
  }

  if (iframeSrc) {
    return (
      <div className="flex flex-col h-screen bg-background font-body">
        <header className="flex items-center p-2 border-b">
           <Button variant="ghost" size="icon" aria-label="Back to menu" onClick={handleBackClick}>
              <ArrowLeft className="h-6 w-6 text-primary" />
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
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background font-body">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 7L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 7L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 4.5L7 9.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              URA APP
            </h1>
        </div>
        <Button variant="ghost" size="icon" aria-label="User Profile" onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/pppp.html')}>
            <User className="h-6 w-6 text-primary" />
        </Button>
      </header>

      <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/menu1.html')}
            icon={<Bot className="h-10 w-10" />}
            label="Ai Services"
          />
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/menu2.html')}
            icon={<UserCog className="h-10 w-10" />}
            label="Account, UPDATES AND REPORT"
          />
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/menu3.html')}
            icon={<Info className="h-10 w-10" />}
            label="More info & Features"
          />
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/menu4.html')}
            icon={<Gamepad2 className="h-10 w-10" />}
            label="Gaming zone"
          />
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/menu5.html')}
            icon={<Users className="h-10 w-10" />}
            label="Public Features"
          />
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/menu6.html')}
            icon={<Coins className="h-10 w-10" />}
            label="Lucks and trade"
          />
          <MenuButton
            onClick={() => handleMenuClick('file:///android_asset/htmlapp/root/index.html')}
            icon={<LogOut className="h-10 w-10" />}
            label="Exit Button"
            colorClassName="text-destructive"
          />
        </div>
      </main>

       <footer className="w-full text-center p-4 border-t">
          <p className="text-xs text-muted-foreground">
            URA network @2025
          </p>
        </footer>
    </div>
  );
}
