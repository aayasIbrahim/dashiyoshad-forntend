"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Package,
  RefreshCw,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import { useGetStats } from "@/hooks/stats.hook";
import type { DashboardStats } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLoading from "@/components/dashboard/dashboard-loading";
import MetricCard from "@/components/modules/admin-stats/metric-card";
import OrderTrend from "@/components/modules/admin-stats/order-trend";
import OrderStatusCard from "@/components/modules/admin-stats/order-status-card";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatOrderStatus,
  orderStatusBadgeColors,
} from "@/utils";

function formatPaymentMethod(method: string) {
  return method
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


export default function AdminDashboard() {
  const { data, error, isPending, isFetching, refetch } = useGetStats();

  if (isPending) {
    return <DashboardLoading />;
  }

  if (error || !data) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="w-full max-w-lg items-center gap-4 rounded-2xl p-8 text-center shadow-sm">
          <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <CircleDollarSign aria-hidden="true" className="size-6" />
          </span>
          <div className="space-y-1">
            <h1 className="text-lg font-semibold">Could not load dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {error?.message || "The stats response was empty. Please try again."}
            </p>
          </div>
          <Button onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw
              aria-hidden="true"
              className={isFetching ? "animate-spin" : ""}
            />
            Try again
          </Button>
        </Card>
      </main>
    );
  }

  const stats = data.data;
  const lastUpdated = formatDateTime(data.data.generatedAt);

  return (
    <main className="min-h-full space-y-6 bg-muted/20 p-4 sm:p-6 lg:space-y-8 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Store at a glance</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard overview
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <CalendarDays aria-hidden="true" className="size-4" />
            {formatDate(stats.period.from)} – {formatDate(stats.period.to)}
            <span className="hidden text-border sm:inline">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 aria-hidden="true" className="size-3.5" />
              Updated {lastUpdated}
            </span>
          </p>
        </div>
        <Button
          variant="outline"
          className="h-9 self-start rounded-xl px-3 sm:self-auto"
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

      <section
        aria-label="Key statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <MetricCard
          label="Order value"
          value={formatCurrency(stats.financials.orderValue)}
          detail={`${formatCurrency(stats.financials.paidOrderValue)} paid`}
          icon={CircleDollarSign}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <MetricCard
          label="Total orders"
          value={stats.orders.total.toLocaleString()}
          detail={`${stats.orders.unpaid.toLocaleString()} awaiting payment`}
          icon={ShoppingCart}
          iconClassName="bg-sky-500/10 text-sky-600 dark:text-sky-400"
        />
        <MetricCard
          label="Average order value"
          value={formatCurrency(stats.financials.averageOrderValue)}
          detail={`${stats.financials.refundCount} refunds in this period`}
          icon={ArrowUpRight}
          iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
        />
        <MetricCard
          label="Customers"
          value={stats.customers.total.toLocaleString()}
          detail={`+${stats.customers.newInPeriod.toLocaleString()} new in this period`}
          icon={UsersRound}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
      </section>

      <section
        aria-label="Order analytics"
        className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]"
      >
        <OrderTrend stats={stats} />
        <OrderStatusCard stats={stats} />
      </section>

      <section
        aria-label="Store performance"
        className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4"
      >
        <Card className="gap-5 rounded-2xl border-0 p-5 shadow-sm ring-1 ring-border/70">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold">Inventory</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Current stock snapshot
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Boxes aria-hidden="true" className="size-5" />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-semibold">
                {stats.inventory.activeProducts.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Active products</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {stats.inventory.unitsInStock.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Units in stock</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {formatCurrency(stats.inventory.stockValueAtCurrentPrices)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Stock value</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {stats.inventory.activeCategories.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Categories</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border/70 pt-4 text-sm">
            <span className="text-muted-foreground">Needs attention</span>
            <span
              className={
                stats.inventory.lowStockProducts + stats.inventory.outOfStockProducts > 0
                  ? "font-medium text-amber-600 dark:text-amber-400"
                  : "font-medium text-emerald-600 dark:text-emerald-400"
              }
            >
              {stats.inventory.lowStockProducts} low ·{" "}
              {stats.inventory.outOfStockProducts} out of stock
            </span>
          </div>
        </Card>

        <Card className="gap-5 rounded-2xl border-0 p-5 shadow-sm ring-1 ring-border/70">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold">Top products</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Best sellers in this period
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Package aria-hidden="true" className="size-5" />
            </span>
          </div>
          {stats.orders.topProducts.length > 0 ? (
            <div className="space-y-4">
              {stats.orders.topProducts.slice(0, 4).map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        SKU: {product.sku}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {product.unitsSold} sold
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No product sales in this period
            </p>
          )}
        </Card>

        <Card className="gap-5 rounded-2xl border-0 p-5 shadow-sm ring-1 ring-border/70">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold">Categories</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Products by category
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Boxes aria-hidden="true" className="size-5" />
            </span>
          </div>
          {stats.categories.length > 0 ? (
            <div className="space-y-4">
              {stats.categories.slice(0, 5).map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="truncate text-sm font-medium">
                    {category.name}
                  </span>
                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {category.productCount} products
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No active categories
            </p>
          )}
        </Card>

        <Card className="gap-5 rounded-2xl border-0 p-5 shadow-sm ring-1 ring-border/70">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold">Team</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                User access overview
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <UsersRound aria-hidden="true" className="size-5" />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-semibold">
                {stats.users.total.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Total users</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">
                {stats.users.active.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Active users</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {stats.users.admins.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Admins</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {stats.users.staff.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Staff</p>
            </div>
          </div>
          <div className="border-t border-border/70 pt-4 text-sm">
            <span className="text-muted-foreground">Blocked accounts</span>
            <span className="float-right font-medium tabular-nums">
              {stats.users.blocked.toLocaleString()}
            </span>
          </div>
        </Card>
      </section>

      <Card className="gap-0 rounded-2xl border-0 p-5 shadow-sm ring-1 ring-border/70 sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Recent orders</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest orders from this reporting period
            </p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            {stats.orders.recent.length} orders
          </span>
        </div>
        {stats.orders.recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-y border-border/70 text-xs text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="py-3 pl-4 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {stats.orders.recent.slice(0, 8).map((order) => (
                  <tr key={order.id}>
                    <td className="py-3.5 pr-4 font-medium">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      <span>{formatPaymentMethod(order.paymentMethod)}</span>
                      <span
                        className={`ml-2 inline-flex items-center gap-1 text-xs ${
                          order.isPaid
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {order.isPaid ? (
                          <ArrowUpRight aria-hidden="true" className="size-3" />
                        ) : (
                          <ArrowDownRight aria-hidden="true" className="size-3" />
                        )}
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${orderStatusBadgeColors[order.orderStatus]}`}
                      >
                        {formatOrderStatus(order.orderStatus)}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4 text-right font-medium tabular-nums">
                      {formatCurrency(order.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <ShoppingCart
              aria-hidden="true"
              className="mx-auto size-8 text-muted-foreground/50"
            />
            <p className="mt-3 text-sm font-medium">No orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Orders from this period will appear here.
            </p>
          </div>
        )}
      </Card>
    </main>
  );
}
