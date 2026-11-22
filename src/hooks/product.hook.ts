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
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const productQueryKey = ["products"] as const;

export function useGetProducts(
  params: IListProductsQuery = {},
  enabled = true,
) {
  return useQuery({
    queryKey: [...productQueryKey, params],
    queryFn: () => getProducts(params),
    enabled,
  });
}

export function useGetProductById(id: string) {
  return useQuery({
    queryKey: [...productQueryKey, "detail", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
}

export function useGetProductsByIds(ids: string[], enabled = true) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: [...productQueryKey, "detail", id],
      queryFn: () => getProductById(id),
      enabled,
    })),
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
