
import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";
import { Suspense, type ReactNode } from "react";

function HeaderFallback() {
  return (
    <header
      aria-hidden="true"
      className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center xl:hidden">
          <div className="size-8 animate-pulse rounded-full bg-muted" />
          <div className="absolute left-1/2 h-10 w-24 -translate-x-1/2 animate-pulse rounded bg-muted" />
          <div className="ml-auto flex items-center gap-1">
            <div className="size-8 animate-pulse rounded-full bg-muted" />
            <div className="size-8 animate-pulse rounded-full bg-muted" />
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
        <div className="hidden h-16 items-center gap-3 xl:flex">
          <div className="h-10 w-24 animate-pulse rounded bg-muted" />
          <div className="h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="ml-auto h-10 w-96 animate-pulse rounded-lg bg-muted" />
          <div className="size-10 animate-pulse rounded-full bg-muted" />
          <div className="size-10 animate-pulse rounded-full bg-muted" />
          <div className="size-10 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </header>
  );
}

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}