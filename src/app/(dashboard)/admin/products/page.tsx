import { Suspense } from "react";
import ProductList from "@/components/modules/products/product-list";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-muted-foreground">
          Loading products…
        </div>
      }
    >
      <ProductList />
    </Suspense>
  );
}
