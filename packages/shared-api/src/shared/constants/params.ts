export const DEFAULT_PAGINATION = {
  page: '1',
  limit: '12', // Thông thường giao diện danh sách hay dùng 12 vì chia hết cho 2, 3, 4
};

export const DEFAULT_FETCH_OPTIONS: RequestInit = {
  // Tùy chọn: Mặc định Next.js 14 fetch() có thể tự động hiểu là cache 'force-cache'
  // Nhưng ta có thể để trống để caller tự cấu hình, hoặc config mặc định ở đây
};
