"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProductEmptyState from "@/components/public/ProductEmptyState";
import ProductErrorState from "@/components/public/ProductErrorState";
import ProductGridSkeleton from "@/components/public/ProductGridSkeleton";
import HeroSection from "@/components/public/HeroSection";
import ProductCard from "@/components/public/ProductCard";
import { useGetCategories } from "@/hooks/category.hook";
import { useGetProducts } from "@/hooks/product.hook";
import type { IProduct } from "@/types";

export default function HomePage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [categoryId, setCategoryId] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const { data: categoryResponse } = useGetCategories({ page: 1, limit: 100 });
  const categories = categoryResponse?.success ? categoryResponse.data : [];
  const { data: productResponse, isPending, error } = useGetProducts({
    page: 1,
    limit: 24,
    search: search || undefined,
    categoryId: categoryId || undefined,
  });
  const products = productResponse?.success ? productResponse.data : [];
  const wishlistOnly = searchParams.get("view") === "wishlist";
  const visibleProducts = useMemo(
    () => wishlistOnly ? products.filter((product) => wishlist.includes(product.id)) : products,
    [products, wishlistOnly, wishlist],
  );

  const toggleWishlist = (product: IProduct) => {
    const next = wishlist.includes(product.id)
      ? wishlist.filter((id) => id !== product.id)
      : [...wishlist, product.id];
    setWishlist(next);
    localStorage.setItem("wishlist", JSON.stringify(next));
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  const addToCart = (product: IProduct) => {
    const existing = cart.find((item) => item.id === product.id);
    const next = existing
      ? cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { id: product.id, quantity: 1 }];
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    window.dispatchEvent(new Event("cart-updated"));
  };

  return (
    <div className="bg-background">
      <HeroSection />

      <main id="products" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">{wishlistOnly ? "Saved items" : "Our collection"}</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {wishlistOnly ? "Your wishlist" : "Featured products"}
            </h2>
          </div>
          {!wishlistOnly && categories.length > 0 && (
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
              <Button
                variant={!categoryId ? "default" : "outline"}
                className="h-9 shrink-0 rounded-full"
                onClick={() => setCategoryId("")}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={categoryId === category.id ? "default" : "outline"}
                  className="h-9 shrink-0 rounded-full"
                  onClick={() => setCategoryId(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {search && (
          <p className="mt-5 text-sm text-muted-foreground">
            Showing results for <span className="font-semibold text-foreground">&quot;{search}&quot;</span>
          </p>
        )}

        {isPending ? (
          <ProductGridSkeleton />
        ) : error || !productResponse?.success ? (
          <ProductErrorState
            title="Products could not be loaded"
            description="Please check your connection and try again."
          />
        ) : visibleProducts.length === 0 ? (
          <ProductEmptyState
            icon={wishlistOnly ? Heart : Search}
            title={wishlistOnly ? "No saved products yet" : "No products found"}
            description={
              wishlistOnly
                ? "Tap the heart on a product to save it here."
                : "Try another search or category."
            }
          />
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wished={wishlist.includes(product.id)}
                onToggleWishlist={toggleWishlist}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}