import  apiClient  from '@/lib/apiClient';
export function getStats() {
  return apiClient("/stats");
}