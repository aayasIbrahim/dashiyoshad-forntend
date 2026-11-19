"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import {
  orderQueryKey,
  useGetOrderById,
  useGetOrders,
  useUpdateOrderShippingFee,
  useUpdateOrderStatus,
} from "@/hooks/order.hook";
import { useQueryClient } from "@tanstack/react-query";
import type {
  IOrder,
  OrderPaymentMethod,
  OrderStatus,
  UpdatableOrderStatus,
} from "@/types";
import { formatCurrency, formatDateTime } from "@/utils/format.utils";
import {
  formatOrderStatus,
  orderStatusBadgeColors,
} from "@/utils/order-status.utils";
import { OrderTable } from "./order-table";

const PAGE_SIZE = 20;
const UPDATABLE_STATUSES: UpdatableOrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];
const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function OrderList() {
  const [page, setPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod | "">(
    "",
  );
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [nextStatus, setNextStatus] =
    useState<UpdatableOrderStatus>("PENDING");
  const [shippingFee, setShippingFee] = useState("");
  const queryClient = useQueryClient();
  const queryParams = {
    page,
    limit: PAGE_SIZE,
    orderStatus: orderStatus || undefined,
    paymentMethod: paymentMethod || undefined,
    sortOrder: "desc" as const,
  };
  const {
    data,
    error,
    isPending,
    isFetching,
    refetch,
  } = useGetOrders(queryParams);
  const {
    data: selectedOrderResponse,
    error: selectedOrderError,
    isPending: isOrderPending,
  } = useGetOrderById(selectedOrderId);
  const updateStatus = useUpdateOrderStatus();
  const updateShippingFee = useUpdateOrderShippingFee();
  const selectedOrder = selectedOrderResponse?.success
    ? selectedOrderResponse.data
    : undefined;

  useEffect(() => {
    if (!selectedOrder) return;
    setNextStatus(
      selectedOrder.orderStatus === "CANCELLED"
        ? "PENDING"
        : selectedOrder.orderStatus,
    );
    setShippingFee(String(selectedOrder.shippingFee));
  }, [selectedOrder]);

  const handleUpdateStatus = () => {
    if (!selectedOrder) return;

    updateStatus.mutate(
      {
        id: selectedOrder.id,
        payload: { orderStatus: nextStatus },
      },
      {
        onSuccess: async (response) => {
          if (!response.success) {
            toast.add({
              title: response.message || "Unable to update order status",
              type: "error",
            });
            return;
          }

          await queryClient.invalidateQueries({ queryKey: orderQueryKey });
          toast.add({ title: "Order status updated", type: "success" });
        },
        onError: (updateError) => {
          toast.add({
            title: "Unable to update order status",
            description: updateError.message || "Please try again.",
            type: "error",
          });
        },
      },
    );
  };

  const handleMarkPaid = () => {
    if (!selectedOrder) return;

    updateStatus.mutate(
      {
        id: selectedOrder.id,
        payload: { isPaid: true },
      },
      {
        onSuccess: async (response) => {
          if (!response.success) {
            toast.add({
              title: response.message || "Unable to verify payment",
              type: "error",
            });
            return;
          }

          await queryClient.invalidateQueries({ queryKey: orderQueryKey });
          toast.add({ title: "Payment marked as paid", type: "success" });
        },
        onError: (updateError) => {
          toast.add({
            title: "Unable to verify payment",
            description: updateError.message || "Please try again.",
            type: "error",
          });
        },
      },
    );
  };

  const handleShippingFeeUpdate = () => {
    if (!selectedOrder) return;

    const fee = Number(shippingFee);
    if (!Number.isFinite(fee) || fee < 0 || fee > 9999999999.99) {
      toast.add({
        title: "Enter a valid shipping fee",
        description: "The fee must be between 0 and 9,999,999,999.99.",
        type: "error",
      });
      return;
    }

    updateShippingFee.mutate(
      {
        id: selectedOrder.id,
        payload: { shippingFee: fee },
      },
      {
        onSuccess: async (response) => {
          if (!response.success) {
            toast.add({
              title: response.message || "Unable to update shipping fee",
              type: "error",
            });
            return;
          }

          await queryClient.invalidateQueries({ queryKey: orderQueryKey });
          toast.add({ title: "Shipping fee updated", type: "success" });
        },
        onError: (updateError) => {
          toast.add({
            title: "Unable to update shipping fee",
            description: updateError.message || "Please try again.",
            type: "error",
          });
        },
      },
    );
  };

  const responseError =
    error?.message || (!data?.success ? data?.message : undefined);

  return (
    <main className="min-h-full space-y-6 bg-muted/20 p-4 sm:p-6 lg:p-8">
      <div>
        <p className="text-sm font-medium text-primary">Sales</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Orders
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review customer orders, fulfillment status, and payment verification.
        </p>
      </div>

      <Card className="gap-0 rounded-2xl">
        <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="text-base font-semibold">All orders</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {data?.success
                ? `${data.meta.total} ${
                    data.meta.total === 1 ? "order" : "orders"
                  }`
                : "Manage your customer orders"}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              aria-label="Filter by order status"
              className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              value={orderStatus}
              onChange={(event) => {
                setOrderStatus(event.target.value as OrderStatus | "");
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {ALL_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatOrderStatus(status)}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by payment method"
              className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              value={paymentMethod}
              onChange={(event) => {
                setPaymentMethod(
                  event.target.value as OrderPaymentMethod | "",
                );
                setPage(1);
              }}
            >
              <option value="">All payment methods</option>
              <option value="CASH_ON_DELIVERY">Cash on delivery</option>
              <option value="BKASH">bKash</option>
            </select>
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
          </div>
        </div>

        {isPending ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading orders…
          </div>
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
        ) : data?.data.length ? (
          <OrderTable
            orders={data.data}
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            isFetching={isFetching}
            onPageChange={setPage}
            onView={(order) => setSelectedOrderId(order.id)}
          />
        ) : (
          <div className="p-10 text-center">
            <h3 className="font-medium">No orders found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing the selected filters.
            </p>
          </div>
        )}
      </Card>

      <Sheet
        open={Boolean(selectedOrderId)}
        onOpenChange={(open) => {
          if (!open) setSelectedOrderId("");
        }}
      >
        <SheetContent className="gap-0 overflow-y-auto sm:max-w-2xl">
          <SheetHeader className="border-b">
            <SheetTitle>
              {selectedOrder
                ? `Order #${selectedOrder.id.slice(0, 8).toUpperCase()}`
                : "Order details"}
            </SheetTitle>
            <SheetDescription>
              Customer, payment, items, and fulfillment details.
            </SheetDescription>
          </SheetHeader>

          {isOrderPending ? (
            <p className="p-6 text-sm text-muted-foreground">
              Loading order details…
            </p>
          ) : selectedOrderError || !selectedOrder ? (
            <p role="alert" className="p-6 text-sm text-destructive">
              {selectedOrderError?.message ||
                selectedOrderResponse?.message ||
                "Unable to load order details."}
            </p>
          ) : (
            <div className="space-y-6 p-6">
              <section className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-medium uppercase text-muted-foreground">
                    Customer
                  </h3>
                  <p className="mt-2 font-medium">
                    {selectedOrder.customerName}
                  </p>
                  <a
                    className="mt-1 block text-sm text-primary underline-offset-4 hover:underline"
                    href={`tel:${selectedOrder.customerPhone}`}
                  >
                    {selectedOrder.customerPhone}
                  </a>
                </div>
                <div>
                  <h3 className="text-xs font-medium uppercase text-muted-foreground">
                    Order date
                  </h3>
                  <p className="mt-2 text-sm">
                    {formatDateTime(selectedOrder.createdAt)}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium uppercase text-muted-foreground">
                    Shipping address
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {selectedOrder.shippingAddress}
                    <br />
                    {selectedOrder.country}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium uppercase text-muted-foreground">
                    Payment
                  </h3>
                  <p className="mt-2 text-sm">
                    {selectedOrder.paymentMethod === "BKASH"
                      ? "bKash"
                      : "Cash on delivery"}
                    {" · "}
                    {selectedOrder.isPaid ? "Paid" : "Unpaid"}
                  </p>
                  {!selectedOrder.isPaid &&
                    selectedOrder.orderStatus !== "CANCELLED" && (
                      <Button
                        className="mt-2 h-8 rounded-lg px-3"
                        onClick={handleMarkPaid}
                        disabled={updateStatus.isPending}
                      >
                        Mark as paid
                      </Button>
                    )}
                </div>
                {selectedOrder.orderNotes && (
                  <div className="sm:col-span-2">
                    <h3 className="text-xs font-medium uppercase text-muted-foreground">
                      Order notes
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm">
                      {selectedOrder.orderNotes}
                    </p>
                  </div>
                )}
              </section>

              <section>
                <h3 className="font-semibold">Items</h3>
                {selectedOrder.items?.length ? (
                  <ul className="mt-3 divide-y rounded-xl border">
                    {selectedOrder.items.map((item) => {
                      const unitPrice = Number(item.unitPrice);
                      return (
                        <li
                          key={item.id}
                          className="flex items-start justify-between gap-4 p-4"
                        >
                          <div>
                            <p className="font-medium">
                              {item.product?.name ?? "Product"}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.product?.sku
                                ? `SKU: ${item.product.sku} · `
                                : ""}
                              Qty {item.quantity} × {formatCurrency(unitPrice)}
                            </p>
                          </div>
                          <p className="shrink-0 font-medium">
                            {formatCurrency(unitPrice * item.quantity)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-3 rounded-xl border p-4 text-sm text-muted-foreground">
                    Item details are not available in this order response.
                  </p>
                )}
              </section>

              <section className="space-y-2 rounded-xl border p-4">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Shipping fee</span>
                  <span>{formatCurrency(selectedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between gap-4 border-t pt-3 font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.totalPrice)}</span>
                </div>
              </section>

              <section className="space-y-4 rounded-xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">Fulfillment status</h3>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${orderStatusBadgeColors[selectedOrder.orderStatus]}`}
                    >
                      {formatOrderStatus(selectedOrder.orderStatus)}
                    </span>
                  </div>
                </div>
                {selectedOrder.orderStatus !== "CANCELLED" && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      aria-label="Update order status"
                      className="h-9 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-sm"
                      value={nextStatus}
                      onChange={(event) =>
                        setNextStatus(
                          event.target.value as UpdatableOrderStatus,
                        )
                      }
                    >
                      {UPDATABLE_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {formatOrderStatus(status)}
                        </option>
                      ))}
                    </select>
                    <Button
                      className="h-9 rounded-xl px-4"
                      onClick={handleUpdateStatus}
                      disabled={
                        updateStatus.isPending ||
                        nextStatus === selectedOrder.orderStatus
                      }
                    >
                      {updateStatus.isPending
                        ? "Updating…"
                        : "Update status"}
                    </Button>
                  </div>
                )}
              </section>

              <section className="space-y-3 rounded-xl border p-4">
                <div>
                  <h3 className="font-semibold">Shipping fee</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Adjust the delivery fee for this order.
                  </p>
                </div>
                <div className="flex gap-2">
                  <input
                    aria-label="Shipping fee in BDT"
                    type="number"
                    min="0"
                    max="9999999999.99"
                    step="0.01"
                    className="h-9 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-sm"
                    value={shippingFee}
                    onChange={(event) => setShippingFee(event.target.value)}
                  />
                  <Button
                    variant="outline"
                    className="h-9 rounded-xl px-4"
                    onClick={handleShippingFeeUpdate}
                    disabled={
                      updateShippingFee.isPending ||
                      Number(shippingFee) === Number(selectedOrder.shippingFee)
                    }
                  >
                    {updateShippingFee.isPending ? "Saving…" : "Save fee"}
                  </Button>
                </div>
              </section>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}
