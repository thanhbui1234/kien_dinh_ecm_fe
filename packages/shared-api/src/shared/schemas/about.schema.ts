import { CompanyInfoResponseDto, FacilityResponseDto, CompanyHistoryEventResponseDto, CompanyLocationResponseDto, CreateCompanyLocationDto, UpdateCompanyLocationDto } from '../../docs/dto-api';

export type CompanyInfo = CompanyInfoResponseDto;
export type Facility = FacilityResponseDto;
export type CompanyHistoryEvent = CompanyHistoryEventResponseDto;
export type CompanyLocation = CompanyLocationResponseDto;
export type CreateCompanyLocationInput = CreateCompanyLocationDto;
export type UpdateCompanyLocationInput = UpdateCompanyLocationDto;


export interface CompanyProfile {
  id: string;
  introHtml: string;
  thumbnailUrl: string;
}

export interface UpdateCompanyProfileInput {
  introHtml?: string;
  thumbnailUrl?: string;
}
