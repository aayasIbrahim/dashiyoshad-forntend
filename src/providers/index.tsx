"use client";

import { ReactNode } from "react";
import QueryProvider from "./query.provider";

import { TooltipProvider } from "@/components/ui/tooltip";
import StoreProvider from "./store.provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <QueryProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryProvider>
    </StoreProvider>
  );
}
