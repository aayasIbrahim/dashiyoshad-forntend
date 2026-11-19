import type { ApiResponse } from "./api.type";
import type { OrderStatus } from "./stats.type";

export type OrderPaymentMethod = "CASH_ON_DELIVERY" | "BKASH";
export type UpdatableOrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED";

export interface IOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string | number;
  product?: {
    name: string;
    sku?: string;
    images?: string[];
  };
}

export interface IOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  country: string;
  orderNotes?: string | null;
  paymentMethod: OrderPaymentMethod;
  isPaid: boolean;
  orderStatus: OrderStatus;
  shippingFee: string | number;
  totalPrice: string | number;
  items?: IOrderItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface IListOrdersQuery {
  orderStatus?: OrderStatus;
  paymentMethod?: OrderPaymentMethod;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface IUpdateOrderStatusInput {
  orderStatus?: UpdatableOrderStatus;
  isPaid?: true;
}

export interface IUpdateShippingFeeInput {
  shippingFee: number;
}

export type OrderListResponse = ApiResponse<IOrder[]>;
export type OrderSingleResponse = ApiResponse<IOrder>;
