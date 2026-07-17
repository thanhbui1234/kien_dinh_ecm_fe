import { useState } from 'react';
import { Loader2, Plus, Globe, MapPin, Factory } from 'lucide-react';
import { useFacilities, useUpdateFacility, useDeleteFacility } from '@/queries/about';
import { FacilityCard } from './FacilityCard';
import { AddFacilityForm } from './AddFacilityForm';
import { btnPrimary } from '@/utils/admin-styles';
import type { Facility } from '@/types/about';

export function FacilitiesTab() {
  const { data: facilities, isLoading } = useFacilities();
  const updateMutation = useUpdateFacility();
  const deleteMutation = useDeleteFacility();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleDelete = (id: string) => {
    if (window.confirm('Xóa cơ sở này?')) deleteMutation.mutate(id);
  };

  const grouped = (facilities ?? []).reduce<Record<string, Record<string, Facility[]>>>(
    (acc, f) => {
      if (!acc[f.region]) acc[f.region] = {};
      if (!acc[f.region][f.country]) acc[f.region][f.country] = [];
      acc[f.region][f.country].push(f);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-black">
            {facilities?.length ?? 0} cơ sở sản xuất
          </p>
          <p className="text-xs text-gray-500">Quản lý toàn bộ cơ sở trên thế giới</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className={btnPrimary}
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm cơ sở
        </button>
      </div>

      {showAddForm && (
        <AddFacilityForm
          onClose={() => setShowAddForm(false)}
          orderIndex={facilities?.length ?? 0}
        />
      )}

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {!isLoading && !facilities?.length && !showAddForm && (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border-2 border-dashed border-gray-200">
          <Factory className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-500">Chưa có cơ sở nào</p>
          <p className="text-xs text-gray-400 mt-1">Bấm "Thêm cơ sở" để bắt đầu</p>
        </div>
      )}

      {!isLoading &&
        Object.entries(grouped).map(([region, countries]) => (
          <div
            key={region}
            className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
          >
            <div className="px-6 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <h2 className="text-xs font-bold text-black uppercase tracking-wider">{region}</h2>
            </div>

            <div className="p-6 space-y-6">
              {Object.entries(countries).map(([country, items]) => (
                <div key={country}>
                  <p className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    {country}
                    <span className="ml-1 px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-500 normal-case tracking-normal font-normal">
                      {items.length} cơ sở
                    </span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((facility) => (
                      <FacilityCard
                        key={facility.id}
                        facility={facility}
                        onUpdate={(id, data) => updateMutation.mutate({ id, data })}
                        onDelete={handleDelete}
                        isDeleting={deleteMutation.isPending}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
