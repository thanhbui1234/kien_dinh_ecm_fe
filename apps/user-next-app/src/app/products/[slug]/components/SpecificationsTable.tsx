'use client';

interface SpecificationsTableProps {
  specs: object;
}

export default function SpecificationsTable({ specs }: SpecificationsTableProps) {
  const entries = Object.entries(specs).filter(([, v]) => v !== null && v !== undefined && v !== '');
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {entries.map(([key, value], i) => (
        <div 
          key={key} 
          className={`flex items-start gap-4 px-4 py-3 border-b border-gray-100 last:border-0 ${
            i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
          }`}
        >
          <span className="w-2/5 shrink-0 text-[13px] text-gray-500 font-medium">
            {key}
          </span>
          <span className="w-3/5 text-[13px] text-gray-900 font-medium leading-relaxed">
            {String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}
