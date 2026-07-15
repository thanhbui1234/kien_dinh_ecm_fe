import { z } from 'zod';
import { createApiResponseSchema } from './common.schema';

export const LoginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const TokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  role: z.string(),
});

export const LoginResponseSchema = createApiResponseSchema(TokenResponseSchema);
export const UserProfileResponseSchema = createApiResponseSchema(UserProfileSchema);

export type LoginInput = z.infer<typeof LoginSchema>;
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
