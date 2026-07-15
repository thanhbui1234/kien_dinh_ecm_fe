'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NavButton, SectionHeading } from 'shared-ui';

interface PickupItem {
  title: string;
  description: string;
  image: string;
  href: string;
}

const pickupItems: PickupItem[] = [
  {
    title: 'CYBER WORLD',
    description: 'Cyber World là tạp chí giới thiệu các xu hướng công nghiệp và công nghệ tiên tiến',
    image: '/images/pickup/cyber-world.jpg',
    href: '/news-media/cyberworld-dl/',
  },
  {
    title: 'Hàn khuấy ma sát (FSW)',
    description: 'Kết nối ổn định với trục chính FSW chuyên dụng và điều khiển tốc độ cao đạt được công nghệ FSW có năng suất cao',
    image: '/images/pickup/fsw-pickup.jpg',
    href: '/products/fsw/',
  },
  {
    title: 'S. E. A Parts Center',
    description: 'Trung tâm cung cấp phụ tùng chính hãng Mazak cho khu vực Đông Nam Á, đảm bảo giao hàng nhanh chóng và đáng tin cậy',
    image: '/images/pickup/seapartscenter.jpg',
    href: '/service-support/parts-supply/',
  },
  {
    title: 'Go Green',
    description: 'Chúng tôi đóng góp vào một xã hội bền vững bằng cách cân bằng giữa sản xuất thân thiện với con người và môi trường',
    image: '/images/hero/go-green.jpg',
    href: '/about-us/environment/',
  },
];

export default function PickupSection() {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const visibleCount = 3;
  const maxIndex = pickupItems.length - visibleCount;

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(maxIndex, c + 1)), [maxIndex]);

  return (
    <>
      <style>{`
        .pickup-card-img { transform: scale(1); transition: transform 0.4s ease; }
        .pickup-card:hover .pickup-card-img { transform: scale(1.03); }
        @media (max-width: 900px) { .pickup-track { gap: 12px !important; } }
      `}</style>
      <section style={{ backgroundColor: '#fff', padding: '60px 0 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1266px', margin: '0 auto', padding: '0 40px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '32px',
            }}
          >
            <SectionHeading size="sm">Pick Up</SectionHeading>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <NavButton direction="prev" onClick={prev} disabled={current === 0} aria-label="Previous" />
              <NavButton direction="next" onClick={next} disabled={current >= maxIndex} aria-label="Next" />
            </div>
          </div>

          <div style={{ overflow: 'hidden' }}>
            <div
              ref={trackRef}
              className="pickup-track"
              style={{
                display: 'flex',
                gap: '20px',
                transform: `translateX(calc(-${current} * (calc((100% + 20px) / ${visibleCount}))))`,
                transition: 'transform 0.4s ease',
              }}
            >
              {pickupItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="pickup-card"
                  style={{
                    flex: `0 0 calc((100% - ${(visibleCount - 1) * 20}px) / ${visibleCount})`,
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '66%', overflow: 'hidden', backgroundColor: '#eee' }}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="pickup-card-img"
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div style={{ paddingTop: '16px', paddingBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6, margin: 0 }}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
