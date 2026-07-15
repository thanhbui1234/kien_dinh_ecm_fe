import { z } from 'zod';
import { CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto } from '../../docs/dto-api';

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().nullable().optional(),
  orderIndex: z.number(),
  status: z.boolean(),
  parentId: z.string().nullable().optional(),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  slug: z.string().optional(),
  imageUrl: z.string().optional(),
  orderIndex: z.number().optional(),
  status: z.boolean().optional(),
  parentId: z.string().optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type Category = CategoryResponseDto;
export type CreateCategoryInput = CreateCategoryDto;
export type UpdateCategoryInput = UpdateCategoryDto;
