import { z } from 'zod';
import { ProjectResponseDto, CreateProjectDto, UpdateProjectDto } from '../../docs/dto-api';

export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Tên dự án là bắt buộc'),
  slug: z.string().optional(),
  description: z.string().min(1, 'Mô tả là bắt buộc'),
  coverImage: z.string().min(1, 'Ảnh bìa là bắt buộc'),
  status: z.boolean().optional(),
  contentDetail: z.string().optional(),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type Project = ProjectResponseDto;
export type CreateProjectInput = CreateProjectDto;
export type UpdateProjectInput = UpdateProjectDto;
