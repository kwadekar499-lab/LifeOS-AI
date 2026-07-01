export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
