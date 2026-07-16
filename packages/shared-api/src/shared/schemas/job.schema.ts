import { z } from 'zod';
import { JobResponseDto, CreateJobDto, UpdateJobDto } from '../../docs/dto-api';

export const CreateJobSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  slug: z.string().optional(),
  salary: z.string().optional(),
  status: z.boolean().optional(),
  sections: z.array(z.object({
    title: z.string().min(1, 'Tiêu đề mục là bắt buộc'),
    content: z.string().min(1, 'Nội dung mục là bắt buộc')
  })).optional()
});

export const UpdateJobSchema = CreateJobSchema.partial();

export type Job = JobResponseDto;
export type CreateJobInput = CreateJobDto;
export type UpdateJobInput = UpdateJobDto;
