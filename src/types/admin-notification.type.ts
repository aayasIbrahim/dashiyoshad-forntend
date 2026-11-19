import type { Meta } from "./api.type";

export interface AdminNotification {
  id: string;
  title?: string | null;
  message?: string | null;
  type?: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface AdminNotificationListData {
  notifications: AdminNotification[];
  unreadCount: number;
  meta: Meta;
}

export interface AdminNotificationListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminNotificationListData;
}

export interface AdminNotificationSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminNotification;
}

export interface MarkAllNotificationsReadResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: { updatedCount: number };
}

export interface ListAdminNotificationsQuery {
  page?: number;
  limit?: number;
}
