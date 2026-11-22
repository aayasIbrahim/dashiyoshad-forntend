import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderShippingFee,
  updateOrderStatus,
} from "@/api";
import type {
  ICreateOrderInput,
  IListOrdersQuery,
  IUpdateOrderStatusInput,
  IUpdateShippingFeeInput,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const orderQueryKey = ["orders"] as const;

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateOrderInput) => createOrder(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderQueryKey }),
  });
}

export function useGetOrders(params: IListOrdersQuery = {}) {
  return useQuery({
    queryKey: [...orderQueryKey, params],
    queryFn: () => getOrders(params),
  });
}

export function useGetOrderById(id: string) {
  return useQuery({
    queryKey: [...orderQueryKey, "detail", id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateOrderStatusInput;
    }) => updateOrderStatus(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderQueryKey }),
  });
}

export function useUpdateOrderShippingFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateShippingFeeInput;
    }) => updateOrderShippingFee(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: orderQueryKey }),
  });
}
