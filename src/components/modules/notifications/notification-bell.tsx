"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import {
  useAdminNotificationStream,
  useGetAdminNotifications,
} from "@/hooks/admin-notification.hook";

export function NotificationBell() {
  const { data, error } = useGetAdminNotifications({ page: 1, limit: 5 });
  const streamStatus = useAdminNotificationStream();
  const unreadCount = data?.success ? data.data.unreadCount : 0;
  const responseError =
    error?.message || (!data?.success ? data?.message : undefined);
  const streamMessage =
    streamStatus === "connected"
      ? "Live notifications connected"
      : streamStatus === "reconnecting"
        ? "Live notifications reconnecting; periodic refresh is active"
        : streamStatus === "unavailable"
          ? "Live notifications unavailable; periodic refresh is active"
          : "Connecting to live notifications";

  return (
    <Link
      href="/admin/notifications"
      aria-label={
        responseError
          ? `Notifications unavailable: ${responseError}`
          : `Notifications${unreadCount ? `, ${unreadCount} unread` : ""}. ${streamMessage}`
      }
      title={responseError || streamMessage}
      className="relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Bell aria-hidden="true" className="size-4" />
      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-5 text-destructive-foreground">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
      <span className="sr-only">Open notifications</span>
    </Link>
  );
}
