import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Edit, Loader2, DollarSign, Eye, Package, ZoomIn } from 'lucide-react';
import { AdminPageHeader } from '@/components/common/AdminPageHeader';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { useProductDetail } from '@/queries/products';

function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProductDetail(id || '');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryImages: string[] = [];
  if (product?.thumbnailUrl) galleryImages.push(product.thumbnailUrl);
  if (product?.images && product.images.length > 0) {
    product.images.forEach((img: any) => {
      const url = img.imageUrl || img.url || img;
      if (url && url !== product.thumbnailUrl) galleryImages.push(url);
    });
  }
  const slides = galleryImages.map((src) => ({ src }));

  const videoList: string[] = Array.isArray(product?.detail?.videoUrls)
    ? product.detail.videoUrls
    : Array.isArray((product as any)?.videoUrls)
    ? (product as any).videoUrls
    : Array.isArray((product?.detail as any)?.videos)
    ? (product?.detail as any).videos
    : Array.isArray((product as any)?.videos)
    ? (product as any).videos
    : [];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 text-black animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-gray-500 font-medium text-sm">Không tìm thấy sản phẩm</p>
        <button onClick={() => navigate('/products')} className="text-xs font-bold text-black hover:underline">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <AdminPageHeader
        title={product.name}
        subtitle={`/${product.slug}`}
        onBack={() => navigate('/products')}
        clientUrl={`/products/${product.slug}`}
        actions={
          <Link
            to={`/products/${id}/edit`}
            className="flex items-center gap-1.5 h-9 px-4 rounded-md bg-black text-white text-xs font-bold shadow-sm hover:bg-gray-800 transition-colors no-underline"
          >
            <Edit className="h-3.5 w-3.5" /> Chỉnh sửa
          </Link>
        }
      />

      {/* Balanced 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN: Media Gallery & Videos */}
        <div className="space-y-5">
          {/* Main Thumbnail */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-100 pb-2.5">
              ẢNH ĐẠI DIỆN CHÍNH
            </h2>
            <div
              className="rounded-lg border border-gray-100 bg-gray-50 overflow-hidden aspect-video flex items-center justify-center cursor-zoom-in group relative"
              onClick={() => {
                if (galleryImages.length) {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }
              }}
            >
              {product.thumbnailUrl ? (
                <img
                  src={product.thumbnailUrl}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <Package className="w-12 h-12 text-gray-300" />
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white drop-shadow-md" />
              </div>
            </div>
          </div>

          {/* Gallery Images */}
          {product.images && product.images.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-100 pb-2.5">
                THƯ VIỆN ẢNH ({product.images.length})
              </h2>
              <div className="grid grid-cols-4 gap-2.5">
                {product.images.map((img: any, i: number) => {
                  const url = img.imageUrl || img.url || img;
                  const lbIndex = galleryImages.indexOf(url);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setLightboxIndex(lbIndex >= 0 ? lbIndex : 0);
                        setLightboxOpen(true);
                      }}
                      className="relative aspect-square w-full rounded-md border border-gray-200 overflow-hidden cursor-zoom-in group bg-gray-50"
                    >
                      <img
                        src={url}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Video Section */}
          {videoList.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-100 pb-2.5">
                VIDEO SẢN PHẨM ({videoList.length})
              </h2>
              <div className="space-y-3">
                {videoList.map((url: string, idx: number) => {
                  const youtubeId = getYoutubeId(url);
                  return (
                    <div
                      key={idx}
                      className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 bg-black shadow-xs"
                    >
                      {youtubeId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&controls=1&rel=0`}
                          title={`Video sản phẩm ${idx + 1}`}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <video src={url} controls className="w-full h-full object-contain" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Info, Specs, Features */}
        <div className="space-y-5">
          {/* Basic Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-100 pb-2.5">
              THÔNG TIN SẢN PHẨM
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                  Tên sản phẩm
                </label>
                <p className="text-base text-black font-bold leading-snug">{product.name}</p>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Đường dẫn slug
                </label>
                <code className="text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-2 py-1 rounded inline-block">
                  /{product.slug}
                </code>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Giá bán
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {product.price ? `${product.price.toLocaleString('vi-VN')} ₫` : 'Liên hệ'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-blue-600" /> Lượt xem
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {product.viewCount?.toLocaleString('vi-VN') || 0}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                  product.isFeatured ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-500 border-gray-200'
                }`}
              >
                {product.isFeatured ? '★ SẢN PHẨM NỔI BẬT' : 'SẢN PHẨM THƯỜNG'}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                  product.status ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {product.status ? '● ĐANG HIỂN THỊ' : '○ ĐÃ ẨN'}
              </span>
            </div>
          </div>

          {/* Specifications */}
          {product.detail?.specifications && Object.keys(product.detail.specifications).length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-100 pb-2.5">
                THÔNG SỐ KỸ THUẬT
              </h2>
              <div className="space-y-0 text-xs rounded-lg border border-gray-100 overflow-hidden">
                {Object.entries(product.detail.specifications).map(([key, val], idx) => (
                  <div key={idx} className="flex border-b border-gray-100 last:border-0">
                    <div className="w-2/5 py-2.5 font-bold text-gray-600 bg-gray-50/80 px-3 border-r border-gray-100">
                      {key}
                    </div>
                    <div className="w-3/5 py-2.5 font-medium text-black px-3">{String(val)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {product.detail?.features && Object.keys(product.detail.features).length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-100 pb-2.5">
                TÍNH NĂNG NỔI BẬT
              </h2>
              <div className="space-y-0 text-xs rounded-lg border border-gray-100 overflow-hidden">
                {Object.entries(product.detail.features).map(([key, val], idx) => (
                  <div key={idx} className="flex border-b border-gray-100 last:border-0">
                    <div className="w-2/5 py-2.5 font-bold text-gray-600 bg-gray-50/80 px-3 border-r border-gray-100">
                      {key}
                    </div>
                    <div className="w-3/5 py-2.5 font-medium text-black px-3">{String(val)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FULL WIDTH BOTTOM SECTION: Detailed Content */}
        {product.detail?.contentDetail && (
          <div className="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-100 pb-3">
              NỘI DUNG MÔ TẢ CHI TIẾT
            </h2>
            <div className="w-full overflow-x-auto">
              <div
                className="prose prose-sm max-w-none text-gray-800 prose-headings:text-black prose-a:text-blue-600 break-words [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg"
                dangerouslySetInnerHTML={{ __html: product.detail.contentDetail }}
              />
            </div>
          </div>
        )}
      </div>

      <ImageLightbox
        open={lightboxOpen}
        index={lightboxIndex}
        slides={slides}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(i) => setLightboxIndex(i)}
      />
    </div>
  );
}
