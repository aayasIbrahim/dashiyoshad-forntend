"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartProducts } from "@/hooks/cart.hook";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeFromCart,
  setCartItemQuantity,
} from "@/store/cart-slice";
import { selectCartCount } from "@/store/selectors";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(price);

export default function CartSheet() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const itemCount = useAppSelector(selectCartCount);
  const [open, setOpen] = useState(false);
  const { lines } = useCartProducts(open);

  const subtotal = lines.reduce(
    (total, line) =>
      total + (line.product ? line.product.price * line.quantity : 0),
    0,
  );
  const canCheckout =
    lines.length > 0 &&
    lines.length <= 50 &&
    lines.every(
      (line) =>
        line.product &&
        !line.isPending &&
        !line.error &&
        line.quantity <= line.product.stock &&
        line.quantity <= 100,
    );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            aria-label={`Shopping cart, ${itemCount} items`}
          />
        }
      >
        <ShoppingBag className="size-5" aria-hidden="true" />
        {itemCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </SheetTrigger>

      <SheetContent className="gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle className="text-lg font-semibold">Your cart</SheetTitle>
          <SheetDescription>
            {itemCount} {itemCount === 1 ? "item" : "items"} in your bag
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </span>
            <h2 className="font-semibold">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground">
              Add products to your cart to see them here.
            </p>
            <Button
              variant="outline"
              className="mt-2 rounded-xl"
              onClick={() => setOpen(false)}
            >
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {lines.map((line) => {
                const product = line.product;
                const maxQuantity = Math.min(product?.stock ?? 0, 100);

                return (
                  <article
                    key={line.id}
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
                      {line.isPending ? (
                        <div
                          className="h-4 w-2/3 animate-pulse rounded bg-muted"
                          aria-label="Loading product"
                        />
                      ) : product ? (
                        <>
                          <h3 className="truncate font-semibold">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm font-medium text-primary">
                            {formatPrice(product.price)}
                          </p>
                          {line.quantity > product.stock && (
                            <p className="mt-1 text-xs text-destructive">
                              Only {product.stock} available
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              aria-label={`Decrease ${product.name} quantity`}
                              disabled={line.quantity <= 1}
                              onClick={() =>
                                dispatch(
                                  setCartItemQuantity({
                                    id: line.id,
                                    quantity: line.quantity - 1,
                                  }),
                                )
                              }
                            >
                              <Minus aria-hidden="true" />
                            </Button>
                            <span
                              className="min-w-8 text-center text-sm tabular-nums"
                              aria-label={`Quantity ${line.quantity}`}
                            >
                              {line.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              aria-label={`Increase ${product.name} quantity`}
                              disabled={line.quantity >= maxQuantity}
                              onClick={() =>
                                dispatch(
                                  setCartItemQuantity({
                                    id: line.id,
                                    quantity: line.quantity + 1,
                                  }),
                                )
                              }
                            >
                              <Plus aria-hidden="true" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div>
                          <p className="text-sm font-medium">
                            Product unavailable
                          </p>
                          <p role="status" className="mt-1 text-xs text-destructive">
                            {line.error || "This product could not be loaded."}
                          </p>
                          <Button
                            variant="link"
                            className="mt-1 h-auto p-0 text-xs"
                            onClick={() => void line.refetch()}
                          >
                            Try again
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      aria-label={`Remove ${product?.name ?? "unavailable item"} from cart`}
                      onClick={() => dispatch(removeFromCart(line.id))}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </article>
                );
              })}
            </div>

            <div className="space-y-3 border-t p-5">
              <div className="flex items-center justify-between font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Delivery fee is confirmed when your order is placed.
              </p>
              {lines.length > 50 && (
                <p role="status" className="text-xs text-destructive">
                  An order can contain up to 50 different products.
                </p>
              )}
              {lines.length <= 50 && !canCheckout && (
                <p role="status" className="text-xs text-destructive">
                  Check item availability and quantities before checkout.
                </p>
              )}
              <Button
                className="h-11 w-full rounded-xl"
                disabled={!canCheckout}
                onClick={() => {
                  setOpen(false);
                  router.push("/checkout");
                }}
              >
                Proceed to checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
