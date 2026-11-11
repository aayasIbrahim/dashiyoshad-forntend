import apiClient from "@/lib/apiClient";
import type { StatsApiResponse } from "@/types";

export function getStats(): Promise<StatsApiResponse> {
  return apiClient<StatsApiResponse>("/stats/dashboard");
}