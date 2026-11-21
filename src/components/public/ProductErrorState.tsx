import { PackageOpen } from "lucide-react";

interface ProductErrorStateProps {
  title: string;
  description: string;
}

export default function ProductErrorState({
  title,
  description,
}: ProductErrorStateProps) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed p-10 text-center">
      <PackageOpen className="mx-auto size-10 text-muted-foreground" />
      <p className="mt-3 font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
