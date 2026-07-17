import { useState } from 'react';
import { Building2, History, Factory, Images, Megaphone } from 'lucide-react';
import { CompanyOutlineTab } from '@/components/about/CompanyOutlineTab';
import { TimelineSection } from '@/components/about/TimelineSection';
import { FacilitiesTab } from '@/components/about/FacilitiesTab';
import { BannerSection } from '@/components/about/BannerSection';
import { SloganSection } from '@/components/about/SloganSection';

type Tab = 'outline' | 'history' | 'banners' | 'slogans' | 'facilities';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'outline', label: 'Sơ lược công ty', icon: Building2 },
  { id: 'history', label: 'Lịch sử phát triển', icon: History },
  { id: 'banners', label: 'Banner trang chủ', icon: Images },
  { id: 'slogans', label: 'Slogan', icon: Megaphone },
  { id: 'facilities', label: 'Cơ sở sản xuất', icon: Factory },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<Tab>('outline');

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div>
        <h1 className="text-xl font-bold text-black">Về doanh nghiệp</h1>
        <p className="text-xs font-medium text-gray-500 mt-0.5">
          Quản lý thông tin giới thiệu, lịch sử, banner, slogan và cơ sở sản xuất hiển thị trên website
        </p>
      </div>

      <div className="flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
              activeTab === id
                ? 'bg-white text-black shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-black hover:bg-white/60'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'outline' && <CompanyOutlineTab />}
      {activeTab === 'history' && <TimelineSection />}
      {activeTab === 'banners' && <BannerSection />}
      {activeTab === 'slogans' && <SloganSection />}
      {activeTab === 'facilities' && <FacilitiesTab />}
    </div>
  );
}
