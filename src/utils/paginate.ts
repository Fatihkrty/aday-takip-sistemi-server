import type { IBaseQuerySchema } from '@/utils/validation/base-query.schema';

export default function paginate<T>(results: T[], query: IBaseQuerySchema, total: number) {
  const { page, limit } = query;

  return {
    results,
    page,
    limit,
    totalResults: total,
    totalPages: Math.ceil(total / limit),
  };
}
