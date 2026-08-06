import { useState } from 'react';
import { Phone, AlignLeft, MessageSquareQuote, Settings2 } from 'lucide-react';
import { ContactSettingForm } from './ContactSettingForm';
import { FooterSettingForm } from './FooterSettingForm';
import { SloganSection } from '@/components/settings/SloganSection';
import { SystemSettingsSection } from './SystemSettingsSection';

type Tab = 'contact' | 'footer' | 'slogans' | 'system';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'contact', label: 'Thông tin liên hệ', icon: Phone },
  { id: 'footer', label: 'Footer (Chân trang)', icon: AlignLeft },
  // { id: 'system', label: 'Cài đặt hệ thống', icon: Settings2 },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('contact');

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      <div>
        <h1 className="text-xl font-bold text-black">Cài đặt</h1>
        <p className="text-xs font-medium text-gray-500 mt-0.5">Quản lý cấu hình chung cho website</p>
      </div>

      <div className="flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${activeTab === id
              ? 'bg-white text-black shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-black hover:bg-white/60'
              }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'contact' && <ContactSettingForm />}
      {activeTab === 'footer' && <FooterSettingForm />}
      {activeTab === 'slogans' && <SloganSection />}
      {activeTab === 'system' && <SystemSettingsSection />}
    </div>
  );
}
