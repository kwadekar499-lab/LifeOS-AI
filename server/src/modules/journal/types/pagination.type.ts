export interface PaginatedResult<T> {
  data: T[];
  total: number;
  cursor?: string;
  hasMore: boolean;
  limit: number;
}
