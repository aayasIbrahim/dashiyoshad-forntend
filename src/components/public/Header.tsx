"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Heart,
  Menu,
  MessageCircle,
  Phone,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CartSheet from "@/components/public/CartSheet";
import SearchBar from "@/components/public/SearchBar";
import WishlistSheet from "@/components/public/WishlistSheet";
import { useAppSelector } from "@/store/hooks";
import { selectWishlistCount } from "@/store/selectors";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const wishlistCount = useAppSelector(selectWishlistCount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) params.set("search", search.trim());
    else params.delete("search");
    router.push(`/?${params.toString()}`);
    setMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center xl:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 rounded-full"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setMenuOpen((open) => !open);
              setSearchOpen(false);
            }}
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>

          <Link
            href="/"
            className="absolute left-1/2 top-1/2 h-16 w-24 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
            aria-label="Dashi Yoshad home"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(false);
            }}
          >
            <Image
              src="/Logo-02%20(1).png"
              alt=""
              width={160}
              height={160}
              className="absolute -left-[30px] -top-[48px] max-w-none"
              priority
            />
          </Link>

          <div className="ml-auto flex items-center gap-0.5">
            <a
              href="https://wa.me/8801234567890"
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="flex size-8 items-center justify-center rounded-full text-[#25D366] transition-colors hover:bg-muted"
            >
              <span className="relative flex items-center justify-center">
                <MessageCircle className="size-5" aria-hidden="true" />
                <Phone className="absolute size-2.5 fill-current" aria-hidden="true" />
              </span>
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full"
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              aria-controls="mobile-search"
              onClick={() => {
                setSearchOpen((open) => !open);
                setMenuOpen(false);
              }}
            >
              {searchOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Search className="size-5" aria-hidden="true" />
              )}
            </Button>
            <CartSheet />
          </div>
        </div>

        <div className="hidden h-16 items-center gap-3 xl:flex">
          <Link
            href="/"
            className="relative h-16 w-24 shrink-0 overflow-hidden"
            aria-label="Dashi Yoshad home"
          >
            <Image
              src="/Logo-02%20(1).png"
              alt=""
              width={160}
              height={160}
              className="absolute -left-[30px] -top-[48px] max-w-none"
              priority
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="ml-3 flex items-center gap-6 text-sm font-medium"
          >
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <Link href="/#products" className="transition-colors hover:text-primary">Shop</Link>
            <Link href="/#categories" className="transition-colors hover:text-primary">Categories</Link>
          </nav>

          <SearchBar
            value={search}
            onChange={setSearch}
            onSubmit={submitSearch}
            className="ml-auto w-full max-w-sm"
          />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="relative size-10 shrink-0 rounded-full"
              aria-label={`Open wishlist, ${wishlistCount} items`}
              aria-haspopup="dialog"
              aria-expanded={wishlistOpen}
              onClick={() => setWishlistOpen(true)}
            >
              <Heart className="size-5" aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Button>
            <CartSheet />
            <Link href="/login" className="shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-full"
                aria-label="Account"
              >
                <UserRound className="size-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>

        <div
          id="mobile-search"
          className={`pb-3 xl:hidden ${searchOpen ? "block" : "hidden"}`}
        >
          <SearchBar
            value={search}
            onChange={setSearch}
            onSubmit={submitSearch}
            className="w-full"
          />
        </div>

        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className={`border-t py-3 xl:hidden ${menuOpen ? "block" : "hidden"}`}
        >
          <div className="grid gap-1 text-sm font-medium">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/#products"
              className="rounded-lg px-3 py-2 hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/#categories"
              className="rounded-lg px-3 py-2 hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              Categories
            </Link>
            <button
              type="button"
              className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-muted"
              aria-haspopup="dialog"
              onClick={() => {
                setMenuOpen(false);
                setWishlistOpen(true);
              }}
            >
              <Heart aria-hidden="true" className="size-4" />
              Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </button>
            <Link
              href="/login"
              className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              <UserRound aria-hidden="true" className="size-4" />
              Log in
            </Link>
          </div>
        </nav>
      </div>
      <WishlistSheet open={wishlistOpen} onOpenChange={setWishlistOpen} />
    </header>
  );
}
