import Link from 'next/link';
import { User, Bot, UserCog, Info, Gamepad2, Users, Coins, LogOut } from 'lucide-react';
import { MenuButton } from '@/components/menu-button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background p-4 sm:p-6 md:p-8 font-body">
      <header className="relative w-full mb-8 sm:mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary font-headline">
            Welcome To URA APP
          </h1>
        </div>
        <Link href="file:///android_asset/htmlapp/root/pppp.html" aria-label="User Profile" className="p-2 rounded-full hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors">
          <User className="h-8 w-8 text-primary hover:text-accent" />
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <MenuButton
            href="file:///android_asset/htmlapp/root/menu1.html"
            icon={<Bot className="h-10 w-10 sm:h-12 sm:w-12" />}
            label="Ai Services"
            colorClassName="text-chart-1"
          />
          <MenuButton
            href="file:///android_asset/htmlapp/root/menu2.html"
            icon={<UserCog className="h-10 w-10 sm:h-12 sm:w-12" />}
            label="Account, UPDATES AND REPORT"
            colorClassName="text-chart-2"
          />
          <MenuButton
            href="file:///android_asset/htmlapp/root/menu3.html"
            icon={<Info className="h-10 w-10 sm:h-12 sm:w-12" />}
            label="More info & Features"
            colorClassName="text-chart-3"
          />
          <MenuButton
            href="file:///android_asset/htmlapp/root/menu4.html"
            icon={<Gamepad2 className="h-10 w-10 sm:h-12 sm:w-12" />}
            label="Gaming zone"
            colorClassName="text-chart-4"
          />
          <MenuButton
            href="file:///android_asset/htmlapp/root/menu5.html"
            icon={<Users className="h-10 w-10 sm:h-12 sm:w-12" />}
            label="Public Features"
            colorClassName="text-chart-5"
          />
          <MenuButton
            href="file:///android_asset/htmlapp/root/menu6.html"
            icon={<Coins className="h-10 w-10 sm:h-12 sm:w-12" />}
            label="Lucks and trade"
            colorClassName="text-chart-1"
          />
          <MenuButton
            href="file:///android_asset/htmlapp/root/index.html"
            icon={<LogOut className="h-10 w-10 sm:h-12 sm:w-12" />}
            label="Exist Button"
            className="col-span-2 lg:col-span-1 lg:col-start-2"
            colorClassName="text-destructive"
          />
        </div>
      </main>

      <footer className="w-full text-center mt-8 sm:mt-12 pt-6 border-t">
        <p className="text-sm text-muted-foreground">
          URA network @2025 all right reserved
        </p>
      </footer>
    </div>
  );
}
