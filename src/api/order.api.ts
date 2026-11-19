import apiClient from "@/lib/apiClient";
import type {
  IListOrdersQuery,
  IUpdateOrderStatusInput,
  IUpdateShippingFeeInput,
  OrderListResponse,
  OrderSingleResponse,
} from "@/types";

export function getOrders(params: IListOrdersQuery = {}) {
  return apiClient<OrderListResponse>("/orders", { query: params });
}

export function getOrderById(id: string) {
  return apiClient<OrderSingleResponse>(`/orders/${id}`);
}

export function updateOrderStatus(
  id: string,
  payload: IUpdateOrderStatusInput,
) {
  return apiClient<OrderSingleResponse>(`/orders/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function updateOrderShippingFee(
  id: string,
  payload: IUpdateShippingFeeInput,
) {
  return apiClient<OrderSingleResponse>(`/orders/${id}/shipping-fee`, {
    method: "PATCH",
    body: payload,
  });
}
