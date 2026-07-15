import { z } from 'zod';

// Base response wrapper schema generator (to handle generic data)
export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    success: z.boolean(),
    statusCode: z.number(),
    data: dataSchema,
    meta: z.object({}).optional(),
    timestamp: z.string(),
  });
};

export const ApiErrorResponseSchema = z.object({
  success: z.boolean(),
  statusCode: z.number(),
  errorCode: z.string(),
  message: z.union([z.string(), z.array(z.string())]),
  path: z.string(),
  timestamp: z.string(),
});

export const PageMetaSchema = z.object({
  totalItems: z.number(),
  itemCount: z.number(),
  itemsPerPage: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const createPageSchema = <T extends z.ZodTypeAny>(itemSchema: T) => {
  return z.object({
    items: z.array(itemSchema),
    meta: PageMetaSchema,
  });
};

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
export type PageMeta = z.infer<typeof PageMetaSchema>;
