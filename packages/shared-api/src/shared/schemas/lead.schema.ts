import { z } from 'zod';
import { CreateLeadDto, LeadResponseDto, UpdateLeadStatusDto } from '../../docs/dto-api';

export const CreateLeadSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ và tên'),
  phoneNumber: z.string().min(10, 'Vui lòng nhập số điện thoại hợp lệ'),
  email: z.string().email('Email không hợp lệ').or(z.literal('')).optional(),
  message: z.string().min(10, 'Nội dung tin nhắn cần ít nhất 10 ký tự'),
  targetProductId: z.string().optional(),
});

export type CreateLeadInput = CreateLeadDto;
export type Lead = LeadResponseDto;
export type UpdateLeadStatusInput = UpdateLeadStatusDto;
