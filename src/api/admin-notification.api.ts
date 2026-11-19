import apiClient from "@/lib/apiClient";
import type {
  AdminNotificationListResponse,
  AdminNotificationSingleResponse,
  ListAdminNotificationsQuery,
  MarkAllNotificationsReadResponse,
} from "@/types";

const ADMIN_NOTIFICATIONS_ENDPOINT = "/admin/notifications";

export function getAdminNotifications(
  params: ListAdminNotificationsQuery = {},
) {
  return apiClient<AdminNotificationListResponse>(
    ADMIN_NOTIFICATIONS_ENDPOINT,
    { query: params },
  );
}

export function markAdminNotificationAsRead(id: string) {
  return apiClient<AdminNotificationSingleResponse>(
    `${ADMIN_NOTIFICATIONS_ENDPOINT}/${id}/read`,
    { method: "PATCH" },
  );
}

export function markAllAdminNotificationsAsRead() {
  return apiClient<MarkAllNotificationsReadResponse>(
    `${ADMIN_NOTIFICATIONS_ENDPOINT}/read-all`,
    { method: "PATCH" },
  );
}
