import type { ReactNode, MouseEventHandler } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface MenuButtonProps {
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon: ReactNode;
  label: string;
  className?: string;
  colorClassName?: string;
}

export function MenuButton({ href, onClick, icon, label, className, colorClassName }: MenuButtonProps) {
  const content = (
    <Card className="h-full transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 border-2 border-transparent group-hover:border-primary/50 bg-card overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
      <CardContent className="relative flex flex-col items-center justify-center p-4 sm:p-6 gap-4 h-full min-h-[160px]">
        <div className={cn("transition-colors duration-300 text-primary group-hover:text-accent", colorClassName)}>
          {icon}
        </div>
        <p className="text-center text-base font-bold text-card-foreground transition-colors duration-300">
          {label}
        </p>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={cn("group outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl", className)}>
        {content}
      </button>
    )
  }
  
  return (
    <Link href={href || '#'} className={cn("group outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-2xl", className)}>
      {content}
    </Link>
  );
}
