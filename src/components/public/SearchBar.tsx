"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  className,
}: SearchBarProps) {
  return (
    <form role="search" onSubmit={onSubmit} className={className}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search products..."
          className="h-10 rounded-full pl-9"
          aria-label="Search products"
        />
      </div>
    </form>
  );
}
