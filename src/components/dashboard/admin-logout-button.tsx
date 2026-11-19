"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import { useLogout } from "@/hooks/auth.hook";

export function AdminLogoutButton() {
  const logout = useLogout();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: (response) => {
        if (response?.success === false) {
          toast.add({
            title: response.message || "Unable to log out",
            type: "error",
          });
          return;
        }

        queryClient.clear();
        router.replace("/login");
        router.refresh();
      },
      onError: (error) => {
        toast.add({
          title: "Unable to log out",
          description: error.message || "Please try again.",
          type: "error",
        });
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
          disabled={logout.isPending}
          tooltip="Log out"
        >
          <LogOut aria-hidden="true" />
          <span>{logout.isPending ? "Signing out…" : "Log out"}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
