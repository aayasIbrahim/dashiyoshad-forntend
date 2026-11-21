"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/public/SearchBar";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncCounts = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
      setCartCount(
        Array.isArray(cart)
          ? cart.reduce((total, item) => total + Number(item.quantity || 1), 0)
          : 0,
      );
    };
    syncCounts();
    window.addEventListener("storage", syncCounts);
    window.addEventListener("wishlist-updated", syncCounts);
    window.addEventListener("cart-updated", syncCounts);
    return () => {
      window.removeEventListener("storage", syncCounts);
      window.removeEventListener("wishlist-updated", syncCounts);
      window.removeEventListener("cart-updated", syncCounts);
    };
  }, []);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) params.set("search", search.trim());
    else params.delete("search");
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShoppingBag className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight">Dashi<span className="text-primary">Yoshad</span></span>
          </Link>

          <nav className="ml-6 hidden items-center gap-6 text-sm font-medium lg:flex">
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <Link href="/?view=products" className="transition-colors hover:text-primary">Shop</Link>
            <Link href="/?category=featured" className="transition-colors hover:text-primary">Categories</Link>
          </nav>

          <SearchBar
            value={search}
            onChange={setSearch}
            onSubmit={submitSearch}
            className="ml-auto hidden w-full max-w-md md:flex"
          />

          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Wishlist">
              <Heart className="size-5" aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="relative hidden rounded-full sm:inline-flex" aria-label="Shopping cart">
              <ShoppingBag className="size-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account">
                <UserRound className="size-5" aria-hidden="true" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t py-3 lg:hidden">
            <SearchBar
              value={search}
              onChange={setSearch}
              onSubmit={submitSearch}
              className="mb-3 md:hidden"
            />
            <div className="flex flex-col gap-1 text-sm font-medium">
              <Link href="/" className="rounded-lg px-3 py-2 hover:bg-muted">Home</Link>
              <Link href="/?view=products" className="rounded-lg px-3 py-2 hover:bg-muted">Shop</Link>
              <Link href="/?category=featured" className="rounded-lg px-3 py-2 hover:bg-muted">Categories</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
