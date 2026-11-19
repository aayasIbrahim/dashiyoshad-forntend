"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import {
  useGetAdminNotifications,
  useMarkAdminNotificationAsRead,
  useMarkAllAdminNotificationsAsRead,
} from "@/hooks/admin-notification.hook";
import type { AdminNotification } from "@/types";
import { formatDateTime } from "@/utils/format.utils";

const PAGE_SIZE = 20;

function notificationTitle(notification: AdminNotification) {
  if (notification.title?.trim()) return notification.title;
  if (notification.type?.trim()) {
    return notification.type
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return "Notification";
}

export default function NotificationList() {
  const [page, setPage] = useState(1);
  const { data, error, isPending, isFetching, refetch } =
    useGetAdminNotifications({ page, limit: PAGE_SIZE });
  const markRead = useMarkAdminNotificationAsRead();
  const markAllRead = useMarkAllAdminNotificationsAsRead();
  const notifications = data?.success ? data.data.notifications : [];
  const unreadCount = data?.success ? data.data.unreadCount : 0;
  const meta = data?.success ? data.data.meta : undefined;
  const responseError =
    error?.message || (!data?.success ? data?.message : undefined);

  const markOneRead = (notification: AdminNotification) => {
    markRead.mutate(notification.id, {
      onSuccess: (response) => {
        if (!response.success) {
          toast.add({
            title: response.message || "Unable to mark notification as read",
            type: "error",
          });
          return;
        }
        toast.add({ title: "Notification marked as read", type: "success" });
      },
      onError: (markError) => {
        toast.add({
          title: "Unable to mark notification as read",
          description: markError.message || "Please try again.",
          type: "error",
        });
      },
    });
  };

  const markAllReadNow = () => {
    markAllRead.mutate(undefined, {
      onSuccess: (response) => {
        if (!response.success) {
          toast.add({
            title: response.message || "Unable to mark notifications as read",
            type: "error",
          });
          return;
        }
        toast.add({
          title: "All notifications marked as read",
          type: "success",
        });
      },
      onError: (markError) => {
        toast.add({
          title: "Unable to mark notifications as read",
          description: markError.message || "Please try again.",
          type: "error",
        });
      },
    });
  };

  const pageCount = Math.max(meta?.totalPages ?? 1, 1);

  return (
    <main className="min-h-full space-y-6 bg-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Administration</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review updates for your admin account.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-9 rounded-xl px-3"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              aria-hidden="true"
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </Button>
          <Button
            className="h-9 rounded-xl px-3"
            onClick={markAllReadNow}
            disabled={unreadCount === 0 || markAllRead.isPending}
          >
            <CheckCheck aria-hidden="true" />
            {markAllRead.isPending ? "Marking…" : "Mark all as read"}
          </Button>
        </div>
      </div>

      <Card className="gap-0 rounded-2xl">
        <div className="flex items-center justify-between border-b p-4 sm:p-5">
          <div>
            <h2 className="font-semibold">Inbox</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {meta
                ? `${meta.total} ${
                    meta.total === 1 ? "notification" : "notifications"
                  }`
                : "Your latest notifications"}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {unreadCount} unread
          </span>
        </div>

        {isPending ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Loading notifications…
          </p>
        ) : responseError ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-sm text-destructive">{responseError}</p>
            <Button
              variant="outline"
              className="h-9 rounded-xl"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              Try again
            </Button>
          </div>
        ) : notifications.length ? (
          <>
            <ul className="divide-y">
              {notifications.map((notification) => {
                const isUnread = !notification.readAt;
                return (
                  <li
                    key={notification.id}
                    className={`flex gap-3 p-4 sm:items-start sm:px-5 ${
                      isUnread ? "bg-primary/[0.035]" : ""
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${
                        isUnread
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Bell aria-hidden="true" className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">
                          {notificationTitle(notification)}
                        </h3>
                        {isUnread && (
                          <span className="size-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                        {notification.message || "You have a new notification."}
                      </p>
                      <time
                        dateTime={notification.createdAt}
                        className="mt-2 block text-xs text-muted-foreground"
                      >
                        {formatDateTime(notification.createdAt)}
                      </time>
                    </div>
                    {isUnread && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 rounded-lg"
                        onClick={() => markOneRead(notification)}
                        disabled={markRead.isPending}
                        aria-label={`Mark ${notificationTitle(notification)} as read`}
                      >
                        <Check aria-hidden="true" />
                        <span className="hidden sm:inline">Mark read</span>
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p>
                Page {meta?.page ?? page} of {pageCount}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="h-8 rounded-lg px-3"
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                  disabled={page <= 1 || isFetching}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="h-8 rounded-lg px-3"
                  onClick={() =>
                    setPage((current) => Math.min(current + 1, pageCount))
                  }
                  disabled={page >= pageCount || isFetching}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Bell aria-hidden="true" className="size-5" />
            </span>
            <h3 className="font-medium">You’re all caught up</h3>
            <p className="text-sm text-muted-foreground">
              New admin notifications will appear here.
            </p>
          </div>
        )}
      </Card>
    </main>
  );
}
