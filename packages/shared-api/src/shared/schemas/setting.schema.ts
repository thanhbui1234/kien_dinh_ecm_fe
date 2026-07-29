import { BannerResponseDto, SloganResponseDto, SettingResponseDto, UpdateSettingDto, UpdateSloganDto, UpdateSloganOrderDto, ContactSettingResponseDto, UpdateContactSettingDto } from '../../docs/dto-api';

export type TimelineResponseDto = {
  id: string;
  year?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  orderIndex?: number;
  [key: string]: any;
};
export type UpdateTimelineDto = Partial<TimelineResponseDto>;
export type UpdateTimelineOrderDto = { timelines: { id: string; orderIndex: number }[] };

export type Banner = BannerResponseDto;
export type Timeline = TimelineResponseDto;
export type Slogan = SloganResponseDto;
export type SystemSetting = SettingResponseDto;
export type ContactSetting = ContactSettingResponseDto;
export type UpdateSettingInput = UpdateSettingDto;
export type UpdateSloganInput = UpdateSloganDto;
export type UpdateTimelineInput = UpdateTimelineDto;
export type UpdateSloganOrderInput = UpdateSloganOrderDto;
export type UpdateTimelineOrderInput = UpdateTimelineOrderDto;
export type UpdateContactSettingInput = UpdateContactSettingDto;

export interface CustomerSupportLink {
  label: string;
  href: string;
}

export interface FooterSetting {
  id: string;
  introText?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  salesPhone?: string;
  feedbackPhone?: string;
  warrantyPhone?: string;
  customerSupportTitle?: string;
  customerSupportLinks?: CustomerSupportLink[];
  updatedAt: Date | string;
}

export interface UpdateFooterSettingInput {
  introText?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  salesPhone?: string;
  feedbackPhone?: string;
  warrantyPhone?: string;
  customerSupportTitle?: string;
  customerSupportLinks?: CustomerSupportLink[];
}

