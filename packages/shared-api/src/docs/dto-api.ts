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

export interface CreateAdminDto {
  /**
   * Email của Admin mới
   * @format email
   * @example "admin2@kiendinhecm.com"
   */
  email: string;
  /**
   * Mật khẩu khởi tạo
   * @minLength 6
   * @example "Password123!@#"
   */
  password: string;
  /**
   * Họ và tên
   * @example "Nguyễn Văn Admin"
   */
  fullName: string;
}

export interface ResetPasswordDto {
  /**
   * Mật khẩu mới
   * @minLength 6
   * @example "NewSecurePass123!"
   */
  newPassword: string;
}

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
  /**
   * Mã UUID thiết bị (LocalStorage)
   * @example "uuid_12345678"
   */
  deviceId?: string;
  /**
   * Mã vân tay phần cứng FingerprintJS
   * @example "fp_a8f9c2d1e3b4"
   */
  fingerprint?: string;
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

export interface SetupAdminDto {
  /**
   * Email quản trị viên
   * @format email
   * @example "admin@kiendinhecm.com"
   */
  email: string;
  /**
   * Mật khẩu tối thiểu 8 ký tự
   * @minLength 8
   * @example "Password123!"
   */
  password: string;
  /**
   * Họ và tên (Không bắt buộc)
   * @example "Admin User"
   */
  fullName?: string;
  /**
   * Mã bí mật để cấp quyền tạo Admin
   * @example "my-super-secret-key"
   */
  secretKey: string;
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

export interface UpsertCategoryTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Tên danh mục theo ngôn ngữ */
  name: string;
  /** Slug theo ngôn ngữ */
  slug?: string;
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
  /**
   * Danh sách đường dẫn Video / YouTube
   * @example ["https://www.youtube.com/watch?v=abc"]
   */
  videoUrls?: string[];
  /** Danh sách hình ảnh */
  images?: CreateProductImageDto[];
}

export interface UpsertProductTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Tên sản phẩm theo ngôn ngữ */
  name: string;
  /** Slug theo ngôn ngữ (tự sinh nếu không truyền) */
  slug?: string;
  /** Nội dung chi tiết bài viết */
  contentDetail?: string;
  /** Thông số kỹ thuật */
  specifications?: object;
  /** Tính năng nổi bật */
  features?: object;
  /** SEO Title */
  seoTitle?: string;
  /** SEO Description */
  seoDescription?: string;
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
  /**
   * Danh sách đường dẫn Video / YouTube
   * @example ["https://www.youtube.com/watch?v=abc"]
   */
  videoUrls?: string[];
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
  /** Chi tiết nội dung */
  detail?: ProjectDetailResponseDto;
  /** Danh sách URL ảnh gallery */
  images?: string[];
  /** Danh sách ID sản phẩm (dùng cho admin) */
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
  /** Danh sách URL ảnh gallery dự án */
  images?: string[];
  /**
   * Danh sách URL video / YouTube dự án
   * @example ["https://www.youtube.com/watch?v=xyz"]
   */
  videoUrls?: string[];
}

export interface UpsertProjectTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Tên dự án theo ngôn ngữ */
  name: string;
  /** Slug theo ngôn ngữ */
  slug?: string;
  /** Mô tả ngắn */
  description?: string;
  /** Nội dung chi tiết */
  contentDetail?: string;
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
  /** Danh sách URL ảnh gallery dự án */
  images?: string[];
  /**
   * Danh sách URL video / YouTube dự án
   * @example ["https://www.youtube.com/watch?v=xyz"]
   */
  videoUrls?: string[];
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

export interface UpsertJobPostTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Tiêu đề tuyển dụng theo ngôn ngữ */
  title: string;
  /** Slug theo ngôn ngữ */
  slug?: string;
  /** Mức lương */
  salary?: string;
  /** Mô tả công việc & Yêu cầu (sections JSON) */
  sections?: object;
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

export interface LeadJobDto {
  id: string;
  title: string;
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
  /** ID Vị trí tuyển dụng */
  targetJobId?: string | null;
  /**
   * Ngày tạo
   * @format date-time
   */
  createdAt: string;
  /** Thông tin sản phẩm */
  product?: ProductResponseDto;
  /** Thông tin vị trí tuyển dụng */
  job?: LeadJobDto | null;
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
  /** ID Vị trí tuyển dụng khách hàng muốn ứng tuyển */
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

export interface UpsertCompanySloganTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Tiêu đề slogan theo ngôn ngữ */
  title: string;
  /** Mô tả slogan theo ngôn ngữ */
  description?: string;
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

export interface UpsertBannerTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Tiêu đề banner theo ngôn ngữ */
  title?: string;
  /** Mô tả banner theo ngôn ngữ */
  description?: string;
}

export interface CompanyProfileResponseDto {
  id: string;
  introHtml: string;
  thumbnailUrl?: string;
}

export interface UpdateCompanyProfileDto {
  /** Nội dung HTML giới thiệu công ty */
  introHtml?: string;
  /** URL ảnh thumbnail trang About */
  thumbnailUrl?: string;
}

export interface UpsertCompanyProfileTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Nội dung introHtml theo ngôn ngữ */
  introHtml: string;
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
  /** URL ảnh minh họa */
  imageUrl?: string;
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
  /** URL ảnh minh họa */
  imageUrl?: string;
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
  /** URL ảnh minh họa */
  imageUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface UpsertCompanyInfoTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Nhãn theo ngôn ngữ */
  label: string;
  /** Giá trị theo ngôn ngữ */
  value: string;
}

export interface FacilityResponseDto {
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

export interface CreateFacilityDto {
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

export interface UpsertFacilityTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Tên cơ sở theo ngôn ngữ */
  name: string;
  /** Quốc gia theo ngôn ngữ */
  country: string;
  /** Địa chỉ theo ngôn ngữ */
  address: string;
}

export interface CompanyHistoryEventResponseDto {
  /**
   * Giai đoạn
   * @example "1919 - 1950"
   */
  period: string;
  /**
   * Năm
   * @example "1919"
   */
  year: string;
  /**
   * Nội dung sự kiện
   * @example "Thành lập công ty tại Nagoya."
   */
  text: string;
  /** URL hình ảnh */
  imageUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
  /** ID */
  id: string;
}

export interface CreateCompanyHistoryEventDto {
  /**
   * Giai đoạn
   * @example "1919 - 1950"
   */
  period: string;
  /**
   * Năm
   * @example "1919"
   */
  year: string;
  /**
   * Nội dung sự kiện
   * @example "Thành lập công ty tại Nagoya."
   */
  text: string;
  /** URL hình ảnh */
  imageUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface UpdateHistoryEventOrderDto {
  /** ID của sự kiện lịch sử */
  id: string;
  /** Thứ tự mới */
  orderIndex: number;
}

export interface UpdateHistoryEventOrdersDto {
  /** Danh sách sự kiện với thứ tự mới */
  events: UpdateHistoryEventOrderDto[];
}

export interface UpdateCompanyHistoryEventDto {
  /**
   * Giai đoạn
   * @example "1919 - 1950"
   */
  period?: string;
  /**
   * Năm
   * @example "1919"
   */
  year?: string;
  /**
   * Nội dung sự kiện
   * @example "Thành lập công ty tại Nagoya."
   */
  text?: string;
  /** URL hình ảnh */
  imageUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface UpsertHistoryEventTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Nhãn giai đoạn theo ngôn ngữ */
  period: string;
  /** Nội dung sự kiện theo ngôn ngữ */
  text: string;
}

export interface CompanyLocationResponseDto {
  /**
   * Tiêu đề vị trí
   * @example "Vị trí nhà máy"
   */
  title: string;
  /**
   * Nhãn địa chỉ
   * @example "ĐỊA CHỈ NHÀ MÁY"
   */
  addressLabel: string;
  /**
   * Địa chỉ chi tiết
   * @example "Công Ty Cổ Phần Thanh Bằng, Xuân Trường, Ninh Bình 420000, Việt Nam"
   */
  address: string;
  /**
   * Đường dẫn liên kết chỉ đường Google Maps
   * @example "https://maps.google.com/?q=..."
   */
  directionsUrl?: string;
  /**
   * Đường dẫn URL nhúng bản đồ Google Maps (iframe src hoặc chuỗi HTML iframe)
   * @example "https://www.google.com/maps/embed?pb=..."
   */
  mapUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
  /** ID */
  id: string;
  /**
   * Thời gian tạo
   * @format date-time
   */
  createdAt: string;
  /**
   * Thời gian cập nhật
   * @format date-time
   */
  updatedAt: string;
}

export interface CreateCompanyLocationDto {
  /**
   * Tiêu đề vị trí
   * @example "Vị trí nhà máy"
   */
  title: string;
  /**
   * Nhãn địa chỉ
   * @example "ĐỊA CHỈ NHÀ MÁY"
   */
  addressLabel: string;
  /**
   * Địa chỉ chi tiết
   * @example "Công Ty Cổ Phần Thanh Bằng, Xuân Trường, Ninh Bình 420000, Việt Nam"
   */
  address: string;
  /**
   * Đường dẫn liên kết chỉ đường Google Maps
   * @example "https://maps.google.com/?q=..."
   */
  directionsUrl?: string;
  /**
   * Đường dẫn URL nhúng bản đồ Google Maps (iframe src hoặc chuỗi HTML iframe)
   * @example "https://www.google.com/maps/embed?pb=..."
   */
  mapUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface UpdateCompanyLocationOrderDto {
  /** ID của vị trí công ty */
  id: string;
  /** Thứ tự mới */
  orderIndex: number;
}

export interface UpdateCompanyLocationOrdersDto {
  /** Danh sách vị trí với thứ tự mới */
  locations: UpdateCompanyLocationOrderDto[];
}

export interface UpdateCompanyLocationDto {
  /**
   * Tiêu đề vị trí
   * @example "Vị trí nhà máy"
   */
  title?: string;
  /**
   * Nhãn địa chỉ
   * @example "ĐỊA CHỈ NHÀ MÁY"
   */
  addressLabel?: string;
  /**
   * Địa chỉ chi tiết
   * @example "Công Ty Cổ Phần Thanh Bằng, Xuân Trường, Ninh Bình 420000, Việt Nam"
   */
  address?: string;
  /**
   * Đường dẫn liên kết chỉ đường Google Maps
   * @example "https://maps.google.com/?q=..."
   */
  directionsUrl?: string;
  /**
   * Đường dẫn URL nhúng bản đồ Google Maps (iframe src hoặc chuỗi HTML iframe)
   * @example "https://www.google.com/maps/embed?pb=..."
   */
  mapUrl?: string;
  /**
   * Thứ tự hiển thị
   * @default 0
   */
  orderIndex?: number;
}

export interface UpsertCompanyLocationTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Tên vị trí theo ngôn ngữ */
  title: string;
  /** Nhãn địa chỉ theo ngôn ngữ */
  addressLabel: string;
  /** Địa chỉ chi tiết theo ngôn ngữ */
  address: string;
}

export interface AiChatDto {
  /**
   * Câu hỏi hoặc tin nhắn gửi cho AI (Tối đa 300 ký tự)
   * @maxLength 300
   * @pattern ^(?!.*(<script|<iframe|javascript:|SELECT\s+|DROP\s+|DELETE\s+FROM|UNION\s+SELECT)).*$
   * @example "Bên bạn có máy phay CNC nào giá dưới 1 tỷ không?"
   */
  message: string;
  /**
   * ID phiên hội thoại (UUID) giúp AI nhớ lịch sử câu hỏi trước đó
   * @example "c9b4a123-4567-89ab-cdef-0123456789ab"
   */
  sessionId?: string;
}

export interface AiChatResponseDto {
  /**
   * Câu trả lời từ Trợ lý AI
   * @example "Hiện tại Công ty Thanh Bằng có dòng máy phay CNC..."
   */
  reply: string;
  /**
   * Đánh dấu phản hồi được lấy từ Cache (nhanh hơn & tiết kiệm quota)
   * @example false
   */
  cached: boolean;
  /**
   * ID phiên hội thoại được cấp hoặc duy trì
   * @example "c9b4a123-4567-89ab-cdef-0123456789ab"
   */
  sessionId?: string;
}

export interface ContactSettingResponseDto {
  /**
   * ID singleton
   * @example "singleton"
   */
  id: string;
  /**
   * Tiêu đề khối liên hệ
   * @example "Liên hệ với chúng tôi"
   */
  title: string;
  /** Mô tả ngắn khối liên hệ */
  description: string;
  /**
   * Hotline tư vấn
   * @example "0374 864 110"
   */
  hotline: string;
  /**
   * Chat Zalo
   * @example "0374 864 110"
   */
  zalo: string;
  /**
   * Email liên hệ
   * @example "info@kiendinhecm.com"
   */
  email: string;
  /** Địa chỉ */
  address?: string;
  /** Thời gian làm việc */
  workingHours?: string;
  /** URL nhúng bản đồ Google Maps */
  mapUrl?: string;
  /**
   * Thời gian cập nhật
   * @format date-time
   */
  updatedAt: string;
}

export interface UpdateContactSettingDto {
  /**
   * Tiêu đề khối liên hệ
   * @example "Liên hệ với chúng tôi"
   */
  title?: string;
  /**
   * Mô tả ngắn khối liên hệ
   * @example "Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về sản phẩm và dịch vụ. Hãy để lại thông tin, đội ngũ tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất."
   */
  description?: string;
  /**
   * Số hotline tư vấn
   * @example "0374 864 110"
   */
  hotline?: string;
  /**
   * Số hoặc liên kết Zalo
   * @example "0374 864 110"
   */
  zalo?: string;
  /**
   * Địa chỉ Email liên hệ
   * @example "info@kiendinhecm.com"
   */
  email?: string;
  /**
   * Địa chỉ công ty/văn phòng
   * @example "Hà Nội, Việt Nam"
   */
  address?: string;
  /**
   * Thời gian làm việc
   * @example "8:00 - 17:30 (Thứ 2 - Thứ 6)"
   */
  workingHours?: string;
  /**
   * Đường dẫn URL nhúng bản đồ Google Maps (src URL hoặc mã <iframe ...>)
   * @example "https://www.google.com/maps/embed?pb=..."
   */
  mapUrl?: string;
}

export interface UpsertContactSettingTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Tiêu đề khối liên hệ theo ngôn ngữ */
  title: string;
  /** Mô tả khối liên hệ theo ngôn ngữ */
  description: string;
  /** Địa chỉ theo ngôn ngữ */
  address?: string;
  /** Giờ làm việc theo ngôn ngữ */
  workingHours?: string;
}

export interface CustomerSupportLinkDto {
  /**
   * Nhãn liên kết
   * @example "Tư vấn ngay"
   */
  label: string;
  /**
   * Đường dẫn URL
   * @example "/contact"
   */
  href: string;
}

export interface FooterSettingResponseDto {
  /**
   * ID singleton
   * @example "singleton"
   */
  id: string;
  /** Nội dung giới thiệu công ty */
  introText: string;
  /** Facebook URL */
  facebookUrl?: string;
  /** YouTube URL */
  youtubeUrl?: string;
  /** Instagram URL */
  instagramUrl?: string;
  /** Số điện thoại chính */
  phone?: string;
  /** Email liên hệ */
  email?: string;
  /** Địa chỉ công ty */
  address?: string;
  /** Hotline Mua hàng */
  salesPhone?: string;
  /** Hotline Góp ý */
  feedbackPhone?: string;
  /** Hotline Bảo hành */
  warrantyPhone?: string;
  /** Tiêu đề cột Hỗ trợ khách hàng */
  customerSupportTitle?: string;
  /** Danh sách liên kết Hỗ trợ khách hàng */
  customerSupportLinks?: CustomerSupportLinkDto[];
  /**
   * Thời gian cập nhật
   * @format date-time
   */
  updatedAt: string;
}

export interface UpdateFooterSettingDto {
  /**
   * Đoạn giới thiệu công ty ở footer
   * @example "Công ty Cổ Phần Thanh Bằng tự hào là một trong những công ty uy tín nhất hiện nay và sẵn sàng cam kết với khách hàng về các vấn đề chất lượng, nguồn gốc xuất xứ của sản phẩm cũng như các dịch vụ đi kèm khác."
   */
  introText?: string;
  /**
   * Trang Facebook
   * @example "https://www.facebook.com/ThanhBangNamDinh"
   */
  facebookUrl?: string;
  /**
   * Kênh YouTube
   * @example "https://www.youtube.com/@congtythanhbang1735"
   */
  youtubeUrl?: string;
  /**
   * Kênh Instagram
   * @example "https://instagram.com/..."
   */
  instagramUrl?: string;
  /**
   * Số điện thoại hotline chính
   * @example "0943676869"
   */
  phone?: string;
  /**
   * Địa chỉ Email liên hệ
   * @example "maygachbetongtb@gmail.com"
   */
  email?: string;
  /**
   * Địa chỉ trụ sở/nhà máy
   * @example "Công Ty Cổ Phần Thanh Bằng, Xuân Trường, Ninh Bình 420000, Việt Nam"
   */
  address?: string;
  /**
   * Số điện thoại liên hệ mua hàng
   * @example "0943.67.68.69"
   */
  salesPhone?: string;
  /**
   * Số điện thoại đóng góp ý kiến
   * @example "0914 161 122"
   */
  feedbackPhone?: string;
  /**
   * Số điện thoại bảo hành
   * @example "0912 01 77 55"
   */
  warrantyPhone?: string;
  /**
   * Tiêu đề cột hỗ trợ khách hàng
   * @example "HỖ TRỢ KHÁCH HÀNG"
   */
  customerSupportTitle?: string;
  /** Danh sách đường dẫn hỗ trợ khách hàng */
  customerSupportLinks?: CustomerSupportLinkDto[];
}

export interface UpsertFooterSettingTranslationDto {
  /** Ngôn ngữ dịch (VI | EN) */
  lang: "VI" | "EN";
  /** Văn bản giới thiệu footer theo ngôn ngữ */
  introText: string;
  /** Địa chỉ theo ngôn ngữ */
  address?: string;
  /** Tiêu đề hỗ trợ khách hàng theo ngôn ngữ */
  customerSupportTitle?: string;
  /** Danh sách liên kết hỗ trợ theo ngôn ngữ [{label, href}] */
  customerSupportLinks?: object;
}
