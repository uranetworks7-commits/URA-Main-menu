'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortType = 'feed' | 'popular' | 'newest' | 'old';

interface FilterDropdownProps {
  value: SortType;
  onValueChange: (value: SortType) => void;
}

export function FilterDropdown({ value, onValueChange }: FilterDropdownProps) {
  return (
    <div className="absolute right-2.5 top-1.5">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Filter className="h-4 w-4 text-yellow-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={value} onValueChange={(v) => onValueChange(v as SortType)}>
                    <DropdownMenuRadioItem value="feed">Feed (Normal)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="popular" className="text-green-500">Popular</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="newest" className="text-purple-500">Newest</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="old" className="text-red-500">Old</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
