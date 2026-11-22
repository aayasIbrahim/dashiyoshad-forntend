"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateOrder } from "@/hooks/order.hook";
import { useCartProducts } from "@/hooks/cart.hook";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/cart-slice";
import { toast } from "@/components/ui/toast";
import { OrderValidation } from "@/validation";
import type { IOrder, OrderPaymentMethod } from "@/types";

interface CheckoutFields {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  country: string;
  orderNotes: string;
  paymentMethod: OrderPaymentMethod;
}

const initialFields: CheckoutFields = {
  customerName: "",
  customerPhone: "",
  shippingAddress: "",
  country: "Bangladesh",
  orderNotes: "",
  paymentMethod: "CASH_ON_DELIVERY",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(price);

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { lines } = useCartProducts();
  const createOrder = useCreateOrder();
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<IOrder>();

  const isLoadingProducts = lines.some((line) => line.isPending);
  const hasProductErrors = lines.some(
    (line) => line.error || (!line.isPending && !line.product),
  );
  const hasInvalidQuantity = lines.some(
    (line) =>
      !line.product ||
      line.quantity > line.product.stock ||
      line.quantity > 100,
  );
  const canSubmit =
    lines.length > 0 &&
    !isLoadingProducts &&
    !hasProductErrors &&
    !hasInvalidQuantity &&
    lines.length <= 50 &&
    !createOrder.isPending;
  const subtotal = lines.reduce(
    (total, line) =>
      total + (line.product ? line.product.price * line.quantity : 0),
    0,
  );

  function updateField<K extends keyof CheckoutFields>(
    key: K,
    value: CheckoutFields[K],
  ) {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const result = OrderValidation.CreateOrderZodSchema.safeParse({
      ...fields,
      orderNotes: fields.orderNotes.trim() || undefined,
      items: lines.map(({ id, quantity }) => ({
        productId: id,
        quantity,
      })),
    });

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    createOrder.mutate(result.data, {
      onSuccess: (response) => {
        if (!response.success) {
          toast.add({
            title: "Unable to place order",
            description: response.message || "Please review your details.",
            type: "error",
          });
          return;
        }

        dispatch(clearCart());
        setConfirmedOrder(response.data);
        toast.add({
          title: "Order placed",
          description: "Your order has been received.",
          type: "success",
        });
      },
      onError: (error) => {
        toast.add({
          title: "Unable to place order",
          description: error.message || "Please try again.",
          type: "error",
        });
      },
    });
  }

  if (confirmedOrder) {
    return (
      <main className="mx-auto flex min-h-[65vh] max-w-3xl items-center px-4 py-12 sm:px-6">
        <section className="w-full rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-500/10 text-green-700">
            <CheckCircle2 className="size-8" aria-hidden="true" />
          </span>
          <p className="mt-6 text-sm font-semibold text-primary">
            Order confirmed
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Thank you, {confirmedOrder.customerName}!
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your order has been received. Keep this order ID for reference:
          </p>
          <p className="mt-3 break-all font-mono text-sm font-semibold">
            {confirmedOrder.id}
          </p>
          <Button
            className="mt-8 rounded-xl"
            onClick={() => router.push("/")}
          >
            Continue shopping
          </Button>
        </section>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto flex min-h-[65vh] max-w-3xl items-center px-4 py-12 sm:px-6">
        <section className="w-full rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-12">
          <ShoppingBag
            className="mx-auto size-12 text-muted-foreground"
            aria-hidden="true"
          />
          <h1 className="mt-5 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a product before continuing to checkout.
          </p>
          <Button
            render={<Link href="/" />}
            className="mt-6 rounded-xl"
          >
            Browse products
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Continue shopping
      </Link>

      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">Almost there</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your delivery details and choose a payment method.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.78fr]">
        <form
          className="space-y-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-7"
          noValidate
          onSubmit={submitOrder}
        >
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Contact and delivery</h2>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Full name</span>
              <Input
                autoComplete="name"
                required
                maxLength={120}
                aria-invalid={Boolean(errors.customerName)}
                className="h-11 rounded-xl px-3"
                value={fields.customerName}
                onChange={(event) =>
                  updateField("customerName", event.target.value)
                }
              />
              {errors.customerName && (
                <span role="alert" className="text-xs text-destructive">
                  {errors.customerName}
                </span>
              )}
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Phone number</span>
              <Input
                type="tel"
                autoComplete="tel"
                required
                maxLength={20}
                placeholder="+880 1XXX-XXXXXX"
                aria-invalid={Boolean(errors.customerPhone)}
                className="h-11 rounded-xl px-3"
                value={fields.customerPhone}
                onChange={(event) =>
                  updateField("customerPhone", event.target.value)
                }
              />
              {errors.customerPhone && (
                <span role="alert" className="text-xs text-destructive">
                  {errors.customerPhone}
                </span>
              )}
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Shipping address</span>
              <textarea
                autoComplete="street-address"
                required
                rows={4}
                maxLength={1000}
                aria-invalid={Boolean(errors.shippingAddress)}
                className="w-full rounded-xl border border-input bg-input/20 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive"
                value={fields.shippingAddress}
                onChange={(event) =>
                  updateField("shippingAddress", event.target.value)
                }
              />
              {errors.shippingAddress && (
                <span role="alert" className="text-xs text-destructive">
                  {errors.shippingAddress}
                </span>
              )}
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Country</span>
              <Input
                autoComplete="country-name"
                required
                maxLength={80}
                aria-invalid={Boolean(errors.country)}
                className="h-11 rounded-xl px-3"
                value={fields.country}
                onChange={(event) => updateField("country", event.target.value)}
              />
              {errors.country && (
                <span role="alert" className="text-xs text-destructive">
                  {errors.country}
                </span>
              )}
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium">
                Order notes <span className="text-muted-foreground">(optional)</span>
              </span>
              <textarea
                rows={3}
                maxLength={1000}
                className="w-full rounded-xl border border-input bg-input/20 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                value={fields.orderNotes}
                onChange={(event) =>
                  updateField("orderNotes", event.target.value)
                }
              />
              {errors.orderNotes && (
                <span role="alert" className="text-xs text-destructive">
                  {errors.orderNotes}
                </span>
              )}
            </label>
          </section>

          <fieldset className="space-y-3 border-t pt-5">
            <legend className="mb-3 text-lg font-semibold">
              Payment method
            </legend>
            {(
              [
                ["CASH_ON_DELIVERY", "Cash on delivery"],
                ["BKASH", "bKash"],
              ] as const
            ).map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                  fields.paymentMethod === value
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={fields.paymentMethod === value}
                  onChange={() => updateField("paymentMethod", value)}
                  className="accent-primary"
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </fieldset>

          {(errors.items || errors.paymentMethod) && (
            <p role="alert" className="text-sm text-destructive">
              {errors.items || errors.paymentMethod}
            </p>
          )}

          <Button
            type="submit"
            className="h-12 w-full rounded-xl text-sm"
            disabled={!canSubmit}
          >
            {createOrder.isPending ? "Placing order..." : "Place order"}
          </Button>
        </form>

        <aside className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-5 space-y-4">
            {lines.map((line) => (
              <div key={line.id} className="flex gap-3">
                <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {line.product?.images?.[0] ? (
                    <img
                      src={line.product.images[0]}
                      alt={line.product.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center text-muted-foreground">
                      <ShoppingBag className="size-5" aria-hidden="true" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {line.product?.name ||
                      (line.isPending ? "Loading product..." : "Unavailable product")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Qty {line.quantity}
                    {line.product ? ` · ${formatPrice(line.product.price)}` : ""}
                  </p>
                  {line.error && (
                    <p role="status" className="mt-1 text-xs text-destructive">
                      {line.error}
                    </p>
                  )}
                  {line.product && line.quantity > line.product.stock && (
                    <p role="status" className="mt-1 text-xs text-destructive">
                      Only {line.product.stock} available
                    </p>
                  )}
                </div>
                {line.product && (
                  <span className="shrink-0 text-sm font-semibold">
                    {formatPrice(line.product.price * line.quantity)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {lines.length > 50 && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              An order can contain up to 50 different products. Remove some
              items from your cart to continue.
            </p>
          )}
          {hasProductErrors && (
            <p className="mt-4 text-sm text-destructive">
              Remove unavailable products from your cart before placing the order.
            </p>
          )}

          <div className="mt-6 space-y-3 border-t pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery fee</span>
              <span className="text-right text-muted-foreground">
                Confirmed after order placement
              </span>
            </div>
            <p className="border-t pt-3 text-xs text-muted-foreground">
              Product prices are verified by the store when you place the order.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
