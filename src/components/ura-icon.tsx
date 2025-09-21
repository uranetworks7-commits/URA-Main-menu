import { cn } from "@/lib/utils";

export function UraIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-8 w-8 text-primary", className)} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20 20 L 80 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d="M 80 20 L 20 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}
