/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApiErrorResponseDto {
  /**
   * Trạng thái thành công
   * @example false
   */
  success: boolean;
  /**
   * HTTP Status Code
   * @example 400
   */
  statusCode: number;
  /**
   * Mã lỗi hệ thống
   * @example "BAD_REQUEST"
   */
  errorCode: string;
  /** Thông báo lỗi chi tiết */
  message: string | string[];
  /**
   * Đường dẫn gọi API bị lỗi
   * @example "/api/v1/auth/login"
   */
  path: string;
  /**
   * Thời gian phản hồi
   * @example "2026-07-12T04:00:00.000Z"
   */
  timestamp: string;
}

export interface ApiResponseDto {
  /**
   * Trạng thái thành công
   * @example true
   */
  success: boolean;
  /**
   * HTTP Status Code
   * @example 200
   */
  statusCode: number;
  /** Dữ liệu trả về */
  data: object;
  /** Thông tin bổ sung (nếu có) */
  meta?: object;
  /**
   * Thời gian phản hồi
   * @example "2026-07-12T04:00:00.000Z"
   */
  timestamp: string;
}

export interface PageMetaDto {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PageDto {
  items: object[];
  meta: PageMetaDto;
}

export interface TokenResponseDto {
  /**
   * JWT Access Token
   * @example "eyJhbGci..."
   */
  accessToken: string;
  /**
   * Refresh Token
   * @example "d3b07384d..."
   */
  refreshToken: string;
}

export interface LoginDto {
  /** @format email */
  email: string;
  /** @minLength 6 */
  password: string;
}

export interface RefreshDto {
  refreshToken: string;
}

export type Boolean = object;

export interface UserProfileDto {
  /**
   * User ID
   * @example "uuid-string"
   */
  id: string;
  /**
   * Email đăng nhập
   * @example "admin@example.com"
   */
  email: string;
  /**
   * Họ và tên
   * @example "Admin User"
   */
  fullName: string;
  /**
   * Vai trò
   * @example "SUPER_ADMIN"
   */
  role: string;
}

export interface UploadResponseDto {
  /**
   * Đường dẫn ảnh đã tải lên
   * @example "https://res.cloudinary.com/..."
   */
  url: string;
}

export interface HealthResponseDto {
  /**
   * Trạng thái
   * @example "ok"
   */
  status: string;
  /**
   * Thời gian server
   * @example "2026-07-12T04:00:00.000Z"
   */
  timestamp: string;
}

export interface CategoryResponseDto {
  /**
   * ID danh mục
   * @example "uuid-string"
   */
  id: string;
  /**
   * Tên danh mục
   * @example "Máy Phay CNC"
   */
  name: string;
  /**
   * Slug URL
   * @example "may-phay-cnc"
   */
  slug: string;
  /**
   * Ảnh đại diện
   * @example "https://cloudinary..."
   */
  imageUrl?: string | null;
  /**
   * Thứ tự
   * @example 0
   */
  orderIndex: number;
  /**
   * Trạng thái hiển thị
   * @example true
   */
  status: boolean;
  /**
   * ID Danh mục cha
   * @example null
   */
  parentId?: string | null;
}

export interface CreateCategoryDto {
  /** Tên danh mục */
  name: string;
  /** Slug định danh trên URL. Nếu để trống, BE sẽ tự tạo từ tên */
  slug?: string;
  /** Đường dẫn ảnh đại diện của danh mục */
  imageUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
  /**
   * Trạng thái hiển thị
   * @default true
   */
  status?: boolean;
  /** ID của danh mục cha (nếu là danh mục con) */
  parentId?: string;
}

export interface UpdateCategoryDto {
  /** Tên danh mục */
  name?: string;
  /** Slug định danh trên URL. Nếu để trống, BE sẽ tự tạo từ tên */
  slug?: string;
  /** Đường dẫn ảnh đại diện của danh mục */
  imageUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
  /**
   * Trạng thái hiển thị
   * @default true
   */
  status?: boolean;
  /** ID của danh mục cha (nếu là danh mục con) */
  parentId?: string;
}

export interface ProductDetailResponseDto {
  /** Nội dung mô tả HTML */
  contentDetail: string;
  /** Thông số kỹ thuật JSON */
  specifications: object;
  /** Cấu hình SEO */
  seoMeta?: object;
}

export interface ProductImageResponseDto {
  /** ID ảnh */
  id: string;
  /** Đường dẫn ảnh */
  imageUrl: string;
  /** Là ảnh chính */
  isMain: boolean;
  /** Thứ tự hiển thị */
  orderIndex: number;
}

export interface ProductResponseDto {
  /** ID sản phẩm */
  id: string;
  /** Tên sản phẩm */
  name: string;
  /** Slug định danh */
  slug: string;
  /** Giá bán (nếu có) */
  price?: number | null;
  /** URL ảnh thu nhỏ */
  thumbnailUrl: string;
  /** Sản phẩm nổi bật? */
  isFeatured: boolean;
  /** Trạng thái hiển thị */
  status: boolean;
  /** ID danh mục */
  categoryId: string;
  /** ID máy chính (nếu là biến thể) */
  parentId?: string | null;
  /** Lượt xem */
  viewCount: number;
  /**
   * Ngày tạo
   * @format date-time
   */
  createdAt: string;
  /** Chi tiết bài viết (nếu gọi findOne) */
  detail?: ProductDetailResponseDto;
  /** Danh sách ảnh phụ */
  images?: ProductImageResponseDto[];
}

export interface CreateProductImageDto {
  /** URL hình ảnh */
  imageUrl: string;
  /**
   * Có phải ảnh chính không
   * @default false
   */
  isMain?: boolean;
  /**
   * Thứ tự ảnh
   * @default 0
   */
  orderIndex?: number;
}

export interface CreateProductDto {
  /** Tên sản phẩm */
  name: string;
  /** Slug định danh */
  slug?: string;
  /** Giá sản phẩm */
  price?: number;
  /** Ảnh thu nhỏ (Thumbnail) */
  thumbnailUrl: string;
  /**
   * Là sản phẩm nổi bật?
   * @default false
   */
  isFeatured?: boolean;
  /**
   * Trạng thái hiển thị
   * @default true
   */
  status?: boolean;
  /** ID Danh mục */
  categoryId: string;
  /** ID Sản phẩm cha (nếu là sản phẩm thuộc máy chính) */
  parentId?: string;
  /** Nội dung chi tiết (HTML) */
  contentDetail?: string;
  /** Thông số kỹ thuật dạng JSON linh hoạt */
  specifications?: object;
  /** Chức năng nổi bật dạng JSON động */
  features?: object;
  /** Dữ liệu tối ưu SEO (Title, Description, Keywords) */
  seoMeta?: object;
  /** Danh sách hình ảnh */
  images?: CreateProductImageDto[];
}

export interface UpdateProductDto {
  /** Tên sản phẩm */
  name?: string;
  /** Slug định danh */
  slug?: string;
  /** Giá sản phẩm */
  price?: number;
  /** Ảnh thu nhỏ (Thumbnail) */
  thumbnailUrl?: string;
  /**
   * Là sản phẩm nổi bật?
   * @default false
   */
  isFeatured?: boolean;
  /**
   * Trạng thái hiển thị
   * @default true
   */
  status?: boolean;
  /** ID Danh mục */
  categoryId?: string;
  /** ID Sản phẩm cha (nếu là sản phẩm thuộc máy chính) */
  parentId?: string;
  /** Nội dung chi tiết (HTML) */
  contentDetail?: string;
  /** Thông số kỹ thuật dạng JSON linh hoạt */
  specifications?: object;
  /** Chức năng nổi bật dạng JSON động */
  features?: object;
  /** Dữ liệu tối ưu SEO (Title, Description, Keywords) */
  seoMeta?: object;
  /** Danh sách hình ảnh */
  images?: CreateProductImageDto[];
}

export interface ProjectDetailResponseDto {
  /** Nội dung HTML chi tiết */
  contentDetail: string;
}

export interface ProjectResponseDto {
  /** ID dự án */
  id: string;
  /** Tên dự án */
  name: string;
  /** Slug định danh */
  slug: string;
  /** Mô tả ngắn gọn */
  description: string;
  /** Ảnh bìa dự án */
  coverImage: string;
  /** Trạng thái hiển thị */
  status: boolean;
  /** Dự án nổi bật */
  isFeatured: boolean;
  /**
   * Ngày tạo
   * @format date-time
   */
  createdAt: string;
  /** Chi tiết bài viết */
  detail?: ProjectDetailResponseDto;
  /** Danh sách URL ảnh gallery */
  images?: string[];
  /** Danh sách ID sản phẩm */
  productIds?: string[];
  /** Danh sách ID danh mục */
  categoryIds?: string[];
  /** Sản phẩm liên quan (dùng cho user FE) */
  relatedProducts?: ProductResponseDto[];
}

export interface CreateProjectDto {
  /** Tên dự án */
  name: string;
  /** Slug định danh (để trống sẽ tự tạo từ tên dự án) */
  slug?: string;
  /** Mô tả ngắn gọn */
  description: string;
  /** Ảnh bìa dự án */
  coverImage: string;
  /**
   * Trạng thái hiển thị
   * @default true
   */
  status?: boolean;
  /**
   * Dự án nổi bật
   * @default false
   */
  isFeatured?: boolean;
  /** Nội dung chi tiết (HTML) */
  contentDetail?: string;
  /** Danh sách ID sản phẩm liên quan */
  productIds?: string[];
  /** Danh sách ID danh mục liên quan */
  categoryIds?: string[];
}

export interface UpdateProjectDto {
  /** Tên dự án */
  name?: string;
  /** Slug định danh (để trống sẽ tự tạo từ tên dự án) */
  slug?: string;
  /** Mô tả ngắn gọn */
  description?: string;
  /** Ảnh bìa dự án */
  coverImage?: string;
  /**
   * Trạng thái hiển thị
   * @default true
   */
  status?: boolean;
  /**
   * Dự án nổi bật
   * @default false
   */
  isFeatured?: boolean;
  /** Nội dung chi tiết (HTML) */
  contentDetail?: string;
  /** Danh sách ID sản phẩm liên quan */
  productIds?: string[];
  /** Danh sách ID danh mục liên quan */
  categoryIds?: string[];
}

export interface JobDetailResponseDto {
  /** Mảng các mục chi tiết */
  sections: object[];
}

export interface JobResponseDto {
  /** ID bài đăng */
  id: string;
  /** Tiêu đề */
  title: string;
  /** Slug định danh */
  slug: string;
  /** Mức lương */
  salary: string;
  /** Trạng thái hiển thị */
  status: boolean;
  /**
   * Ngày tạo
   * @format date-time
   */
  createdAt: string;
  /** Chi tiết nội dung tuyển dụng */
  detail?: JobDetailResponseDto;
}

export interface CreateJobDto {
  /** Tiêu đề tuyển dụng */
  title: string;
  /** Slug định danh (để trống sẽ tự tạo từ tiêu đề) */
  slug?: string;
  /**
   * Mức lương
   * @default "Cạnh tranh"
   */
  salary?: string;
  /**
   * Trạng thái hiển thị
   * @default true
   */
  status?: boolean;
  /** Mảng các mục chi tiết (JSON) */
  sections: object[];
}

export interface UpdateJobDto {
  /** Tiêu đề tuyển dụng */
  title?: string;
  /** Slug định danh (để trống sẽ tự tạo từ tiêu đề) */
  slug?: string;
  /**
   * Mức lương
   * @default "Cạnh tranh"
   */
  salary?: string;
  /**
   * Trạng thái hiển thị
   * @default true
   */
  status?: boolean;
  /** Mảng các mục chi tiết (JSON) */
  sections?: object[];
}

export interface LeadResponseDto {
  /** ID Lead */
  id: string;
  /** Họ và tên */
  fullName: string;
  /** Số điện thoại */
  phoneNumber: string;
  /** Email */
  email?: string | null;
  /** Nội dung */
  message: string;
  /** Trạng thái xử lý */
  status: string;
  /** Ghi chú nội bộ */
  adminNote?: string | null;
  /** ID Sản phẩm quan tâm */
  targetProductId?: string | null;
  /** ID Vị trí tuyển dụng quan tâm */
  targetJobId?: string | null;
  /**
   * Ngày tạo
   * @format date-time
   */
  createdAt: string;
  /** Thông tin sản phẩm */
  product?: ProductResponseDto;
  /** Thông tin vị trí tuyển dụng */
  job?: JobResponseDto;
}

export interface CreateLeadDto {
  /** Họ và tên khách hàng */
  fullName: string;
  /** Số điện thoại liên hệ */
  phoneNumber: string;
  /**
   * Email khách hàng
   * @format email
   */
  email?: string;
  /** Nội dung tin nhắn / yêu cầu */
  message: string;
  /** ID Sản phẩm khách hàng quan tâm */
  targetProductId?: string;
  /** ID Vị trí tuyển dụng khách hàng quan tâm */
  targetJobId?: string;
}

export interface UpdateLeadStatusDto {
  /** Trạng thái lead (PENDING, CONTACTED, SPAM) */
  status: "PENDING" | "CONTACTED" | "SPAM";
  /** Ghi chú của admin */
  adminNote?: string;
  /** Mức độ ưu tiên (HIGH, MEDIUM, LOW) */
  priority?: "HIGH" | "MEDIUM" | "LOW";
}

export interface SettingResponseDto {
  /** Khóa cấu hình */
  key: string;
  /** Giá trị */
  value: string;
}

export interface UpdateSettingDto {
  /** Giá trị cấu hình */
  value: string;
}

export interface SloganResponseDto {
  /** Tiêu đề slogan */
  title: string;
  /** Icon định danh */
  icon: string;
  /** Mô tả chi tiết slogan */
  description?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
  /** ID */
  id: string;
}

export interface SloganDto {
  /** Tiêu đề slogan */
  title: string;
  /** Icon định danh */
  icon: string;
  /** Mô tả chi tiết slogan */
  description?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface UpdateSloganOrderDto {
  /** ID của slogan */
  id: string;
  /** Thứ tự mới */
  orderIndex: number;
}

export interface UpdateSloganOrdersDto {
  /** Danh sách slogan với thứ tự mới */
  slogans: UpdateSloganOrderDto[];
}

export interface UpdateSloganDto {
  /** Tiêu đề slogan */
  title?: string;
  /** Icon định danh */
  icon?: string;
  /** Mô tả chi tiết slogan */
  description?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface TimelineResponseDto {
  /** Năm */
  year: string;
  /** Tiêu đề sự kiện */
  title: string;
  /** Mô tả chi tiết */
  description: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
  /** ID */
  id: string;
}

export interface TimelineDto {
  /** Năm */
  year: string;
  /** Tiêu đề sự kiện */
  title: string;
  /** Mô tả chi tiết */
  description: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface UpdateTimelineOrderDto {
  /** ID của timeline */
  id: string;
  /** Thứ tự mới */
  orderIndex: number;
}

export interface UpdateTimelineOrdersDto {
  /** Danh sách timeline với thứ tự mới */
  timelines: UpdateTimelineOrderDto[];
}

export interface UpdateTimelineDto {
  /** Năm */
  year?: string;
  /** Tiêu đề sự kiện */
  title?: string;
  /** Mô tả chi tiết */
  description?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface BannerResponseDto {
  /** Tiêu đề banner */
  title?: string;
  /** Mô tả banner */
  description?: string;
  /** Đường dẫn liên kết */
  link?: string;
  /** URL hình ảnh banner */
  imageUrl: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
  /** ID */
  id: string;
  /** Trạng thái hiển thị */
  status: boolean;
}

export interface BannerDto {
  /** Tiêu đề banner */
  title?: string;
  /** Mô tả banner */
  description?: string;
  /** Đường dẫn liên kết */
  link?: string;
  /** URL hình ảnh banner */
  imageUrl: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface UpdateBannerDto {
  /** Tiêu đề banner */
  title?: string;
  /** Mô tả banner */
  description?: string;
  /** Đường dẫn liên kết */
  link?: string;
  /** URL hình ảnh banner */
  imageUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
  /** Trạng thái hiển thị */
  status?: boolean;
}

export interface UpdateBannerOrderDto {
  /** ID của banner */
  id: string;
  /** Thứ tự mới */
  orderIndex: number;
}

export interface UpdateBannerOrdersDto {
  /** Danh sách banner với thứ tự mới */
  banners: UpdateBannerOrderDto[];
}

export interface CompanyInfoResponseDto {
  /**
   * Nhãn hiển thị
   * @example "Thành lập"
   */
  label: string;
  /**
   * Giá trị
   * @example "1919"
   */
  value: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
  /** ID */
  id: string;
}

export interface CreateCompanyInfoDto {
  /**
   * Nhãn hiển thị
   * @example "Thành lập"
   */
  label: string;
  /**
   * Giá trị
   * @example "1919"
   */
  value: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface UpdateCompanyInfoDto {
  /**
   * Nhãn hiển thị
   * @example "Thành lập"
   */
  label?: string;
  /**
   * Giá trị
   * @example "1919"
   */
  value?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface FacilityResponseDto {
  /**
   * Khu vực / vùng lãnh thổ
   * @example "Đông Nam Á"
   */
  region: string;
  /**
   * Quốc gia
   * @example "Việt Nam"
   */
  country: string;
  /**
   * Tên cơ sở
   * @example "Nhà máy Hà Nội"
   */
  name: string;
  /**
   * Địa chỉ
   * @example "KCN Bắc Thăng Long, Hà Nội"
   */
  address: string;
  /**
   * Số điện thoại
   * @example "024 1234 5678"
   */
  phone: string;
  /** URL hình ảnh cơ sở */
  imageUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
  /** ID */
  id: string;
}

export interface CompanyHistoryEventResponseDto {
  /** ID */
  id: string;
  /** Giai đoạn lịch sử, ví dụ "1919 - 1950" */
  period: string;
  /** Năm cụ thể, ví dụ "1919" */
  year: string;
  /** Nội dung sự kiện */
  text: string;
  /** URL hình ảnh minh họa */
  imageUrl?: string;
  /** Thứ tự hiển thị */
  orderIndex?: number;
}

export interface CreateFacilityDto {
  /**
   * Khu vực / vùng lãnh thổ
   * @example "Đông Nam Á"
   */
  region: string;
  /**
   * Quốc gia
   * @example "Việt Nam"
   */
  country: string;
  /**
   * Tên cơ sở
   * @example "Nhà máy Hà Nội"
   */
  name: string;
  /**
   * Địa chỉ
   * @example "KCN Bắc Thăng Long, Hà Nội"
   */
  address: string;
  /**
   * Số điện thoại
   * @example "024 1234 5678"
   */
  phone: string;
  /** URL hình ảnh cơ sở */
  imageUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface UpdateFacilityDto {
  /**
   * Khu vực / vùng lãnh thổ
   * @example "Đông Nam Á"
   */
  region?: string;
  /**
   * Quốc gia
   * @example "Việt Nam"
   */
  country?: string;
  /**
   * Tên cơ sở
   * @example "Nhà máy Hà Nội"
   */
  name?: string;
  /**
   * Địa chỉ
   * @example "KCN Bắc Thăng Long, Hà Nội"
   */
  address?: string;
  /**
   * Số điện thoại
   * @example "024 1234 5678"
   */
  phone?: string;
  /** URL hình ảnh cơ sở */
  imageUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}
