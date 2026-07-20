import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import type { Facility } from 'shared-api';
import { api } from '@/lib/api';
import { FacilityCard } from './production-facilities/FacilityCard';

const CompanyHistoryTimeline = dynamic(
  () => import('./company-history/CompanyHistoryTimeline').then((m) => ({ default: m.CompanyHistoryTimeline }))
);

export const metadata: Metadata = {
  title: 'Về chúng tôi | Kiến Đỉnh',
  description: 'Tìm hiểu về Kiến Đỉnh — lịch sử, sứ mệnh và các cơ sở sản xuất trên toàn thế giới.',
};

function sanitizeHtml(html: string): string {
  return html.replace(/&nbsp;/g, ' ').replace(/ /g, ' ');
}

function groupFacilities(facilities: Facility[]) {
  const map = new Map<string, Map<string, Facility[]>>();
  for (const f of facilities) {
    if (!map.has(f.region)) map.set(f.region, new Map());
    const countryMap = map.get(f.region)!;
    if (!countryMap.has(f.country)) countryMap.set(f.country, []);
    countryMap.get(f.country)!.push(f);
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
          <Link href="/" className="hover:text-[#ff5901] transition-colors no-underline">Trang chủ</Link>
          <span>/</span>
          <span className="text-[#111]">Về chúng tôi</span>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative w-full h-[55vh] min-h-[420px] md:h-[72vh] md:min-h-[560px] overflow-hidden bg-[#111]">
        {aboutThumbnail && (
          <img
            src={aboutThumbnail}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Gradient overlays — same as ProjectHero */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />
        {/* Orange bottom accent line */}
        <div className="absolute bottom-0 left-0 h-[2px] w-[45%] bg-linear-to-r from-[#ff5901] via-[#ff5901]/60 to-transparent" />
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-10 pb-12 md:pb-16 max-w-[1300px] mx-auto left-0 right-0">
          <p className="text-[#ff5901] text-[11px] font-semibold uppercase tracking-[0.22em] mb-3">
            Về chúng tôi
          </p>
          <h1 className="text-white text-[32px] md:text-[52px] lg:text-[60px] font-light leading-[1.1] tracking-[-0.02em] max-w-[800px] m-0">
            Kiến Đỉnh —<br />
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
        <section className="max-w-[1300px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ff5901]">01 — Sơ lược</span>
            <h2 className="text-[36px] md:text-[52px] font-light text-[#111] tracking-[-0.03em] m-0 mt-3 leading-tight">
              Về Kiến Đỉnh
            </h2>
            <div className="mt-4 w-12 h-[3px] bg-[#ff5901]" />
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
      )}

      {/* ── LỊCH SỬ PHÁT TRIỂN ───────────────────────────────── */}
      {sortedTimelines.length > 0 && (
        <div className="bg-[#f9f9f9]">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-0">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ff5901]">02 — Lịch sử phát triển</span>
            <h2 className="text-[36px] md:text-[52px] font-light text-[#111] tracking-[-0.03em] m-0 mt-3 leading-tight">
              Hành trình phát triển
            </h2>
            <div className="mt-4 w-12 h-[3px] bg-[#ff5901]" />
          </div>
          <CompanyHistoryTimeline items={sortedTimelines} />
        </div>
      )}

      {/* ── CƠ SỞ SẢN XUẤT ───────────────────────────────────── */}
      {grouped.size > 0 && (
        <section className="max-w-[1300px] mx-auto px-6 md:px-10 py-20 md:py-28">
          <div className="mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ff5901]">03 — Cơ sở sản xuất</span>
            <h2 className="text-[36px] md:text-[52px] font-light text-[#111] tracking-[-0.03em] m-0 mt-3 leading-tight">
              Hệ thống cơ sở toàn cầu
            </h2>
            <div className="mt-4 w-12 h-[3px] bg-[#ff5901]" />
          </div>
          {Array.from(grouped.entries()).map(([region, countryMap]) => (
            <div key={region} className="mb-14 last:mb-0">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-[18px] font-semibold text-[#111] m-0">{region}</h3>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              {Array.from(countryMap.entries()).map(([country, items]) => (
                <div key={country} className="mb-8 last:mb-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5901] mb-4 m-0">{country}</p>
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((facility) => (
                      <FacilityCard key={facility.id} facility={facility} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
