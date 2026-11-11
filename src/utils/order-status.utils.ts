import type { OrderStatus } from "@/types";

export const orderStatuses: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export const orderStatusColors: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500",
  PROCESSING: "bg-sky-500",
  SHIPPED: "bg-violet-500",
  DELIVERED: "bg-emerald-500",
  CANCELLED: "bg-rose-500",
};

export const orderStatusBadgeColors: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  PROCESSING: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  SHIPPED: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  DELIVERED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  CANCELLED: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export function formatOrderStatus(status: OrderStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}
