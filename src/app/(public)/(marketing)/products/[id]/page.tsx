import { Suspense } from "react";
import ProductDetails from "@/components/public/ProductDetails";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ProductDetailsFallback />}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}

async function ProductDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProductDetails key={id} id={id} />;
}

function ProductDetailsFallback() {
  return (
    <main
      aria-busy="true"
      className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
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
