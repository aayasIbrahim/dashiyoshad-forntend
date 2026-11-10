import { getStats } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function useGetStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  
  });
}