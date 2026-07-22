import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import type { Facility } from 'shared-api';
import { api } from '@/lib/api';
import { FacilityCard } from './production-facilities/FacilityCard';

const CompanyHistoryTimeline = dynamic(
  () => import('./company-history/CompanyHistoryTimeline').then((m) => ({ default: m.CompanyHistoryTimeline }))
);

export const metadata: Metadata = {
  title: 'Về chúng tôi | Thanh Bằng',
  description: 'Tìm hiểu về Thanh Bằng — lịch sử, sứ mệnh và cơ sở sản xuất. Chuyên cung cấp phụ tùng, dụng cụ cắt gọt và máy công cụ CNC tại Việt Nam.',
  alternates: { canonical: 'https://thanhbang.com/about-us/' },
  openGraph: {
    title: 'Về chúng tôi | Thanh Bằng',
    description: 'Tìm hiểu về Thanh Bằng — lịch sử, sứ mệnh và cơ sở sản xuất.',
    url: 'https://thanhbang.com/about-us/',
    siteName: 'Thanh Bằng',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Về chúng tôi | Thanh Bằng',
    description: 'Tìm hiểu về Thanh Bằng — lịch sử, sứ mệnh và cơ sở sản xuất.',
  },
};

function sanitizeHtml(html: string): string {
  return html.replace(/&nbsp;/g, ' ').replace(/ /g, ' ');
}

function groupFacilities(facilities: Facility[]) {
  const map = new Map<string, Facility[]>();
  for (const f of facilities) {
    if (!map.has(f.country)) map.set(f.country, []);
    map.get(f.country)!.push(f);
  }
  return map;
}

export default async function AboutUsPage() {
  const [profile, companyInfo, historyEvents, facilities] = await Promise.all([
    api.about.getProfile({ next: { revalidate: 3600 } } as RequestInit),
    api.about.getCompanyInfo({ next: { revalidate: 3600 } } as RequestInit),
    api.about.getHistoryEvents({ next: { revalidate: 3600 } } as RequestInit),
    api.about.getFacilities({ next: { revalidate: 3600 } } as RequestInit),
  ]);

  const introHtml = profile?.introHtml ?? '';
  const aboutThumbnail = profile?.thumbnailUrl ?? '';
  const sortedTimelines = [...(historyEvents ?? [])].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const grouped = groupFacilities(facilities ?? []);

  return (
    <div className="min-h-screen bg-white pt-[80px]">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-3 flex items-center gap-2 text-[12px] text-gray-400">
          <Link href="/" className="hover:text-[#5e8dd1] transition-colors no-underline">Trang chủ</Link>
          <span>/</span>
          <span className="text-[#111]">Về chúng tôi</span>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative w-full h-[55vh] min-h-[420px] md:h-[72vh] md:min-h-[560px] overflow-hidden bg-[#111]">
        {aboutThumbnail && (
          <Image
            src={aboutThumbnail}
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        {/* Gradient overlays — same as ProjectHero */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />
        {/* Orange bottom accent line */}
        <div className="absolute bottom-0 left-0 h-[2px] w-[45%] bg-linear-to-r from-[#5e8dd1] via-[#5e8dd1]/60 to-transparent" />
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-10 pb-12 md:pb-16 max-w-[1300px] mx-auto left-0 right-0">
          <p className="text-[#5e8dd1] text-[11px] font-semibold uppercase tracking-[0.22em] mb-3">
            Về chúng tôi
          </p>
          <h1 className="text-white text-[32px] md:text-[52px] lg:text-[60px] font-light leading-[1.1] tracking-[-0.02em] max-w-[800px] m-0">
            Thanh Bằng —<br />
            <span className="text-white/50">chuyên gia máy CNC</span><br />
            tại Việt Nam.
          </h1>
          <p className="text-white/70 text-[15px] md:text-[17px] leading-relaxed mt-4 max-w-[600px] m-0">
            Hơn một thập kỷ đồng hành cùng ngành công nghiệp chế tạo Việt Nam, cung cấp giải pháp máy công cụ CNC và dịch vụ kỹ thuật chuyên sâu.
          </p>
        </div>
      </section>

      {/* ── SƠ LƯỢC ──────────────────────────────────────────── */}
      {((companyInfo ?? []).length > 0 || introHtml || aboutThumbnail) && (
        <div className="bg-[#fafbfd]">
          <section className="max-w-[1300px] mx-auto px-6 md:px-10 py-20 md:py-28">
            <div className="mb-12">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5e8dd1]">01 — Sơ lược</span>
              <h2 className="text-[36px] md:text-[52px] font-light text-[#111] tracking-[-0.03em] m-0 mt-3 leading-tight">
                Về Thanh Bằng
              </h2>
              <div className="mt-4 w-12 h-[3px] bg-[#5e8dd1]" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {(companyInfo ?? []).length > 0 && (
                <div className="divide-y divide-gray-100">
                  {(companyInfo ?? []).map((row) => (
                    <div key={row.id} className="grid grid-cols-[160px_1fr] gap-4 py-4">
                      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gray-400 pt-0.5 leading-snug">
                        {row.label}
                      </span>
                      <span className="text-[14px] text-[#111] leading-relaxed">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Right: intro HTML */}
              {introHtml && (
                <div
                  className="project-article-body text-[15px] leading-[1.85]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(introHtml) }}
                />
              )}
            </div>
          </section>
        </div>
      )}

      {/* ── LỊCH SỬ PHÁT TRIỂN ───────────────────────────────── */}
      {sortedTimelines.length > 0 && (
        <div className="bg-[#eef2f9]">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-0">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5e8dd1]">02 — Lịch sử phát triển</span>
            <h2 className="text-[36px] md:text-[52px] font-light text-[#111] tracking-[-0.03em] m-0 mt-3 leading-tight">
              Hành trình phát triển
            </h2>
            <div className="mt-4 w-12 h-[3px] bg-[#5e8dd1]" />
          </div>
          <CompanyHistoryTimeline items={sortedTimelines} />
        </div>
      )}

      {/* ── CƠ SỞ SẢN XUẤT ───────────────────────────────────── */}
      {grouped.size > 0 && (
        <section className="max-w-[1300px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5e8dd1]">03 — Cơ sở sản xuất</span>
            <h2 className="text-[36px] md:text-[52px] font-light text-[#111] tracking-[-0.03em] m-0 mt-3 leading-tight">
              Hệ thống cơ sở sản xuất
            </h2>
            <div className="mt-4 w-12 h-[3px] bg-[#5e8dd1]" />
          </div>
          <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
            {Array.from(grouped.entries()).map(([country, items]) => (
              <div key={country}>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-[18px] font-semibold text-[#111] m-0">{country}</h3>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                  {items.map((facility) => (
                    <FacilityCard key={facility.id} facility={facility} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
