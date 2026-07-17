export interface Slide {
  type: "fullscreen" | "product";
  image: string;
  title: string;
  subtitle?: string;
  description: string;
  link: string;
  linkText: string;
  darkText?: boolean;
}

export const defaultSlides: Slide[] = [
  {
    type: "fullscreen",
    image: "/images/hero/integrex-i-neo.jpg",
    title: "DONE IN ONE",
    subtitle: "INTEGREX i NEO series",
    description:
      "Máy đa năng tích hợp nhiều quy trình như tiện, phay, mài và đo lường chi tiết gia công.",
    link: "/products/integrex-i-neo/",
    linkText: "Đọc thêm",
  },
  {
    type: "fullscreen",
    image: "/images/hero/go-green.jpg",
    title: "Đổi mới vì Trái Đất",
    subtitle: "Ý tưởng toàn cầu, tác động cục bộ",
    description:
      "Chúng tôi đóng góp vào một xã hội bền vững bằng cách cân bằng giữa sản xuất thân thiện với con người và với môi trường.",
    link: "/about-us/environment/",
    linkText: "Đọc thêm",
    darkText: true,
  },
  {
    type: "fullscreen",
    image: "/images/hero/automation.jpg",
    title: "Giải pháp tổng thể",
    subtitle: "cho hệ thống tự động hóa",
    description:
      "Giải pháp trọn gói mọi thiết bị cần thiết cho tự động hóa: máy công cụ, công nghệ gia công, đồ gá, phần mềm và thiết bị đo lường.",
    link: "/products/automation-machining/",
    linkText: "Xem hệ thống tự động hóa",
  },
  {
    type: "product",
    image: "/images/hero/qte-series.jpg",
    title: "QTE series",
    description:
      "Trung tâm tiện CNC tốc độ cao, độ chính xác cao, tiết kiệm không gian.",
    link: "/products/qte/",
    linkText: "Đọc thêm",
    darkText: true,
  },
  {
    type: "product",
    image: "/images/hero/qt-primos.jpg",
    title: "QT PRIMOS",
    description: "Trung tâm tiện CNC 2 trục nhỏ gọn, hiệu suất cao.",
    link: "/products/qt-primos/",
    linkText: "Đọc thêm",
    darkText: true,
  },
];

export const AUTO_ADVANCE_MS = 8500;
