"use client";

import { useGetProductsByIds } from "@/hooks/product.hook";
import { useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/store/selectors";

export function useCartProducts(enabled = true) {
  const items = useAppSelector(selectCartItems);
  const queries = useGetProductsByIds(
    items.map(({ id }) => id),
    enabled,
  );

  const lines = items.map((item, index) => {
    const query = queries[index];
    const response = query.data;

    return {
      ...item,
      product: response?.success ? response.data : undefined,
      isPending: query.isPending,
      error:
        query.error?.message ||
        (response && !response.success ? response.message : undefined),
      refetch: query.refetch,
    };
  });

  return { lines };
}
