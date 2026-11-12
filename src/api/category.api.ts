import apiClient from "@/lib/apiClient";
import type {
  CategoryDeleteResponse,
  CategoryListResponse,
  CategoryQueryParams,
  CategorySingleResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types";

export function getCategories(params: CategoryQueryParams = {}) {
  return apiClient<CategoryListResponse>("/categories", { query: params });
}

export const listCategories = getCategories;

export function createCategory(payload: CreateCategoryPayload) {
  return apiClient<CategorySingleResponse>("/categories", {
    method: "POST",
    body: payload,
  });
}

export function getCategoryById(id: string) {
  return apiClient<CategorySingleResponse>(`/categories/${id}`);
}

export const getCategory = getCategoryById;

export function updateCategory(id: string, payload: UpdateCategoryPayload) {
  return apiClient<CategorySingleResponse>(`/categories/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteCategory(id: string) {
  return apiClient<CategoryDeleteResponse>(`/categories/${id}`, {
    method: "DELETE",
  });
}
