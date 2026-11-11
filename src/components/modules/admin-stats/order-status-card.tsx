import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/types";
import { formatOrderStatus, orderStatuses, orderStatusColors } from "@/utils";

export default function OrderStatusCard({ stats }: { stats: DashboardStats }) {
  return (
    <Card className="gap-5 rounded-2xl border-0 p-5 shadow-sm ring-1 ring-border/70 sm:p-6">
      <div>
        <h2 className="text-base font-semibold">Order status</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {stats.orders.total} orders in this period
        </p>
      </div>
      <div className="space-y-5">
        {orderStatuses.map((status) => {
          const count = stats.orders.byStatus[status];
          const percentage =
            stats.orders.total === 0
              ? 0
              : Math.round((count / stats.orders.total) * 100);

          return (
            <div key={status} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className={`size-2 rounded-full ${orderStatusColors[status]}`} />
                  {formatOrderStatus(status)}
                </span>
                <span className="font-medium tabular-nums">
                  {count}
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                    {percentage}%
                  </span>
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${orderStatusColors[status]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}