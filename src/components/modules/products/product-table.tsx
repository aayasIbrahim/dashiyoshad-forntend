import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category, IProduct } from "@/types";
import { formatCurrency } from "@/utils/format.utils";

interface ProductTableProps {
  products: IProduct[];
  categories: Category[];
  page: number;
  totalPages: number;
  isFetching: boolean;
  isDeleting: boolean;
  onPageChange: (page: number) => void;
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
}

export function ProductTable({
  products,
  categories,
  page,
  totalPages,
  isFetching,
  isDeleting,
  onPageChange,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const pageCount = Math.max(totalPages, 1);
  const categoriesById = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">
                Product
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Category
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Price
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Stock
              </th>
              <th scope="col" className="px-5 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-muted/20">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-muted-foreground">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt=""
                          width={44}
                          height={44}
                          unoptimized
                          className="size-11 object-cover"
                        />
                      ) : (
                        <Package aria-hidden="true" className="size-5" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {product.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        SKU: {product.sku}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {categoriesById.get(product.categoryId) ?? "—"}
                </td>
                <td className="px-5 py-4 font-medium">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={
                      product.stock > 0
                        ? "text-foreground"
                        : "font-medium text-destructive"
                    }
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${product.name}`}
                      onClick={() => onEdit(product)}
                    >
                      <Pencil aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${product.name}`}
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(product)}
                      disabled={isDeleting}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p>
          Page {page} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-8 rounded-lg px-3"
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page <= 1 || isFetching}
          >
            <ChevronLeft aria-hidden="true" />
            Previous
          </Button>
          <Button
            variant="outline"
            className="h-8 rounded-lg px-3"
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            disabled={page >= totalPages || isFetching}
          >
            Next
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </>
  );
}
