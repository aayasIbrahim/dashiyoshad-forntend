export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface DashboardStats {
  generatedAt: string;
  period: {
    from: string;
    to: string;
  };
  customers: {
    total: number;
    newInPeriod: number;
    active: number;
    blocked: number;
    deleted: number;
  };
  users: {
    total: number;
    admins: number;
    staff: number;
    active: number;
    blocked: number;
    deleted: number;
  };
  inventory: {
    activeProducts: number;
    unitsInStock: number;
    stockValueAtCurrentPrices: string;
    outOfStockProducts: number;
    lowStockProducts: number;
    lowStockThreshold: number;
    activeCategories: number;
  };
  categories: Array<{
    id: string;
    name: string;
    productCount: number;
  }>;
  orders: {
    total: number;
    byStatus: Record<OrderStatus, number>;
    byPaymentMethod: Record<
      string,
      {
        orders: number;
        orderValue: string;
      }
    >;
    paid: number;
    unpaid: number;
    cancelled: number;
    topProducts: Array<{
      productId: string;
      name: string;
      sku: string;
      unitsSold: number;
    }>;
    recent: Array<{
      id: string;
      customerName: string;
      totalPrice: string;
      paymentMethod: string;
      isPaid: boolean;
      orderStatus: OrderStatus;
      createdAt: string;
    }>;
  };
  financials: {
    basis: string;
    orderValue: string;
    averageOrderValue: string;
    paidOrderValue: string;
    unpaidOrderValue: string;
    refundedAmount: string;
    refundCount: number;
  };
  lowStock: unknown[];
  dailyTrend: Array<{
    day: string;
    orders: number;
    activeOrders: number;
    orderValue: string;
    paidOrderValue: string;
  }>;
}

export interface StatsApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DashboardStats;
}
