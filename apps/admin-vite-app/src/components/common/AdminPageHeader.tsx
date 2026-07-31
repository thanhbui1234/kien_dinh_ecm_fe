import * as React from 'react';
import { ChevronLeft, ExternalLink } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  clientUrl?: string;
  actions?: React.ReactNode;
}

export function AdminPageHeader({ title, subtitle, onBack, clientUrl, actions }: AdminPageHeaderProps) {
  const fullClientUrl = clientUrl
    ? clientUrl.startsWith('http')
      ? clientUrl
      : `http://localhost:3000${clientUrl.startsWith('/') ? clientUrl : `/${clientUrl}`}`
    : undefined;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
          aria-label="Quay lại"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-black">{title}</h1>
          {subtitle && <p className="text-xs font-medium text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {fullClientUrl && (
          <a
            href={fullClientUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 h-9 px-3 rounded-md bg-gray-100 text-gray-800 text-xs font-bold shadow-sm hover:bg-gray-200 transition-colors border border-gray-200 no-underline"
          >
            <ExternalLink className="h-3.5 w-3.5 text-blue-600" /> Xem trên Website
          </a>
        )}
        {actions}
      </div>
    </div>
  );
}
