import { CompanyInfoResponseDto, FacilityResponseDto, CompanyHistoryEventResponseDto } from '../../docs/dto-api';

export type CompanyInfo = CompanyInfoResponseDto;
export type Facility = FacilityResponseDto;
export type CompanyHistoryEvent = CompanyHistoryEventResponseDto;

export interface CompanyProfile {
  id: string;
  introHtml: string;
  thumbnailUrl: string;
}

export interface UpdateCompanyProfileInput {
  introHtml?: string;
  thumbnailUrl?: string;
}
