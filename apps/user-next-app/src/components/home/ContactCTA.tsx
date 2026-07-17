import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="bg-[#111] py-20">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-[#ff5901] text-[11px] font-semibold uppercase tracking-[0.22em] mb-3">
            Liên hệ với chúng tôi
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-light leading-tight">
            Sẵn sàng tư vấn <span className="font-bold">giải pháp</span>
            <br className="hidden md:block" /> phù hợp với bạn
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <Link
            href="/contact/"
            className="group flex items-center gap-3 bg-[#ff5901] text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-[#e04f00] transition-colors duration-200 no-underline"
          >
            <Phone className="w-4 h-4" />
            Liên hệ ngay
          </Link>
          <Link
            href="/products/"
            className="group flex items-center gap-2 text-white/60 text-sm font-medium hover:text-white transition-colors duration-200 no-underline"
          >
            Xem sản phẩm
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
