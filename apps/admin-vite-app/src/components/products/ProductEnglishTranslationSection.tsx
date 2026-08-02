import { useEffect, useState } from 'react';
import { Globe, Plus, Trash2, Loader2, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS, productKeys } from 'shared-api';
import { ENV } from '@/config/env';
import { translateViToEnglish } from '@/utils/ai';

interface SpecItem {
  key: string;
  value: string;
}

export interface ProductEnTranslationState {
  name: string;
  slug: string;
  contentDetail: string;
  specList: SpecItem[];
  featureList: SpecItem[];
}

interface ProductEnglishTranslationSectionProps {
  isEdit: boolean;
  productId?: string;
  enTranslation: ProductEnTranslationState;
  setEnTranslation: React.Dispatch<React.SetStateAction<ProductEnTranslationState>>;
  viSpecsCount: number;
  viFeaturesCount: number;
  viName?: string;
  viContentDetail?: string;
  viSpecList?: SpecItem[];
  viFeatureList?: SpecItem[];
  onSyncFromVi: () => void;
  onSyncFeaturesFromVi?: () => void;
  onSwitchToViTab?: () => void;
  /** Khi true: bản dịch EN đã tồn tại trên server -> ẩn nút AI dịch tự động */
  hasExistingEnTranslation?: boolean;
}

const inputCls = "w-full h-9 px-3 rounded-md bg-white border border-gray-300 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm";
const labelCls = "text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2";

export function ProductEnglishTranslationSection({
  isEdit,
  productId,
  enTranslation,
  setEnTranslation,
  viSpecsCount,
  viFeaturesCount,
  viName = '',
  viContentDetail = '',
  viSpecList = [],
  viFeatureList = [],
  onSyncFromVi,
  onSyncFeaturesFromVi,
  onSwitchToViTab,
  hasExistingEnTranslation = false,
}: ProductEnglishTranslationSectionProps) {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslatingAi, setIsTranslatingAi] = useState(false);
  const [initialData, setInitialData] = useState<ProductEnTranslationState | null>(null);

  // Set initial data baseline once loaded
  useEffect(() => {
    if (initialData === null) {
      setInitialData(enTranslation);
    }
  }, [enTranslation, initialData]);

  const isDirty = initialData ? JSON.stringify(enTranslation) !== JSON.stringify(initialData) : false;

  const handleReset = () => {
    if (initialData) {
      setEnTranslation(initialData);
      toast.info('Đã khôi phục dữ liệu bản dịch về ban đầu.');
    }
  };

  const enSpecsCount = enTranslation.specList.filter(s => s.key.trim() || s.value.trim()).length;
  const enFeaturesCount = enTranslation.featureList.filter(f => f.key.trim() || f.value.trim()).length;

  const isSpecsMismatched = viSpecsCount > 0 && enSpecsCount !== viSpecsCount;
  const isFeaturesMismatched = viFeaturesCount > 0 && enFeaturesCount !== viFeaturesCount;

  const handleAiTranslate = async () => {
    const apiKey = ENV.GEMINI_API_KEY;
    if (!apiKey) {
      toast.error(null, 'Chưa cấu hình VITE_GEMINI_API_KEY trong file .env.local!');
      return;
    }

    try {
      setIsTranslatingAi(true);
      toast.info('AI đang dịch toàn bộ nội dung sản phẩm sang Tiếng Anh...');
      const res = await translateViToEnglish(apiKey, {
        name: viName || enTranslation.name,
        contentDetail: viContentDetail || enTranslation.contentDetail,
        specs: viSpecList.length > 0 ? viSpecList : enTranslation.specList,
        features: viFeatureList.length > 0 ? viFeatureList : enTranslation.featureList,
      });

      setEnTranslation({
        name: res.name || enTranslation.name,
        slug: enTranslation.slug,
        contentDetail: res.contentDetail || enTranslation.contentDetail,
        specList: res.specs && res.specs.length > 0 ? res.specs : enTranslation.specList,
        featureList: res.features && res.features.length > 0 ? res.features : enTranslation.featureList,
      });

      toast.success('Dịch tự động sang Tiếng Anh bằng AI thành công!');
    } catch (err: any) {
      toast.error(null, err.message || 'Lỗi khi dịch bằng AI, vui lòng thử lại');
    } finally {
      setIsTranslatingAi(false);
    }
  };

  const handleSave = async () => {
    if (!productId || !enTranslation.name.trim()) {
      toast.error(null, 'Vui lòng nhập tên sản phẩm bằng Tiếng Anh trước khi lưu');
      return;
    }

    const specsObj = enTranslation.specList.reduce((acc: Record<string, string>, item) => {
      if (item.key && item.key.trim()) acc[item.key.trim()] = item.value;
      return acc;
    }, {});

    const featuresObj = enTranslation.featureList.reduce((acc: Record<string, string>, item) => {
      if (item.key && item.key.trim()) acc[item.key.trim()] = item.value;
      return acc;
    }, {});

    try {
      setIsSaving(true);
      await axiosInstance.post(API_ENDPOINTS.PRODUCTS.TRANSLATION(productId), {
        lang: 'EN',
        name: enTranslation.name.trim(),
        contentDetail: enTranslation.contentDetail || undefined,
        specifications: Object.keys(specsObj).length > 0 ? specsObj : undefined,
        features: Object.keys(featuresObj).length > 0 ? featuresObj : undefined,
      });
      setInitialData(enTranslation);
      // Invalidate React Query cache để fetch lại data mới (hasEnTranslation, translations[])
      await queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
      toast.success('Lưu bản dịch Tiếng Anh sản phẩm thành công!');
    } catch {
      toast.error(null, 'Lưu bản dịch Tiếng Anh thất bại, vui lòng thử lại');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold text-gray-900">Bản dịch Tiếng Anh (English Product Translation)</h2>
        </div>

        {/* Sync & AI Translate Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Nút AI dịch: luôn hiển thị để Admin có thể dịch/dịch lại bất kỳ lúc nào */}
          <button
            type="button"
            onClick={handleAiTranslate}
            disabled={isTranslatingAi}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Dùng Gemini AI tự động dịch Tên, Thông số, Tính năng và Bài viết sang Tiếng Anh"
          >
            {isTranslatingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>🤖 Dịch Tiếng Anh bằng AI</span>
          </button>

          {viFeaturesCount > 0 && onSyncFeaturesFromVi && (
            <button
              type="button"
              onClick={onSyncFeaturesFromVi}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Sao chép danh sách tính năng nổi bật từ Tiếng Việt sang để tiện dịch"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>⚡ Tải tính năng từ Tiếng Việt</span>
            </button>
          )}
        </div>
      </div>


      {isFeaturesMismatched && (
        <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Cảnh báo lệch tính năng:</strong> Tiếng Anh hiện có <strong>{enFeaturesCount}</strong> tính năng, nhưng Tiếng Việt có <strong>{viFeaturesCount}</strong> tính năng.
            </span>
          </div>
          {onSyncFeaturesFromVi && (
            <button
              type="button"
              onClick={onSyncFeaturesFromVi}
              className="text-xs font-bold text-indigo-700 underline hover:text-indigo-900 cursor-pointer ml-3 shrink-0"
            >
              Đồng bộ ngay
            </button>
          )}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className={labelCls}>Tên sản phẩm (Tiếng Anh) *</label>
          <input
            type="text"
            className={inputCls}
            placeholder="Ví dụ: CNC Milling Machine Mazak 3-Axis"
            value={enTranslation.name}
            onChange={(e) => setEnTranslation({ ...enTranslation, name: e.target.value })}
          />
        </div>

        {/* Specifications EN Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <label className={labelCls}>Thông số kỹ thuật (Tiếng Anh)</label>
            <button
              type="button"
              onClick={() =>
                setEnTranslation({
                  ...enTranslation,
                  specList: [...enTranslation.specList, { key: '', value: '' }],
                })
              }
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm chỉ số
            </button>
          </div>

          {enTranslation.specList.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Tên chỉ số (VD: Motor Power)"
                className={inputCls}
                value={item.key}
                onChange={(e) => {
                  const updated = [...enTranslation.specList];
                  updated[idx].key = e.target.value;
                  setEnTranslation({ ...enTranslation, specList: updated });
                }}
              />
              <input
                type="text"
                placeholder="Giá trị (VD: 15 kW)"
                className={inputCls}
                value={item.value}
                onChange={(e) => {
                  const updated = [...enTranslation.specList];
                  updated[idx].value = e.target.value;
                  setEnTranslation({ ...enTranslation, specList: updated });
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const updated = enTranslation.specList.filter((_, i) => i !== idx);
                  setEnTranslation({ ...enTranslation, specList: updated });
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
                title="Xóa dòng này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Features EN Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <label className={labelCls}>Tính năng nổi bật (Tiếng Anh)</label>
            <button
              type="button"
              onClick={() =>
                setEnTranslation({
                  ...enTranslation,
                  featureList: [...enTranslation.featureList, { key: '', value: '' }],
                })
              }
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm tính năng
            </button>
          </div>

          {enTranslation.featureList.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Tên tính năng (VD: High-Speed Spindle)"
                className={inputCls}
                value={item.key}
                onChange={(e) => {
                  const updated = [...enTranslation.featureList];
                  updated[idx].key = e.target.value;
                  setEnTranslation({ ...enTranslation, featureList: updated });
                }}
              />
              <input
                type="text"
                placeholder="Mô tả chi tiết (VD: 12,000 RPM)"
                className={inputCls}
                value={item.value}
                onChange={(e) => {
                  const updated = [...enTranslation.featureList];
                  updated[idx].value = e.target.value;
                  setEnTranslation({ ...enTranslation, featureList: updated });
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const updated = enTranslation.featureList.filter((_, i) => i !== idx);
                  setEnTranslation({ ...enTranslation, featureList: updated });
                }}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
                title="Xóa tính năng này"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Detailed Content EN */}
        <div className="space-y-2 pt-2">
          <label className={labelCls}>Bài viết mô tả chi tiết (Tiếng Anh)</label>
          <RichTextEditor
            value={enTranslation.contentDetail}
            onChange={(val) => setEnTranslation({ ...enTranslation, contentDetail: val })}
            placeholder="Nhập nội dung giới thiệu chi tiết sản phẩm bằng Tiếng Anh..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        {isEdit ? (
          <>
            {isDirty && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy thay đổi
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Lưu bản dịch Tiếng Anh
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onSwitchToViTab}
            className="flex items-center gap-2 px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            Xác nhận & Quay lại Tab Tiếng Việt để Tạo mới
          </button>
        )}
      </div>
    </div>
  );
}
