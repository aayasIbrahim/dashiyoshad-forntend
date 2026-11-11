import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export default function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  iconClassName: string;
}) {
  return (
    <Card className="gap-4 rounded-2xl border-0 p-5 shadow-sm ring-1 ring-border/70">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </Card>
  );
}
