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
  const body = new FormData();
  body.set("name", payload.name);
  body.set("price", String(payload.price));
  body.set("sku", payload.sku);
  body.set("categoryId", payload.categoryId);

  if (payload.description) body.set("description", payload.description);
  if (payload.stock !== undefined) body.set("stock", String(payload.stock));
  if (payload.weight) body.set("weight", payload.weight);
  payload.productImages?.forEach((image) => body.append("productImages", image));

  return apiClient<ProductSingleResponse>("/products", {
    method: "POST",
    body,
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