import Link from 'next/link';
import Image from 'next/image';
import { SectionHeading, CircleArrow } from 'shared-ui';
import { Button } from 'shared-ui';
import { Product } from 'shared-api';

interface ProductsSectionProps {
  products?: Product[];
}

export default function ProductsSection({ products = [] }: ProductsSectionProps) {
  return (
    <section className="bg-[#f0f0f0] py-20 relative overflow-hidden">
      {/* Hexagonal pattern background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
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

      <div className="max-w-[1300px] mx-auto px-10 relative z-10">
        <div className="mb-12">
          <SectionHeading>Sản phẩm nổi bật</SectionHeading>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 min-[1100px]:grid-cols-6 gap-0 mb-14">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`} 
              className="group block no-underline py-8 px-5 text-center transition-colors duration-200 ease-in-out hover:bg-black/5"
            >
              <div className="relative w-full h-[170px] mb-4 overflow-visible">
                {product.thumbnailUrl ? (
                  <Image
                    src={product.thumbnailUrl}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-350 ease-out group-hover:-translate-y-1.5"
                    sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 17vw"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 text-sm">
                    No image
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[13px] text-[#111] leading-[1.4] transition-colors duration-200 ease-in-out group-hover:text-[#ff5901]">
                  {product.name}
                </span>
                <span className="text-[#111] transition-colors duration-200 ease-in-out group-hover:text-[#ff5901]">
                  <CircleArrow />
                </span>
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-10 text-zinc-500">
              Đang cập nhật sản phẩm...
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button asChild className="rounded-full bg-[#111] hover:bg-[#333] px-14 py-3 text-sm font-medium h-auto">
            <Link href="/products/">Tất cả sản phẩm</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
