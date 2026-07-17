import Link from 'next/link';

export const FooterCopyright = () => {
  return (
    <div className="relative z-[2] flex flex-wrap items-center justify-between gap-2 py-5 px-10 text-[12px] text-white">
      <div className="flex flex-wrap gap-4">
        <Link href="/cookie-declaration/" className="text-white no-underline text-[12px]">Cookie Declaration</Link>
        <span className="text-white/50">|</span>
        <span className="text-white">Cẩn thận hàng giả!</span>
        <span className="text-white/50">|</span>
        <Link href="/about-website/" className="text-white no-underline text-[12px]">Về trang web này</Link>
      </div>
      <span>Copyright (C) 2626 Chi Thanh & Pham Duc.</span>
    </div>
  );
};
