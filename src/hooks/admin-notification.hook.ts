import {
  getAdminNotifications,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
} from "@/api";
import type { ListAdminNotificationsQuery } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const adminNotificationQueryKey = ["admin-notifications"] as const;

export type AdminNotificationStreamStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "unavailable";

export function useAdminNotificationStream() {
  const queryClient = useQueryClient();
  const [status, setStatus] =
    useState<AdminNotificationStreamStatus>("connecting");

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      setStatus("unavailable");
      return;
    }

    const streamUrl = `${apiBaseUrl.replace(/\/+$/, "")}/admin/notifications/stream`;
    const stream = new EventSource(streamUrl, { withCredentials: true });
    const refreshNotifications = () => {
      void queryClient.invalidateQueries({
        queryKey: adminNotificationQueryKey,
      });
    };
    const refreshEventNames = [
      "notification",
      "admin-notification",
      "unread-count",
    ];

    stream.addEventListener("message", refreshNotifications);
    refreshEventNames.forEach((eventName) =>
      stream.addEventListener(eventName, refreshNotifications),
    );
    stream.onopen = () => {
      setStatus("connected");
      refreshNotifications();
    };
    stream.onerror = () => setStatus("reconnecting");

    return () => {
      stream.close();
    };
  }, [queryClient]);

  return status;
}

export function useGetAdminNotifications(
  params: ListAdminNotificationsQuery = {},
) {
  return useQuery({
    queryKey: [...adminNotificationQueryKey, params],
    queryFn: () => getAdminNotifications(params),
    refetchInterval: 60_000,
  });
}

export function useMarkAdminNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAdminNotificationAsRead(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminNotificationQueryKey }),
  });
}

export function useMarkAllAdminNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllAdminNotificationsAsRead(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminNotificationQueryKey }),
  });
}
