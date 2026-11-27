import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { io } from "next/cache";
import { Mail, MapPin, Phone } from "lucide-react";

async function Copyright() {
  await io();

  return (
    <p>&copy; {new Date().getFullYear()} DashiYoshad. All rights reserved.</p>
  );
}

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-10 sm:px-6 sm:py-12 md:grid-cols-4 md:gap-8 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <Link
            href="/"
            className="relative block h-16 w-24 overflow-hidden"
            aria-label="Dashi Yoshad home"
          >
            <Image
              src="/Logo-02%20(1).png"
              alt=""
              width={160}
              height={160}
              className="absolute -left-[30px] -top-[48px] max-w-none"
            />
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            Quality products, great prices, and a simple shopping experience.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Explore</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <Link href="/#products" className="transition-colors hover:text-primary">Shop</Link>
            <Link href="/#categories" className="transition-colors hover:text-primary">Categories</Link>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Your account</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <Link href="/login" className="transition-colors hover:text-primary">Log in</Link>
            <Link href="/register" className="transition-colors hover:text-primary">Create account</Link>
            <Link href="/checkout" className="transition-colors hover:text-primary">Checkout</Link>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h2 className="font-semibold">Contact us</h2>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>Chittagong, Bangladesh</span>
            </p>
            <a href="tel:+8801234567890" className="flex items-center gap-2 transition-colors hover:text-primary">
              <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>+880 1234 567890</span>
            </a>
            <a href="mailto:hello@dashiyoshad.com" className="flex items-center gap-2 break-all transition-colors hover:text-primary">
              <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>hello@dashiyoshad.com</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Suspense fallback={<p>&copy; DashiYoshad. All rights reserved.</p>}>
            <Copyright />
          </Suspense>
          <p>Secure payment. Fast delivery.</p>
        </div>
      </div>
    </footer>
  );
}
