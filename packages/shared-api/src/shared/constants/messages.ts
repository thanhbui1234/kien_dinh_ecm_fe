export const AUTH_MESSAGES = {
  KICKED_TOAST: 'Phiên đăng nhập của bạn đã bị vô hiệu hóa hoặc bị Kick bởi Super Admin!',
  LOCKED_TOAST: 'Tài khoản của bạn đã bị khóa do đăng nhập ở quá 3 thiết bị độc nhất. Vui lòng liên hệ Super Admin để mở khóa!',
  FORBIDDEN_SUPER_ADMIN: 'Bạn không có quyền truy cập vào khu vực Quản trị Cao cấp!',
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  LOGIN_FAILED: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
} as const;

export const USER_MESSAGES = {
  CREATE_SUCCESS: 'Tạo tài khoản Admin thành công!',
  CREATE_FAILED: 'Tạo tài khoản thất bại',
  RESET_SUCCESS: 'Đặt lại mật khẩu, xóa lịch sử 3 thiết bị và mở khóa tài khoản thành công!',
  RESET_FAILED: 'Đặt lại mật khẩu thất bại',
  KICK_SUCCESS: 'Đã Kick tài khoản thành công!',
  KICK_FAILED: 'Kick tài khoản thất bại',
  DELETE_SUCCESS: 'Đã xóa tài khoản thành công!',
  DELETE_FAILED: 'Xóa tài khoản thất bại',
} as const;
