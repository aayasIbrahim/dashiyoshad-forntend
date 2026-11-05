"use client";

import { Store } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import type { UserRole } from "@/types";

export default function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole;
}) {
  const pathname = usePathname();
  const currentSegment = pathname.split("/").filter(Boolean).at(-1);
  const pageTitle =
    pathname === "/admin" || !currentSegment
      ? "Overview"
      : currentSegment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

  return (
    <SidebarProvider>
      <DashboardSidebar role={role} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="-ml-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" />
            <Separator
              orientation="vertical"
              className="hidden h-5 sm:block"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">
                {pageTitle}
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Manage your store in one place
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Store aria-hidden="true" className="size-3.5 text-primary" />
            <span className="hidden sm:inline">Store admin</span>
            <span className="sm:hidden">Admin</span>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}