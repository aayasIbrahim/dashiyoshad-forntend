"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CategorySearchProps {
  value: string;
  onSearch: (value: string) => void;
}

export function CategorySearch({ value, onSearch }: CategorySearchProps) {
  const [search, setSearch] = useState(value);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  return (
    <form
      className="flex gap-2"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(search.trim());
      }}
    >
      <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          aria-label="Search categories"
          placeholder="Search categories"
          className="h-9 rounded-xl pl-9"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <Button type="submit" className="h-9 rounded-xl px-3">
        Search
      </Button>
    </form>
  );
}
