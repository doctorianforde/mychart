import { getFlagClasses } from '@/src/lib/flagStyles';

interface RecordsListProps {
  records: any[];
  onDelete?: (recordId: string, recordType: string) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export default function RecordsList({
  records,
  onDelete,
  emptyTitle = 'No records found.',
  emptySubtitle = 'Health readings will appear here once logged.',
}: RecordsListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-[#EFE7DD]/40 to-[#f7f2ea]/20 rounded-xl border-2 border-dashed border-[#D9A68A]/40">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 bg-[#D9A68A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#D9A68A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-[#4A3A33]/70 font-medium">{emptyTitle}</p>
          <p className="text-sm text-[#4A3A33]/50 mt-1">{emptySubtitle}</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {records.map((r) => {
        const flagClasses = getFlagClasses(r.flag);
        return (
          <li key={r.id} className="p-4 sm:p-6 bg-gradient-to-br from-white to-[#EFE7DD]/10 rounded-xl border-2 border-[#D9A68A]/20 hover:border-[#8AAB88] hover:shadow-md transition-all duration-200 text-[#4A3A33]">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="font-bold text-lg sm:text-xl">{r.subType || r.type}</span>
                  {r.flag && r.flag !== 'Normal' && (
                    <span className={`text-xs sm:text-sm font-bold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-sm whitespace-nowrap ${flagClasses}`}>
                      {r.flag}
                    </span>
                  )}
                </div>
                <span className="text-sm sm:text-base text-[#4A3A33]/70 block font-medium">{new Date(r.readingTime || r.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-left sm:text-right">
                  {r.type === 'Hypertension Log' ? (
                    <>
                      <span className="text-2xl sm:text-3xl font-bold block text-[#4A3A33]">
                        {r.value.systolic}/{r.value.diastolic}
                        <span className="text-sm sm:text-base font-normal ml-2 text-[#4A3A33]/60">{r.unit}</span>
                      </span>
                      <span className="text-sm sm:text-base text-[#4A3A33]/70 mt-1 sm:mt-2 block font-medium">Pulse: {r.value.pulse} bpm</span>
                    </>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-bold block text-[#4A3A33]">
                      {r.value}
                      <span className="text-sm sm:text-base font-normal ml-2 text-[#4A3A33]/60">{r.unit}</span>
                    </span>
                  )}
                </div>
                {onDelete && (
                  <button
                    onClick={() => onDelete(r.id, r.type)}
                    className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all shadow-sm"
                    title="Delete record"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
