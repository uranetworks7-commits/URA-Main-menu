import type { ReactNode } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MenuButtonProps {
  href: string;
  icon: ReactNode;
  label: string;
  className?: string;
  colorClassName?: string;
}

export function MenuButton({ href, icon, label, className, colorClassName }: MenuButtonProps) {
  return (
    <Link href={href} className={cn("group outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl", className)}>
      <Card className="h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1.5 border-2 border-transparent group-hover:border-primary bg-card">
        <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 gap-3 h-full min-h-[150px]">
          <div className={cn("transition-colors duration-300", colorClassName)}>
            {icon}
          </div>
          <p className="text-center text-sm font-semibold text-card-foreground transition-colors duration-300">
            {label}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
