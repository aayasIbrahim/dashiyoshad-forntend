"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { Package, Plus, RefreshCw, Search } from "lucide-react";
import { ProductForm } from "@/components/form/product-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetCategories } from "@/hooks/category.hook";
import {
  productQueryKey,
  useDeleteProduct,
  useGetProducts,
} from "@/hooks/product.hook";
import type { IProduct } from "@/types";
import { ProductTable } from "./product-table";

const PAGE_SIZE = 10;

export default function ProductList() {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [inStock, setInStock] = useState<"true" | "false" | "">("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const queryParams = {
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
    categoryId: categoryId || undefined,
    inStock: inStock || undefined,
  };
  const {
    data,
    error,
    isPending,
    isFetching,
    refetch,
  } = useGetProducts(queryParams);
  const {
    data: categoryData,
    error: categoryError,
  } = useGetCategories({ page: 1, limit: 100 });
  const categories = categoryData?.success ? categoryData.data : [];
  const deleteProduct = useDeleteProduct();
  const queryClient = useQueryClient();

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const normalizedSearch = value.trim();

      if (normalizedSearch) {
        params.set("search", normalizedSearch);
      } else {
        params.delete("search");
      }

      params.delete("page");
      setPage(1);

      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        query ? `${pathname}?${query}` : pathname,
      );
    },
    [pathname, searchParams],
  );

  const openCreateForm = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (product: IProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: IProduct) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

    deleteProduct.mutate(product.id, {
      onSuccess: async (response) => {
        if (!response.success) {
          toast.add({
            title: response.message || "Unable to delete product",
            type: "error",
          });
          return;
        }

        await queryClient.invalidateQueries({ queryKey: productQueryKey });
        toast.add({
          title: "Product deleted",
          type: "success",
        });
      },
      onError: (deleteError) => {
        toast.add({
          title: "Unable to delete product",
          description: deleteError.message || "Please try again.",
          type: "error",
        });
      },
    });
  };

  const responseError =
    error?.message || (!data?.success ? data?.message : undefined);

  return (
    <main className="min-h-full space-y-6 bg-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Catalog</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Products
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage product details, pricing, stock, and catalog images.
          </p>
        </div>
        <Button
          className="h-9 self-start rounded-xl px-4 sm:self-auto"
          onClick={openCreateForm}
        >
          <Plus aria-hidden="true" />
          Add product
        </Button>
      </div>

      <Card className="gap-0 rounded-2xl">
        <div className="flex flex-col gap-3 border-b p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">All products</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {data?.success
                  ? `${data.meta.total} ${
                      data.meta.total === 1 ? "product" : "products"
                    }`
                  : "Manage your product catalog"}
              </p>
            </div>
            <Button
              variant="outline"
              className="h-9 self-start rounded-xl px-3 sm:self-auto"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                aria-hidden="true"
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </Button>
          </div>

          <div className="flex flex-col gap-2 lg:flex-row">
            <form
              className="flex min-w-0 flex-1 gap-2"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                handleSearch(String(formData.get("search") ?? ""));
              }}
            >
              <div className="relative min-w-0 flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  name="search"
                  type="search"
                  aria-label="Search products"
                  placeholder="Search products or SKU"
                  className="h-9 rounded-xl pl-9"
                  defaultValue={search}
                />
              </div>
              <Button type="submit" className="h-9 rounded-xl px-3">
                Search
              </Button>
            </form>

            <select
              aria-label="Filter by category"
              className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by stock status"
              className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              value={inStock}
              onChange={(event) => {
                setInStock(event.target.value as "" | "true" | "false");
                setPage(1);
              }}
            >
              <option value="">Any stock status</option>
              <option value="true">In stock</option>
              <option value="false">Out of stock</option>
            </select>
          </div>
          {categoryError && (
            <p role="status" className="text-xs text-destructive">
              Could not load categories for filtering: {categoryError.message}
            </p>
          )}
        </div>

        {isPending ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading products…
          </div>
        ) : responseError ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-sm text-destructive">{responseError}</p>
            <Button
              variant="outline"
              className="h-9 rounded-xl"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              Try again
            </Button>
          </div>
        ) : data?.data.length ? (
          <ProductTable
            products={data.data}
            categories={categories}
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            isFetching={isFetching}
            isDeleting={deleteProduct.isPending}
            onPageChange={setPage}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Package aria-hidden="true" className="size-5" />
            </span>
            <h3 className="font-medium">
              {search.trim() || categoryId || inStock
                ? "No matching products"
                : "No products yet"}
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {search.trim() || categoryId || inStock
                ? "Try changing or clearing your filters."
                : "Create a product to start building your catalog."}
            </p>
            {!search.trim() && !categoryId && !inStock && (
              <Button
                className="mt-2 h-9 rounded-xl px-4"
                onClick={openCreateForm}
              >
                <Plus aria-hidden="true" />
                Add product
              </Button>
            )}
          </div>
        )}
      </Card>

      <Sheet
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingProduct(undefined);
        }}
      >
        <SheetContent className="gap-0 sm:max-w-xl">
          <SheetHeader className="border-b">
            <SheetTitle>
              {editingProduct ? "Edit product" : "Create product"}
            </SheetTitle>
            <SheetDescription>
              {editingProduct
                ? "Update product details and inventory."
                : "Add a product to your catalog, with optional images."}
            </SheetDescription>
          </SheetHeader>
          {isFormOpen &&
            (categories.length > 0 ? (
              <ProductForm
                key={editingProduct?.id ?? "new-product"}
                product={editingProduct}
                categories={categories}
                onCancel={() => setIsFormOpen(false)}
                onSaved={() => {
                  setIsFormOpen(false);
                  setEditingProduct(undefined);
                }}
              />
            ) : (
              <div className="p-6 text-sm text-destructive">
                {categoryError
                  ? `Unable to load categories: ${categoryError.message}`
                  : "Create a category before adding a product."}
              </div>
            ))}
        </SheetContent>
      </Sheet>
    </main>
  );
}
