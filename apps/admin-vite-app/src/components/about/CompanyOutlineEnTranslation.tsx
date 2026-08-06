import { useState, useEffect } from 'react';
import { Globe, Loader2, Save, X } from 'lucide-react';
import { SettingHtmlItem } from '@/components/common/SettingHtmlItem';
import { useSaveProfileTranslation, useSaveCompanyInfoTranslation } from '@/queries/about';
import { useCompanyInfo } from '@/queries/about';
import { inputCls, labelCls } from '@/utils/admin-styles';
import type { CompanyInfoItem } from '@/types/about';

// ─── Profile introHtml EN translation ────────────────────────────────────────

interface ProfileEnTranslationProps {
  viIntroHtml: string;
  enIntroHtml: string;
  isSaving?: boolean;
}

export function ProfileEnTranslationSection({ viIntroHtml, enIntroHtml, isSaving: _isSaving }: ProfileEnTranslationProps) {
  const saveMutation = useSaveProfileTranslation();
  const [enIntroHtmlState, setEnIntroHtmlState] = useState(enIntroHtml);

  useEffect(() => {
    setEnIntroHtmlState(enIntroHtml);
  }, [enIntroHtml]);

  const isEnDirty = enIntroHtmlState !== enIntroHtml;

  const handleSave = () => {
    if (!enIntroHtmlState.trim()) return;
    saveMutation.mutate({ lang: 'EN', introHtml: enIntroHtmlState });
  };

  return (
    <div className="rounded-lg border border-purple-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold text-gray-900">GIỚI THIỆU CÔNG TY (Tiếng Anh)</h2>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saveMutation.isPending || !enIntroHtmlState.trim() || !isEnDirty}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-md disabled:opacity-50 transition-colors cursor-pointer"
        >
          {saveMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Lưu bản dịch
        </button>
      </div>
      <SettingHtmlItem
        setting={{ key: 'ABOUT_INTRO_HTML_EN', value: enIntroHtmlState }}
        onSave={(val) => setEnIntroHtmlState(val)}
        isSaving={saveMutation.isPending}
      />
    </div>
  );
}

// ─── CompanyInfo EN translation (per-row inline) ──────────────────────────────

interface CompanyInfoEnTranslationSectionProps {
  enItems: CompanyInfoItem[];
}

export function CompanyInfoEnTranslationSection({ enItems }: CompanyInfoEnTranslationSectionProps) {
  const { data: items, isLoading } = useCompanyInfo();
  const saveMutation = useSaveCompanyInfoTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [enLabel, setEnLabel] = useState('');
  const [enValue, setEnValue] = useState('');

  const handleStartEdit = (id: string) => {
    const existing = enItems.find((e) => e.id === id);
    setEditingId(id);
    setEnLabel(existing?.label ?? '');
    setEnValue(existing?.value ?? '');
  };

  const handleSave = (id: string, viLabel: string) => {
    saveMutation.mutate(
      { id, data: { lang: 'EN', label: enLabel || viLabel, value: enValue } },
      { onSuccess: () => setEditingId(null) }
    );
  };

  if (isLoading) return (
    <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
  );

  if (!items?.length) return null;

  return (
    <div className="rounded-lg border border-purple-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-3.5 bg-purple-50 border-b border-purple-100">
        <Globe className="h-4 w-4 text-purple-600" />
        <h2 className="text-sm font-bold text-purple-900">THÔNG TIN CÔNG TY (Tiếng Anh)</h2>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="py-2.5 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-2/5">Nhãn (VI)</th>
            <th className="py-2.5 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Giá trị (VI)</th>
            <th className="py-2.5 px-4 text-[10px] font-bold text-purple-500 uppercase tracking-wider">Nhãn (EN)</th>
            <th className="py-2.5 px-4 text-[10px] font-bold text-purple-500 uppercase tracking-wider">Giá trị (EN)</th>
            <th className="py-2.5 px-4 w-20" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const enItem = enItems.find((e) => e.id === item.id);
            return editingId === item.id ? (
              <tr key={item.id} className="border-b border-gray-100 bg-purple-50/40">
                <td className="py-2 px-4 text-xs text-gray-500">{item.label}</td>
                <td className="py-2 px-4 text-xs text-gray-500">{item.value}</td>
                <td className="py-2 px-4">
                  <input
                    autoFocus
                    value={enLabel}
                    onChange={(e) => setEnLabel(e.target.value)}
                    className={inputCls}
                    placeholder="Label in English..."
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    value={enValue}
                    onChange={(e) => setEnValue(e.target.value)}
                    className={inputCls}
                    placeholder="Value in English..."
                  />
                </td>
                <td className="py-2 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer">
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave(item.id, item.label)}
                      disabled={!enValue.trim() || saveMutation.isPending}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {saveMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Lưu'}
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={item.id} className="border-b border-gray-100 group hover:bg-gray-50 transition-colors">
                <td className="py-2.5 px-4 text-xs font-semibold text-gray-700">{item.label}</td>
                <td className="py-2.5 px-4 text-xs text-gray-600">{item.value}</td>
                {enItem ? (
                  <>
                    <td className="py-2.5 px-4 text-xs text-purple-700 font-medium">{enItem.label}</td>
                    <td className="py-2.5 px-4 text-xs text-purple-600">{enItem.value}</td>
                  </>
                ) : (
                  <td colSpan={2} className="py-2.5 px-4">
                    <span className="text-[10px] text-amber-500 font-medium">Chưa có bản dịch EN</span>
                  </td>
                )}
                <td className="py-2.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item.id)}
                    className="text-xs text-purple-500 hover:text-purple-700 font-medium hover:underline cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {enItem ? 'Sửa' : '+ Thêm'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
