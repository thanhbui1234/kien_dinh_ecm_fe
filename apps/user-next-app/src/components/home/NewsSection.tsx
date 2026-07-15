'use client';

import Link from 'next/link';
import { SectionHeading } from 'shared-ui';
import { Badge } from 'shared-ui';
import { Button } from 'shared-ui';

interface NewsItem {
  date: string;
  tags: string[];
  title: string;
  href: string;
}

const newsItems: NewsItem[] = [
  { date: '10/7/2026', tags: ['Company', 'News'], title: 'Thank You for Joining Us at MTA Vietnam 2026', href: '/news-media/news/' },
  { date: '3/6/2026', tags: ['Mazak', 'Company'], title: 'Mazak Malaysia Showcases Innovation at METALTECH & AUTOMEX 2026', href: '/news-media/news/' },
  { date: '17/5/2025', tags: ['Company'], title: "That's a wrap on METALTECH 2025!", href: '/news-media/news/' },
  { date: '14/4/2025', tags: ['Mazak', 'Product'], title: 'INTEGREX i NEO series — Giải pháp gia công toàn diện thế hệ mới', href: '/news-media/news/' },
];

export default function NewsSection() {
  return (
    <>
      <style>{`
        .news-link:hover { color: #ff5901 !important; }
        @media (max-width: 768px) {
          .news-two-col { flex-direction: column !important; }
          .news-events-col { border-left: none !important; border-top: 1px solid #eee; padding-top: 40px !important; padding-left: 0 !important; }
        }
      `}</style>
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ marginBottom: '48px' }}>
            <SectionHeading>Tin tức và truyền thông</SectionHeading>
          </div>

          <div className="news-two-col" style={{ display: 'flex', gap: '0' }}>
            {/* Left: Latest News */}
            <div style={{ flex: '1', paddingRight: '60px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 400, color: '#111', margin: '0 0 24px 0' }}>
                Tin mới nhất
              </h3>

              <div>
                {newsItems.map((item, i) => (
                  <div key={i} style={{ borderTop: '1px solid #e8e8e8', padding: '20px 0' }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}
                    >
                      <span style={{ fontSize: '12px', color: '#888' }}>{item.date}</span>
                      {item.tags.map((tag) => (
                        <Badge
                          key={tag}
                          style={{
                            backgroundColor: 'rgba(255,89,1,0.08)',
                            color: '#ff5901',
                            border: '1px solid rgba(255,89,1,0.2)',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 500,
                            padding: '2px 10px',
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Link
                      href={item.href}
                      className="news-link"
                      style={{
                        fontSize: '15px',
                        fontWeight: 400,
                        color: '#111',
                        textDecoration: 'none',
                        lineHeight: 1.6,
                        display: 'block',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {item.title}
                    </Link>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #e8e8e8' }} />
              </div>

              <div style={{ marginTop: '40px' }}>
                <Button asChild className="rounded-full bg-[#111] hover:bg-[#333] px-10 py-3 text-sm font-medium h-auto">
                  <Link href="/news-media/">Tin tức và truyền thông</Link>
                </Button>
              </div>
            </div>

            {/* Right: Upcoming Events */}
            <div
              className="news-events-col"
              style={{ width: '340px', flexShrink: 0, paddingLeft: '60px', borderLeft: '1px solid #e8e8e8' }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 400, color: '#111', margin: '0 0 24px 0' }}>
                sự kiện sắp tới
              </h3>
              <div style={{ borderTop: '1px solid #e8e8e8', padding: '24px 0', color: '#888', fontSize: '14px' }}>
                Sắp ra mắt
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
