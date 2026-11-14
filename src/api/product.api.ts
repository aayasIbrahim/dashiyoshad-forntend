import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ICreateProductInput,
  IListProductsQuery,
  IProduct,
  IUpdateProductInput,
  ProductDeleteResponse,
  ProductListResponse,
  ProductSingleResponse,
} from "@/types";



export function getProducts(params: IListProductsQuery = {}) {
  return apiClient<ProductListResponse>("/products", { query: params });
}

export const listProducts = getProducts;

export function createProduct(payload: ICreateProductInput) {
  return apiClient<ProductSingleResponse>("/products", {
    method: "POST",
    body: payload,
  });
}

export function getProductById(id: string) {
  return apiClient<ProductSingleResponse>(`/products/${id}`);
}

export const getProduct = getProductById;

export function updateProduct(id: string, payload: IUpdateProductInput) {
  return apiClient<ProductSingleResponse>(`/products/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteProduct(id: string) {
  return apiClient<ProductDeleteResponse>(`/products/${id}`, {
    method: "DELETE",
  });
}