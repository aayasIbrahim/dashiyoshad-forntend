import {
  ChevronLeft,
  ChevronRight,
  Eye,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IOrder } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils/format.utils";
import {
  formatOrderStatus,
  orderStatusBadgeColors,
} from "@/utils/order-status.utils";

interface OrderTableProps {
  orders: IOrder[];
  page: number;
  totalPages: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
  onView: (order: IOrder) => void;
}

export function OrderTable({
  orders,
  page,
  totalPages,
  isFetching,
  onPageChange,
  onView,
}: OrderTableProps) {
  const pageCount = Math.max(totalPages, 1);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">
                Order
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Customer
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Payment
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Total
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Date
              </th>
              <th scope="col" className="px-5 py-3 text-right font-medium">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-muted/20">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 font-medium">
                    <PackageCheck
                      aria-hidden="true"
                      className="size-4 text-primary"
                    />
                    #{order.id.slice(0, 8).toUpperCase()}
                  </div>
                  {order.items ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  ) : null}
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium">{order.customerName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.customerPhone}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p>{order.paymentMethod === "BKASH" ? "bKash" : "Cash on delivery"}</p>
                  <p
                    className={
                      order.isPaid
                        ? "mt-1 text-xs text-emerald-700 dark:text-emerald-300"
                        : "mt-1 text-xs text-amber-700 dark:text-amber-300"
                    }
                  >
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </p>
                </td>
                <td className="px-5 py-4 font-medium">
                  {formatCurrency(order.totalPrice)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${orderStatusBadgeColors[order.orderStatus]}`}
                  >
                    {formatOrderStatus(order.orderStatus)}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDateTime(order.createdAt)}
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`View order ${order.id}`}
                    onClick={() => onView(order)}
                  >
                    <Eye aria-hidden="true" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p>
          Page {page} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-8 rounded-lg px-3"
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page <= 1 || isFetching}
          >
            <ChevronLeft aria-hidden="true" />
            Previous
          </Button>
          <Button
            variant="outline"
            className="h-8 rounded-lg px-3"
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            disabled={page >= totalPages || isFetching}
          >
            Next
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </>
  );
}
