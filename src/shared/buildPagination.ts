export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    page_size: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function buildPagination<T>(
  data: T[],
  total: number,
  page: number,
  page_size: number,
): PaginationResult<T> {
  const totalPages = Math.ceil(total / page_size);

  return {
    data,
    meta: {
      total,
      page,
      page_size,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}