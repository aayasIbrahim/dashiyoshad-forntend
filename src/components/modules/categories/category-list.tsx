"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { FolderTree, Plus, RefreshCw } from "lucide-react";
import { CategoryForm } from "@/components/form/category-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import type { Category } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  categoryQueryKey,
  useDeleteCategory,
  useGetCategories,
} from "@/hooks/category.hook";
import { CategorySearch } from "./category-search";
import { CategoryTable } from "./category-table";

const PAGE_SIZE = 10;

export default function CategoryList() {
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const queryParams = {
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
  };
  const { data, error, isPending, isFetching, refetch } =
    useGetCategories(queryParams);
  const deleteCategory = useDeleteCategory();
  const queryClient = useQueryClient();

  const handleSearch = useCallback((value: string) => {
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
  }, [pathname, searchParams]);

  const openCreateForm = () => {
    setEditingCategory(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    if (!window.confirm(`Delete "${category.name}"? This cannot be undone.`)) {
      return;
    }

    deleteCategory.mutate(category.id, {
      onSuccess: async (response) => {
        if (!response.success) {
          toast.add({
            title: response.message || "Unable to delete category",
            type: "error",
          });
          return;
        }

        await queryClient.invalidateQueries({ queryKey: categoryQueryKey });
        toast.add({
          title: "Category deleted",
          type: "success",
        });
      },
      onError: (deleteError) => {
        toast.add({
          title: "Unable to delete category",
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
            Categories
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Organize your products into easy-to-browse categories.
          </p>
        </div>
        <Button
          className="h-9 self-start rounded-xl px-4 sm:self-auto"
          onClick={openCreateForm}
        >
          <Plus aria-hidden="true" />
          Add category
        </Button>
      </div>

      <Card className="gap-0 rounded-2xl">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="text-base font-semibold">All categories</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {data?.success
                ? `${data.meta.total} ${
                    data.meta.total === 1 ? "category" : "categories"
                  }`
                : "Manage your product categories"}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <CategorySearch value={search} onSearch={handleSearch} />
            <Button
              variant="outline"
              className="h-9 rounded-xl px-3"
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
        </div>

        {isPending ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading categories…
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
          <CategoryTable
            categories={data.data}
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            isFetching={isFetching}
            isDeleting={deleteCategory.isPending}
            onPageChange={setPage}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <FolderTree aria-hidden="true" className="size-5" />
            </span>
            <h3 className="font-medium">
              {search.trim() ? "No matching categories" : "No categories yet"}
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {search.trim()
                ? "Try another search term."
                : "Create a category to start organizing your products."}
            </p>
            {!search.trim() && (
              <Button
                className="mt-2 h-9 rounded-xl px-4"
                onClick={openCreateForm}
              >
                <Plus aria-hidden="true" />
                Add category
              </Button>
            )}
          </div>
        )}
      </Card>

      <Sheet
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingCategory(undefined);
        }}
      >
        <SheetContent className="gap-0 sm:max-w-md">
          <SheetHeader className="border-b">
            <SheetTitle>
              {editingCategory ? "Edit category" : "Create category"}
            </SheetTitle>
            <SheetDescription>
              {editingCategory
                ? "Update the name of this category."
                : "Add a new category to your catalog."}
            </SheetDescription>
          </SheetHeader>
          {isFormOpen && (
            <CategoryForm
              key={editingCategory?.id ?? "new-category"}
              category={editingCategory}
              onCancel={() => setIsFormOpen(false)}
              onSaved={() => {
                setIsFormOpen(false);
                setEditingCategory(undefined);
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}
