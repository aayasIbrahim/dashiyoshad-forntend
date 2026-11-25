"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Package,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProductCard from "@/components/public/ProductCard";
import ProductErrorState from "@/components/public/ProductErrorState";
import ProductGridSkeleton from "@/components/public/ProductGridSkeleton";
import { toast } from "@/components/ui/toast";
import { useGetProducts, useGetProductById } from "@/hooks/product.hook";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart, addToCartWithQuantity } from "@/store/cart-slice";
import { selectCartItems, selectWishlistIds } from "@/store/selectors";
import { toggleWishlistItem } from "@/store/wishlist-slice";
import type { IProduct } from "@/types";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductDetails({ id }: { id: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const wishlist = useAppSelector(selectWishlistIds);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { data: productResponse, isPending, error } = useGetProductById(id);
  const product = productResponse?.success ? productResponse.data : undefined;
  const cartQuantity =
    cartItems.find((item) => item.id === product?.id)?.quantity ?? 0;
  const maxQuantity = Math.min(
    100,
    Math.max(0, (product?.stock ?? 0) - cartQuantity),
  );

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
  }, [id]);

  const {
    data: relatedResponse,
    isPending: relatedPending,
    error: relatedError,
  } = useGetProducts(
    { page: 1, limit: 8, categoryId: product?.categoryId },
    Boolean(product),
  );

  if (isPending) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid animate-pulse gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-3xl bg-muted" />
          <div className="space-y-5 py-4">
            <div className="h-5 w-1/3 rounded bg-muted" />
            <div className="h-10 w-3/4 rounded bg-muted" />
            <div className="h-8 w-1/3 rounded bg-muted" />
            <div className="h-24 rounded bg-muted" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to products
        </Link>
        <ProductErrorState
          title="Product could not be loaded"
          description={
            error?.message ||
            productResponse?.message ||
            "This product may no longer be available."
          }
        />
      </main>
    );
  }

  const images = product.images ?? [];
  const activeImage = images[selectedImage] ?? images[0];
  const relatedProducts = relatedResponse?.success
    ? relatedResponse.data
        .filter(
          (relatedProduct) =>
            relatedProduct.id !== product.id &&
            relatedProduct.categoryId === product.categoryId,
        )
        .slice(0, 4)
    : [];
  const selectedQuantity = Math.min(quantity, Math.max(1, maxQuantity));

  const addProductToCart = () => {
    dispatch(
      addToCartWithQuantity({ id: product.id, quantity: selectedQuantity }),
    );
    toast.add({
      title: "Added to cart",
      description:
        selectedQuantity > 1
          ? `${product.name} × ${selectedQuantity}`
          : product.name,
      type: "success",
    });
  };

  const toggleWishlist = (relatedProduct: IProduct) => {
    dispatch(toggleWishlistItem(relatedProduct.id));
  };

  const addRelatedProductToCart = (relatedProduct: IProduct) => {
    dispatch(addToCart(relatedProduct.id));
    toast.add({
      title: "Added to cart",
      description: relatedProduct.name,
      type: "success",
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Continue shopping
      </Link>

      <section className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-muted/50">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <ShoppingBag className="size-20 stroke-1" aria-hidden="true" />
              </div>
            )}
            {product.stock <= 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
                Out of stock
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 sm:size-20 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt=""
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-start py-2 md:py-6">
          <p className="text-sm font-semibold text-primary">Product details</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-5 text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          {product.description ? (
            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">
              {product.description}
            </p>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              A quality product, selected for you.
            </p>
          )}

          <div className="mt-6 flex items-center gap-2 text-sm">
            {product.stock > 0 ? (
              <>
                <Check
                  className="size-4 text-green-600"
                  aria-hidden="true"
                />
                <span className="font-medium text-green-700">
                  In stock ({product.stock} available)
                </span>
              </>
            ) : (
              <>
                <Package
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="font-medium text-muted-foreground">
                  Currently unavailable
                </span>
              </>
            )}
          </div>

          <div className="mt-8 grid w-full grid-cols-[auto_minmax(0,1fr)] gap-3">
            <div
              role="group"
              className="flex h-12 items-center gap-1 rounded-xl border p-1"
              aria-label="Product quantity"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                className="size-10 rounded-lg"
                aria-label={`Decrease ${product.name} quantity`}
                disabled={selectedQuantity <= 1}
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
              >
                <Minus aria-hidden="true" />
              </Button>
              <span
                className="min-w-8 text-center text-sm font-semibold tabular-nums"
                aria-live="polite"
                aria-label={`Quantity ${selectedQuantity}`}
              >
                {selectedQuantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                className="size-10 rounded-lg"
                aria-label={`Increase ${product.name} quantity`}
                disabled={maxQuantity <= 0 || selectedQuantity >= maxQuantity}
                onClick={() =>
                  setQuantity((current) =>
                    Math.min(maxQuantity, current + 1),
                  )
                }
              >
                <Plus aria-hidden="true" />
              </Button>
            </div>
            <Button
              className="h-12 w-full min-w-0 rounded-xl text-sm"
              disabled={maxQuantity <= 0}
              onClick={addProductToCart}
            >
              <ShoppingBag aria-hidden="true" />
              <span className="truncate">
                Add to cart
                {selectedQuantity > 1 ? ` (${selectedQuantity})` : ""}
              </span>
            </Button>
            <Button
              variant="outline"
              className="col-span-2 h-12 w-full rounded-xl text-sm"
              aria-pressed={wishlist.includes(product.id)}
              onClick={() => dispatch(toggleWishlistItem(product.id))}
            >
              <Heart
                aria-hidden="true"
                fill={wishlist.includes(product.id) ? "currentColor" : "none"}
              />
              {wishlist.includes(product.id)
                ? "Saved to wishlist"
                : "Add to wishlist"}
            </Button>
          </div>

          <Card className="mt-8 w-full gap-0 rounded-2xl bg-muted/30 p-4 text-sm text-muted-foreground shadow-none">
            Product price and availability are managed in the product catalog.
          </Card>
        </div>
      </section>

      <section className="mt-16 border-t pt-10 sm:mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">You may also like</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Related products
            </h2>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {relatedPending ? (
          <div className="mt-6">
            <ProductGridSkeleton />
          </div>
        ) : relatedError || !relatedResponse?.success ? (
          <p role="status" className="mt-6 text-sm text-destructive">
            {relatedError?.message ||
              relatedResponse?.message ||
              "Related products could not be loaded."}
          </p>
        ) : relatedProducts.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                wished={wishlist.includes(relatedProduct.id)}
                onToggleWishlist={toggleWishlist}
                onAddToCart={addRelatedProductToCart}
                onBuyNow={(item) => {
                  dispatch(addToCart(item.id));
                  router.push("/checkout");
                }}
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            No related products are available yet.
          </p>
        )}
      </section>
    </main>
  );
}
