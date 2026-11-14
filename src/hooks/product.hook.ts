import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "@/api";
import type {
  ICreateProductInput,
  IListProductsQuery,
  IUpdateProductInput,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const productQueryKey = ["products"] as const;

export function useGetProducts(params: IListProductsQuery = {}) {
  return useQuery({
    queryKey: [...productQueryKey, params],
    queryFn: () => getProducts(params),
  });
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: [...productQueryKey, "detail", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateProductInput) => createProduct(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productQueryKey }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateProductInput;
    }) => updateProduct(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productQueryKey }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productQueryKey }),
  });
}
