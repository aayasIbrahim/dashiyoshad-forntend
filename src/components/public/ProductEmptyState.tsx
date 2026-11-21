import type { LucideIcon } from "lucide-react";

interface ProductEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function ProductEmptyState({
  icon: Icon,
  title,
  description,
}: ProductEmptyStateProps) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed p-10 text-center">
      <Icon className="mx-auto size-10 text-muted-foreground" />
      <p className="mt-3 font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
