export interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface PaginationParams {
  cursor?: string;
  limit?: number;
}
