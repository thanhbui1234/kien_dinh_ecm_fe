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

export const AUTO_ADVANCE_MS = 8500;
