import Link from 'next/link';
import Image from 'next/image';
import { SectionHeading, CircleArrow } from 'shared-ui';
import { Button } from 'shared-ui';

interface ProductCategory {
  name: string;
  href: string;
  image: string;
}

const productCategories: ProductCategory[] = [
  { name: 'Máy đa chức năng', href: '/products/#integrex', image: '/images/products/integrex.png' },
  { name: 'Trung tâm gia công 5 trục', href: '/products/#five-axis', image: '/images/products/five-axis.png' },
  { name: 'Máy tiện CNC', href: '/products/#cnc', image: '/images/products/cnc-lathe.png' },
  { name: 'Trung tâm gia công đứng', href: '/products/#vertical', image: '/images/products/vertical.png' },
  { name: 'Trung tâm gia công ngang', href: '/products/#horizontal', image: '/images/products/horizontal.png' },
  { name: 'FSW (Hàn khuấy ma sát)', href: '/products/fsw/', image: '/images/products/fsw.png' },
];

export default function ProductsSection() {
  return (
    <>
      <style>{`
        .product-item {
          display: block;
          text-decoration: none;
          padding: 32px 20px;
          text-align: center;
          transition: background-color 0.2s ease;
        }
        .product-item:hover { background-color: rgba(0,0,0,0.03); }
        .product-item:hover .product-item-name { color: #ff5901; }
        .product-item:hover .product-item-arrow { color: #ff5901; }
        .product-item:hover .product-item-img { transform: translateY(-6px); }
        .product-item-img { transition: transform 0.35s ease; }
        .product-item-name { font-size: 13px; color: #111; line-height: 1.4; transition: color 0.2s ease; }
        .product-item-arrow { color: #111; transition: color 0.2s ease; }
        @media (max-width: 900px) { .products-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 560px) { .products-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
      <section
        style={{
          backgroundColor: '#f0f0f0',
          padding: '80px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Hexagonal pattern background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id="hexBg" x="0" y="0" width="160" height="138" patternUnits="userSpaceOnUse">
                <polygon points="80,4 148,43 148,121 80,160 12,121 12,43" fill="none" stroke="#d4d4d4" strokeWidth="1.5" />
                <polygon points="0,73 -68,112 -68,190 0,229 68,190 68,112" fill="none" stroke="#d4d4d4" strokeWidth="1.5" />
                <polygon points="160,73 92,112 92,190 160,229 228,190 228,112" fill="none" stroke="#d4d4d4" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexBg)" />
          </svg>
        </div>

        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '48px' }}>
            <SectionHeading>Sản phẩm</SectionHeading>
          </div>

          <div
            className="products-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0',
              marginBottom: '56px',
            }}
          >
            {productCategories.map((cat) => (
              <Link key={cat.href} href={cat.href} className="product-item">
                <div style={{ position: 'relative', width: '100%', height: '130px', marginBottom: '16px', overflow: 'visible' }}>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="product-item-img"
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 17vw"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span className="product-item-name">{cat.name}</span>
                  <span className="product-item-arrow">
                    <CircleArrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button asChild className="rounded-full bg-[#111] hover:bg-[#333] px-14 py-3 text-sm font-medium h-auto">
              <Link href="/products/">Tất cả sản phẩm</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
