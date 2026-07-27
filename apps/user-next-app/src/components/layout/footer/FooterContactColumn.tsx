import { footerHeadingClass } from './FooterNavColumn';

export const FooterContactColumn = () => {
  return (
    <div>
      <h3 className={footerHeadingClass}>HỖ TRỢ TƯ VẤN</h3>
      <div className="text-[14px] text-[#aaa] space-y-2.5 leading-[1.4]">
        <p><strong className="text-white font-medium">Địa chỉ:</strong> Khu Công Nghiệp Xuân Tiến – Xuân Tiến – Xuân Trường – Nam Định</p>
        <p><strong className="text-white font-medium">Liên hệ mua hàng:</strong> 0943.67.68.69</p>
        <p><strong className="text-white font-medium">Đóng góp ý kiến:</strong> 0914 161 122</p>
        <p><strong className="text-white font-medium">Bảo hành:</strong> 0912 01 77 55</p>
        <p><strong className="text-white font-medium">Email:</strong> maygachbetongtb@gmail.com</p>
      </div>
    </div>
  );
};
