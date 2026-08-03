import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { toast } from '@/utils/toast';
import { useSaveProductTranslation } from '@/queries/products';
import { ENV } from '@/config/env';
import { translateViToEnglish } from '@/utils/ai';
import { TranslationSectionHeader } from '@/components/common/TranslationSectionHeader';
import { TranslationSectionFooter } from '@/components/common/TranslationSectionFooter';

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
  onSwitchToViTab,
  hasExistingEnTranslation = false,
}: ProductEnglishTranslationSectionProps) {
  const saveMutation = useSaveProductTranslation();
  const [isTranslatingAi, setIsTranslatingAi] = useState(false);
  const [initialData, setInitialData] = useState<ProductEnTranslationState | null>(null);

  // Set initial data baseline once loaded
  useEffect(() => {
    if (initialData === null) {
      setInitialData(enTranslation);
    }
  }, [enTranslation, initialData]);

  const checkIsDirty = () => {
    if (!initialData) return false;
    const normalize = (state: ProductEnTranslationState) => ({
      name: state.name.trim(),
      contentDetail: state.contentDetail?.trim() || '',
      specList: state.specList
        .filter(s => s.key.trim() || s.value.trim())
        .sort((a, b) => a.key.localeCompare(b.key)),
      featureList: state.featureList
        .filter(f => f.key.trim() || f.value.trim())
        .sort((a, b) => a.key.localeCompare(b.key)),
    });
    return JSON.stringify(normalize(enTranslation)) !== JSON.stringify(normalize(initialData));
  };

  const isDirty = checkIsDirty();

  const handleReset = () => {
    if (initialData) {
      setEnTranslation(initialData);
      toast.info('Đã khôi phục dữ liệu bản dịch về ban đầu.');
    }
  };

  const enSpecsCount = enTranslation.specList.filter(s => s.key.trim() || s.value.trim()).length;
  const enFeaturesCount = enTranslation.featureList.filter(f => f.key.trim() || f.value.trim()).length;

  const missingFields = [];
  if (viName?.trim() && !enTranslation.name.trim()) missingFields.push('Tên sản phẩm');
  if (viContentDetail?.trim() && !enTranslation.contentDetail.trim()) missingFields.push('Bài viết mô tả');
  if (viSpecsCount > 0 && enSpecsCount < viSpecsCount) missingFields.push(`Thông số kỹ thuật (${enSpecsCount}/${viSpecsCount})`);
  if (viFeaturesCount > 0 && enFeaturesCount < viFeaturesCount) missingFields.push(`Tính năng nổi bật (${enFeaturesCount}/${viFeaturesCount})`);

  const handleAiTranslate = async () => {
    const apiKey = ENV.GEMINI_API_KEY;
    if (!apiKey) {
      toast.error(null, 'Chưa cấu hình VITE_GEMINI_API_KEY trong file .env.local!');
      return;
    }

    try {
      setIsTranslatingAi(true);
      toast.info('AI đang dịch các trường còn thiếu sang Tiếng Anh...');
      
      const needsName = viName?.trim() && !enTranslation.name.trim();
      const needsContent = viContentDetail?.trim() && !enTranslation.contentDetail.trim();
      
      const specsToTranslate = viSpecList.filter((_, idx) => {
        const enItem = enTranslation.specList[idx];
        return !enItem || (!enItem.key.trim() && !enItem.value.trim());
      });
      
      const featuresToTranslate = viFeatureList.filter((_, idx) => {
        const enItem = enTranslation.featureList[idx];
        return !enItem || (!enItem.key.trim() && !enItem.value.trim());
      });

      const res = await translateViToEnglish(apiKey, {
        name: needsName ? viName : '',
        contentDetail: needsContent ? viContentDetail : '',
        specs: specsToTranslate,
        features: featuresToTranslate,
      });

      const newSpecs = [...enTranslation.specList];
      let specResultIdx = 0;
      viSpecList.forEach((_, idx) => {
        const enItem = enTranslation.specList[idx];
        if (!enItem || (!enItem.key.trim() && !enItem.value.trim())) {
           if (res.specs && res.specs[specResultIdx]) {
              newSpecs[idx] = res.specs[specResultIdx];
              specResultIdx++;
           }
        }
      });
      while (specResultIdx < (res.specs?.length || 0)) {
        newSpecs.push(res.specs[specResultIdx]);
        specResultIdx++;
      }

      const newFeatures = [...enTranslation.featureList];
      let featResultIdx = 0;
      viFeatureList.forEach((_, idx) => {
        const enItem = enTranslation.featureList[idx];
        if (!enItem || (!enItem.key.trim() && !enItem.value.trim())) {
           if (res.features && res.features[featResultIdx]) {
              newFeatures[idx] = res.features[featResultIdx];
              featResultIdx++;
           }
        }
      });
      while (featResultIdx < (res.features?.length || 0)) {
        newFeatures.push(res.features[featResultIdx]);
        featResultIdx++;
      }

      setEnTranslation({
        name: needsName ? (res.name || enTranslation.name) : enTranslation.name,
        slug: enTranslation.slug,
        contentDetail: needsContent ? (res.contentDetail || enTranslation.contentDetail) : enTranslation.contentDetail,
        specList: newSpecs.length > 0 ? newSpecs : enTranslation.specList,
        featureList: newFeatures.length > 0 ? newFeatures : enTranslation.featureList,
      });

      toast.success('Dịch tự động các trường còn thiếu sang Tiếng Anh thành công!');
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

    saveMutation.mutate(
      {
        productId: productId!,
        lang: 'EN',
        name: enTranslation.name.trim(),
        contentDetail: enTranslation.contentDetail || undefined,
        specifications: Object.keys(specsObj).length > 0 ? specsObj : undefined,
        features: Object.keys(featuresObj).length > 0 ? featuresObj : undefined,
      },
      {
        onSuccess: () => {
          const filteredSpecs = enTranslation.specList.filter(s => s.key.trim() || s.value.trim());
          const filteredFeatures = enTranslation.featureList.filter(f => f.key.trim() || f.value.trim());
          const newSavedState = {
            name: enTranslation.name.trim(),
            slug: enTranslation.slug || '',
            contentDetail: enTranslation.contentDetail || '',
            specList: filteredSpecs.length ? filteredSpecs : [{ key: '', value: '' }],
            featureList: filteredFeatures.length ? filteredFeatures : [{ key: '', value: '' }],
          };
          setInitialData(newSavedState);
          setEnTranslation(newSavedState);
          toast.success('Lưu bản dịch Tiếng Anh sản phẩm thành công!');
        },
        onError: () => {
          toast.error(null, 'Lưu bản dịch Tiếng Anh thất bại, vui lòng thử lại');
        },
      }
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6 animate-in fade-in duration-150">
      <TranslationSectionHeader
        title="Bản dịch Tiếng Anh (English Product Translation)"
        missingFields={missingFields}
        isTranslatingAi={isTranslatingAi}
        onAiTranslate={handleAiTranslate}
        disableAiButton={isTranslatingAi || missingFields.length === 0 || isDirty || hasExistingEnTranslation}
      />

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


      <TranslationSectionFooter
        isEdit={isEdit}
        isDirty={isDirty}
        isSaving={saveMutation.isPending}
        onReset={handleReset}
        onSave={handleSave}
        onSwitchToViTab={onSwitchToViTab}
      />
    </div>
  );
}

