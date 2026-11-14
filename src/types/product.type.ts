import { ApiResponse } from "./api.type";

export interface ICreateProductInput {
    name: string;
    description?: string | null;
    price: number;
    sku: string;
    stock?: number;
    weight?: string | null;
    categoryId: string;
}

export interface IUpdateProductInput {
    name?: string;
    description?: string | null;
    price?: number;
    sku?: string;
    stock?: number;
    weight?: string | null;
    categoryId?: string;
}

export interface IProduct {
    id: string;
    name: string;
    description: string | null;
    price: number;
    sku: string;
    stock: number;
    weight: string | null;
    categoryId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IProductIdInput {
    id: string;
}

export interface IListProductsQuery {
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: "true" | "false";
    page?: number;
    limit?: number;
    sortBy?: "name" | "price" | "stock" | "createdAt" | "updatedAt";
    sortOrder?: "asc" | "desc";
}

export type ProductListResponse = ApiResponse<IProduct[]>;
export type ProductSingleResponse = ApiResponse<IProduct>;
export type ProductDeleteResponse = ApiResponse<null>;