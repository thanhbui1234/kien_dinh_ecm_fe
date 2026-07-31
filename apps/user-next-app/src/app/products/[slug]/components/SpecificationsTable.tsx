'use client';

interface SpecificationsTableProps {
  specs: object;
}

export default function SpecificationsTable({ specs }: SpecificationsTableProps) {
  const entries = Object.entries(specs).filter(([, v]) => v !== null && v !== undefined && v !== '');
  if (entries.length === 0) return null;

  const chunkSize = 4;
  const chunks: [string, unknown][][] = [];
  for (let i = 0; i < entries.length; i += chunkSize) {
    chunks.push(entries.slice(i, i + chunkSize));
  }

  return (
    <>
      {/* Mobile — stacked key-value rows */}
      <div className="md:hidden flex flex-col rounded-xl border border-gray-100 overflow-hidden bg-white">
        {entries.map(([key, value], i) => (
          <div
            key={key}
            className={`flex items-baseline justify-between gap-4 px-4 py-3 ${
              i % 2 === 1 ? 'bg-gray-50/60' : ''
            } ${i < entries.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 shrink-0">
              {key}
            </span>
            <span className="text-[13px] text-[#111] font-medium text-right">
              {String(value)}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop — 4-column chunked table */}
      <div className="hidden md:flex flex-col gap-0 rounded-xl border border-gray-100 overflow-hidden bg-white">
        {chunks.map((chunk, ci) => (
          <table key={ci} className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {chunk.map(([key]) => (
                  <th key={key} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 border-b border-gray-100 border-r last:border-r-0">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className={ci < chunks.length - 1 ? 'border-b border-gray-100' : ''}>
                {chunk.map(([key, value]) => (
                  <td key={key} className="px-4 py-3.5 text-[#111] font-medium border-r border-gray-50 last:border-r-0 align-top">
                    {String(value)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </>
  );
}
