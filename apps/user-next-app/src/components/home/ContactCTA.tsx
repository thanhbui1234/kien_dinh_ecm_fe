import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function ContactCTA() {
  const t = await getTranslations();

  return (
    <section className="bg-[#111] py-20">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <p className="text-[#5e8dd1] text-[11px] font-semibold uppercase tracking-[0.22em] mb-3">
            {t('home.contact_label')}
          </p>
          <h2 className="text-white text-3xl md:text-4xl font-light leading-tight">
            {t('home.contact_headline_part1')}{" "}
            <span className="font-bold">{t('home.contact_headline_bold')}</span>
            <br className="hidden md:block" /> {t('home.contact_headline_part2')}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <Link
            href="/contact/"
            className="group flex items-center gap-3 bg-[#5e8dd1] text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-[#356098] transition-colors duration-200 no-underline"
          >
            <Phone className="w-4 h-4" />
            {t('common.contact_us')}
          </Link>
          <Link
            href="/products/"
            className="group flex items-center gap-2 text-white/60 text-sm font-medium hover:text-white transition-colors duration-200 no-underline"
          >
            {t('home.view_products')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
