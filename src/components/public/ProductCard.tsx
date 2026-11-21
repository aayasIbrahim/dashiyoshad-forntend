"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { IProduct } from "@/types";

interface ProductCardProps {
  product: IProduct;
  wished: boolean;
  onToggleWishlist: (product: IProduct) => void;
  onAddToCart: (product: IProduct) => void;
}

export default function ProductCard({
  product,
  wished,
  onToggleWishlist,
  onAddToCart,
}: ProductCardProps) {
  const image = product.images?.[0];

  return (
    <Card className="group gap-0 overflow-hidden rounded-2xl py-0 shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted/50">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ShoppingBag className="size-14 stroke-1" />
          </div>
        )}
        {product.stock <= 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-background">
            Out of stock
          </span>
        )}
        <Button
          variant="secondary"
          size="icon"
          className={`absolute right-3 top-3 rounded-full shadow-sm ${wished ? "text-destructive" : ""}`}
          aria-label={
            wished
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={() => onToggleWishlist(product)}
        >
          <Heart className="size-4" fill={wished ? "currentColor" : "none"} />
        </Button>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="truncate font-semibold">{product.name}</h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground">
            {product.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-base font-bold text-primary">
            {new Intl.NumberFormat("en-BD", {
              style: "currency",
              currency: "BDT",
              maximumFractionDigits: 0,
            }).format(product.price)}
          </p>
          <Button
            size="icon"
            className="size-9 shrink-0 rounded-full"
            disabled={product.stock <= 0}
            aria-label={`Add ${product.name} to cart`}
            onClick={() => onAddToCart(product)}
          >
            <ShoppingBag className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
