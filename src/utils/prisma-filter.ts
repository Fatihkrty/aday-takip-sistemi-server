import type { Prisma } from '@prisma/client';

export const like = (value?: string) => ({
  contains: value,
  mode: 'insensitive' as Prisma.QueryMode,
});

export const likeNullable = (value: string, mode?: Prisma.QueryMode) =>
  value === 'null'
    ? {
        equals: null,
      }
    : {
        contains: value,
        mode: mode ?? 'insensitive',
      };

export const dateFilter = (date: Date) => {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);

  return {
    gte: start,
    lte: end,
  };
};
