import type { ApiResponse } from "./api.type";

export interface Category {
  id: string;
  name: string;
  productCount?: number;
  _count?: {
    products: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name?: string;
}

export interface CategoryQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export type CategoryListResponse = ApiResponse<Category[]>;
export type CategorySingleResponse = ApiResponse<Category>;
export type CategoryDeleteResponse = ApiResponse<null>;
