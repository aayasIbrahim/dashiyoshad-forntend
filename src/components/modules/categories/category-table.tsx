import {
  ChevronLeft,
  ChevronRight,
  FolderTree,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";

interface CategoryTableProps {
  categories: Category[];
  page: number;
  totalPages: number;
  isFetching: boolean;
  isDeleting: boolean;
  onPageChange: (page: number) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({
  categories,
  page,
  totalPages,
  isFetching,
  isDeleting,
  onPageChange,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const pageCount = Math.max(totalPages, 1);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">
                Category
              </th>
              <th scope="col" className="px-5 py-3 font-medium">
                Products
              </th>
              <th scope="col" className="px-5 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-muted/20">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FolderTree aria-hidden="true" className="size-4" />
                    </span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {category.productCount ?? "—"}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Edit ${category.name}`}
                      onClick={() => onEdit(category)}
                    >
                      <Pencil aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${category.name}`}
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(category)}
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
