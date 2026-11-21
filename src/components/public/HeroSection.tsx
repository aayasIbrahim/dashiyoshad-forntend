"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="border-b bg-[linear-gradient(135deg,#f5fbf7_0%,#ffffff_55%,#eef8f1_100%)]">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-16">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            New collection
          </p>
          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Everyday products,
            <br />
            <span className="text-primary">made better.</span>
          </h1>
          <p className="mt-5 max-w-lg leading-7 text-muted-foreground">
            Discover useful essentials selected for quality, comfort, and value.
          </p>
          <Button
            className="mt-7 h-11 rounded-full px-7"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Shop now
          </Button>
        </div>
        <div className="relative mx-auto hidden aspect-[5/4] w-full max-w-md md:block">
          <div className="absolute inset-8 rotate-3 rounded-[3rem] bg-primary/10" />
          <div className="absolute inset-14 -rotate-3 rounded-[2.5rem] bg-white shadow-xl">
            <div className="flex h-full flex-col items-center justify-center text-primary">
              <ShoppingBag className="size-24 stroke-1" />
              <span className="mt-3 text-sm font-semibold">
                DashiYoshad Collection
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
