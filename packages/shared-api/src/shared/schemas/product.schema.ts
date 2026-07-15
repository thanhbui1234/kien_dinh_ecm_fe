import { z } from 'zod';
import { createApiResponseSchema, createPageSchema } from './common.schema';

export const ProductImageSchema = z.object({
  id: z.string(),
  imageUrl: z.string(),
  isMain: z.boolean(),
  orderIndex: z.number(),
});

export const ProductDetailSchema = z.object({
  contentDetail: z.string(),
  specifications: z.record(z.string(), z.any()),
  seoMeta: z.record(z.string(), z.any()).optional(),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  price: z.number().nullable().optional(),
  thumbnailUrl: z.string(),
  isFeatured: z.boolean(),
  status: z.boolean(),
  categoryId: z.string(),
  parentId: z.string().nullable().optional(),
  viewCount: z.number(),
  createdAt: z.string(),
  detail: ProductDetailSchema.optional(),
  images: z.array(ProductImageSchema).optional(),
});

export const CreateProductImageSchema = z.object({
  imageUrl: z.string(),
  isMain: z.boolean().optional(),
  orderIndex: z.number().optional(),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  slug: z.string().optional(),
  price: z.number().optional(),
  thumbnailUrl: z.string(),
  isFeatured: z.boolean().optional(),
  status: z.boolean().optional(),
  categoryId: z.string(),
  parentId: z.string().optional(),
  contentDetail: z.string().optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  seoMeta: z.record(z.string(), z.any()).optional(),
  images: z.array(CreateProductImageSchema).optional(),
});

// Update schema can inherit and make partial
export const UpdateProductSchema = CreateProductSchema.partial();

export const ProductResponseSchema = createApiResponseSchema(ProductSchema);
export const ProductListResponseSchema = createApiResponseSchema(createPageSchema(ProductSchema));

export type Product = z.infer<typeof ProductSchema>;
export type ProductImage = z.infer<typeof ProductImageSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
