import { Suspense } from "react";
import CategoryList from "@/components/modules/categories/category-list";

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-muted-foreground">
          Loading categories…
        </div>
      }
    >
      <CategoryList />
    </Suspense>
  );
}
