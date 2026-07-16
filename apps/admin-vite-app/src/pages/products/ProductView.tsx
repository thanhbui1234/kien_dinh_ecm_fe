import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Edit, Loader2, Tag, DollarSign, Eye, Calendar, Package } from 'lucide-react';
import { useProductDetail } from '@/queries/products';

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProductDetail(id || '');

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
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/products')}
            className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all shadow-sm">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-black">{product.name}</h1>
            <p className="text-xs font-medium text-gray-500 mt-0.5">/{product.slug}</p>
          </div>
        </div>
        <Link to={`/products/${id}/edit`}
          className="flex items-center gap-1.5 h-9 px-4 rounded-md bg-black text-white text-xs font-bold shadow-sm hover:bg-gray-800 transition-colors">
          <Edit className="h-3.5 w-3.5" /> Chỉnh sửa
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left - Thumbnail */}
        <div className="col-span-1 space-y-5">
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden aspect-square flex items-center justify-center shadow-sm">
            {product.thumbnailUrl ? (
              <img src={product.thumbnailUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-12 h-12 text-gray-300" />
            )}
          </div>

          {/* Stats */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Lượt xem</span>
              <span className="text-sm font-bold text-black">{product.viewCount?.toLocaleString('vi-VN') || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Giá bán</span>
              <span className="text-sm font-bold text-black">
                {product.price ? `${product.price.toLocaleString('vi-VN')} ₫` : 'Liên hệ'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Nổi bật</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                product.isFeatured ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}>{product.isFeatured ? 'CÓ' : 'KHÔNG'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                product.status ? 'bg-white text-black border-black' : 'bg-gray-50 text-gray-500 border-gray-200'
              }`}>
                {product.status ? 'HIỂN THỊ' : 'ĐÃ ẨN'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Ngày tạo</span>
              <span className="text-xs font-medium text-gray-600">{new Date(product.createdAt).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>

        {/* Right - Details */}
        <div className="col-span-2 space-y-5">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">THÔNG TIN CƠ BẢN</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Tên sản phẩm</label>
                <p className="text-sm text-black font-semibold">{product.name}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Slug</label>
                <code className="text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 px-2 py-1 rounded">{product.slug}</code>
              </div>
            </div>
          </div>

          {product.images && product.images.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">THƯ VIỆN ẢNH</h2>
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <img key={i} src={(img as any).imageUrl || (img as any).url || img} alt={`Gallery ${i + 1}`}
                    className="aspect-square w-full object-cover rounded border border-gray-200" />
                ))}
              </div>
            </div>
          )}

          {product.detail?.specifications && Object.keys(product.detail.specifications).length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">THÔNG SỐ KỸ THUẬT</h2>
              <div className="space-y-0 text-sm">
                {Object.entries(product.detail.specifications).map(([key, val], idx) => (
                  <div key={idx} className="flex border-b border-gray-100 last:border-0">
                    <div className="w-1/3 py-2 font-bold text-gray-600 bg-gray-50 px-3">{key}</div>
                    <div className="w-2/3 py-2 font-medium text-black px-3">{String(val)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.detail?.contentDetail && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-black border-b border-gray-100 pb-3">NỘI DUNG CHI TIẾT</h2>
              <div className="w-full overflow-x-auto">
                <div
                  className="prose prose-sm max-w-none text-gray-800 prose-headings:text-black prose-a:text-blue-600 break-words [&>img]:max-w-full [&>img]:h-auto"
                  dangerouslySetInnerHTML={{ __html: product.detail.contentDetail }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
