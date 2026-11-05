import { LoaderCircle, ShoppingBag } from "lucide-react";

export default function AuthLoading({
  label = "Loading your store...",
}: {
  label?: string;
}) {
  return (
    <main
      className="flex min-h-svh items-center justify-center bg-muted/40 p-6"
      aria-busy="true"
    >
      <div className="w-full max-w-sm rounded-3xl border border-border/70 bg-card p-8 text-center shadow-lg shadow-primary/5">
        <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShoppingBag aria-hidden="true" className="size-6" />
        </span>
        <p className="text-sm font-semibold tracking-tight">Your Store</p>
        <div
          className="mt-5 flex items-center justify-center gap-2.5 text-sm text-muted-foreground"
          role="status"
        >
          <LoaderCircle
            aria-hidden="true"
            className="size-4 animate-spin text-primary"
          />
          <span>{label}</span>
        </div>
      </div>
    </main>
  );
}
