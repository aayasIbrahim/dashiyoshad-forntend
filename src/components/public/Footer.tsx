import Link from "next/link";
import { AtSign, Camera, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShoppingBag className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight">Dashi<span className="text-primary">Yoshad</span></span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
            Quality products, great prices, and a simple shopping experience.
          </p>
          <div className="mt-5 flex gap-2">
            <a href="#" aria-label="Social profile" className="flex size-9 items-center justify-center rounded-full border bg-background hover:border-primary hover:text-primary"><Camera className="size-4" /></a>
            <a href="mailto:hello@dashiyoshad.com" aria-label="Contact by email" className="flex size-9 items-center justify-center rounded-full border bg-background hover:border-primary hover:text-primary"><AtSign className="size-4" /></a>
            <a href="mailto:hello@dashiyoshad.com" aria-label="Email" className="flex size-9 items-center justify-center rounded-full border bg-background hover:border-primary hover:text-primary"><Mail className="size-4" /></a>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Quick links</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/?view=products" className="hover:text-primary">Shop</Link>
            <Link href="/login" className="hover:text-primary">My account</Link>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Customer service</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">Shipping & delivery</a>
            <a href="#" className="hover:text-primary">Returns</a>
            <a href="#" className="hover:text-primary">Privacy policy</a>
            <a href="#" className="hover:text-primary">Terms of service</a>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Contact us</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" />Dhaka, Bangladesh</p>
            <p className="flex items-center gap-2"><Phone className="size-4 shrink-0 text-primary" />+880 1234 567890</p>
            <p className="flex items-center gap-2"><Mail className="size-4 shrink-0 text-primary" />hello@dashiyoshad.com</p>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} DashiYoshad. All rights reserved.</p>
          <p>Secure payment. Fast delivery.</p>
        </div>
      </div>
    </footer>
  );
}
