import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/api";
import type {
  CategoryQueryParams,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const categoryQueryKey = ["categories"] as const;

export function useGetCategories(params: CategoryQueryParams = {}) {
  return useQuery({
    queryKey: [...categoryQueryKey, params],
    queryFn: () => getCategories(params),
  });
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => updateCategory(id, payload),
  });
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
  });
}
