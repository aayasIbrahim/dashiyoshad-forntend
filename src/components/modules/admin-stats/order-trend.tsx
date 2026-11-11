import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/types";
import { formatCurrency, formatDate } from "@/utils";

export default function OrderTrend({ stats }: { stats: DashboardStats }) {
  const firstTrendDay = stats.dailyTrend[0];
  const lastTrendDay = stats.dailyTrend.at(-1);
  const maxOrderValue = Math.max(
    ...stats.dailyTrend.map((day) => Number(day.orderValue)),
    1,
  );

  return (
    <Card className="gap-6 rounded-2xl border-0 p-5 shadow-sm ring-1 ring-border/70 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Order value trend</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Daily order value across the selected period
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          <span className="size-2 rounded-full bg-primary" />
          Order value
        </span>
      </div>

      <div
        role="img"
        aria-label={`Daily order value for ${stats.dailyTrend.length} days`}
        className="flex h-48 items-end gap-1 border-b border-border/70 pb-1 sm:gap-1.5"
      >
        {stats.dailyTrend.map((day) => {
          const value = Number(day.orderValue);
          const height = value > 0 ? Math.max((value / maxOrderValue) * 100, 8) : 3;

          return (
            <div
              key={day.day}
              title={`${formatDate(day.day)}: ${formatCurrency(day.orderValue)} · ${day.orders} orders`}
              className="group flex h-full min-w-0 flex-1 items-end"
            >
              <span
                className={`w-full rounded-t-sm transition-colors group-hover:bg-primary ${
                  value > 0 ? "bg-primary/75" : "bg-muted"
                }`}
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{firstTrendDay ? formatDate(firstTrendDay.day) : "No data"}</span>
        <span>{lastTrendDay ? formatDate(lastTrendDay.day) : "No data"}</span>
      </div>
    </Card>
  );
}