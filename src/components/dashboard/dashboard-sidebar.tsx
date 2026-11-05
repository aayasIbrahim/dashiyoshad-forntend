"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  Bell,
  Boxes,
  ChartNoAxesCombined,
  LayoutDashboard,
  Package,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  Tags,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { adminRoutes } from "@/routes";
import type { SidebarItems, UserRole } from "@/types";

const sidebarRoutes: Partial<Record<UserRole, SidebarItems>> = {
  SUPER_ADMIN: adminRoutes,
  ADMIN: adminRoutes,
};

const menuIcons: Record<string, LucideIcon> = {
  Overview: LayoutDashboard,
  Products: Package,
  Categories: Tags,
  Inventory: Boxes,
  Orders: ShoppingCart,
  Discounts: Archive,
  "All customers": UsersRound,
  Analytics: ChartNoAxesCombined,
  Notifications: Bell,
  Settings: Settings2,
};

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const routes: SidebarItems = sidebarRoutes[role] || [];

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border px-5 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <ShoppingBag aria-hidden="true" className="size-5" />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
              Dashiyoshad
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">
              STORE MANAGEMENT
            </span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-2 px-3 py-5">
        {routes.map((item) => (
          <SidebarGroup key={item.title} className="px-0 py-1">
            <SidebarGroupLabel className="h-7 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {item.items.map((item) => {
                  const Icon = menuIcons[item.title] ?? LayoutDashboard;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={pathname === item.url}
                        size="lg"
                        render={<a href={item.url} />}
                        className="rounded-xl px-3 text-sm text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-primary/10 data-[active=true]:font-semibold data-[active=true]:text-primary"
                      >
                        <Icon aria-hidden="true" className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/70 p-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-primary ring-1 ring-border">
            <ShoppingBag aria-hidden="true" className="size-4" />
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="truncate text-xs font-semibold text-sidebar-foreground">
              Your storefront
            </span>
            <span className="text-[11px] text-muted-foreground">
              Admin workspace
            </span>
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
