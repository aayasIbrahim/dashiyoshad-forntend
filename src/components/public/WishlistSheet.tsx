"use client";

import { Heart, RefreshCw, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetProductsByIds } from "@/hooks/product.hook";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/cart-slice";
import { selectWishlistIds } from "@/store/selectors";
import { removeFromWishlist } from "@/store/wishlist-slice";
import { toast } from "@/components/ui/toast";

interface WishlistSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(price);

export default function WishlistSheet({
  open,
  onOpenChange,
}: WishlistSheetProps) {
  const dispatch = useAppDispatch();
  const productIds = useAppSelector(selectWishlistIds);
  const queries = useGetProductsByIds(productIds, open);

  const addProductToCart = (id: string, name: string) => {
    dispatch(addToCart(id));
    toast.add({
      title: "Added to cart",
      description: name,
      type: "success",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <Heart className="size-5 text-destructive" aria-hidden="true" />
            Your wishlist
          </SheetTitle>
          <SheetDescription>
            {productIds.length}{" "}
            {productIds.length === 1 ? "saved product" : "saved products"}
          </SheetDescription>
        </SheetHeader>

        {productIds.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Heart className="size-6" aria-hidden="true" />
            </span>
            <h2 className="font-semibold">No saved products yet</h2>
            <p className="text-sm text-muted-foreground">
              Tap the heart on a product to save it here.
            </p>
            <Button
              variant="outline"
              className="mt-2 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {productIds.map((id, index) => {
                const query = queries[index];
                const response = query.data;
                const product = response?.success
                  ? response.data
                  : undefined;
                const error =
                  query.error?.message ||
                  (response && !response.success
                    ? response.message
                    : undefined);

                return (
                  <article
                    key={id}
                    className="flex gap-3 border-b pb-4 last:border-b-0"
                  >
                    <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {product?.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center text-muted-foreground">
                          <ShoppingBag
                            className="size-6"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      {query.isPending ? (
                        <div
                          className="h-4 w-2/3 animate-pulse rounded bg-muted"
                          aria-label="Loading saved product"
                        />
                      ) : product ? (
                        <>
                          <h3 className="truncate font-semibold">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm font-medium text-primary">
                            {formatPrice(product.price)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </p>
                          <Button
                            size="sm"
                            className="mt-2 h-8 rounded-lg"
                            disabled={product.stock <= 0}
                            onClick={() =>
                              addProductToCart(product.id, product.name)
                            }
                          >
                            <ShoppingBag aria-hidden="true" />
                            Add to cart
                          </Button>
                        </>
                      ) : (
                        <div>
                          <p className="text-sm font-medium">
                            Product unavailable
                          </p>
                          <p role="status" className="mt-1 text-xs text-destructive">
                            {error || "This product could not be loaded."}
                          </p>
                          <Button
                            variant="link"
                            className="mt-1 h-auto p-0 text-xs"
                            onClick={() => void query.refetch()}
                          >
                            <RefreshCw aria-hidden="true" />
                            Retry
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      aria-label={`Remove ${product?.name ?? "unavailable product"} from wishlist`}
                      onClick={() => dispatch(removeFromWishlist(id))}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </article>
                );
              })}
            </div>

            <SheetFooter className="border-t">
              <Button
                variant="outline"
                className="h-10 w-full rounded-xl"
                onClick={() => onOpenChange(false)}
              >
                Continue shopping
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
