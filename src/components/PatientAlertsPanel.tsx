import { useMemo, useState } from 'react';
import { CRITICAL_FLAGS, WARNING_FLAGS } from '@/src/lib/flagStyles';

interface Patient {
  uid: string;
  email: string;
  fullName: string;
}

interface AlertGroup {
  patientId: string;
  name: string;
  email: string;
  criticalCount: number;
  warningCount: number;
  recordIds: string[];
}

interface PatientAlertsPanelProps {
  alertRecords: any[];
  patientList: Patient[];
  onSelectPatient: (patientId: string) => void;
  onToggleArchive: (recordIds: string[], archived: boolean) => void;
}

function groupByPatient(records: any[], patientList: Patient[]): AlertGroup[] {
  const grouped: { [patientId: string]: { criticalCount: number; warningCount: number; recordIds: string[]; latest: any } } = {};

  records.forEach((r) => {
    const patientId = r.patientId || r.patientEmail;
    if (!patientId) return;
    if (!grouped[patientId]) {
      grouped[patientId] = { criticalCount: 0, warningCount: 0, recordIds: [], latest: r };
    }
    if (CRITICAL_FLAGS.includes(r.flag)) grouped[patientId].criticalCount += 1;
    else if (WARNING_FLAGS.includes(r.flag)) grouped[patientId].warningCount += 1;
    grouped[patientId].recordIds.push(r.id);

    const currentLatest = new Date(grouped[patientId].latest.readingTime || grouped[patientId].latest.createdAt).getTime();
    const candidate = new Date(r.readingTime || r.createdAt).getTime();
    if (candidate > currentLatest) grouped[patientId].latest = r;
  });

  return Object.entries(grouped)
    .map(([patientId, data]) => {
      const matchedPatient = patientList.find((p) => p.uid === patientId || p.email === data.latest.patientEmail);
      const name = data.latest.patientName || matchedPatient?.fullName || 'Unknown Patient';
      return { patientId, name, email: data.latest.patientEmail, criticalCount: data.criticalCount, warningCount: data.warningCount, recordIds: data.recordIds };
    })
    .sort((a, b) => (b.criticalCount - a.criticalCount) || (b.warningCount - a.warningCount));
}

export default function PatientAlertsPanel({ alertRecords, patientList, onSelectPatient, onToggleArchive }: PatientAlertsPanelProps) {
  const [showArchived, setShowArchived] = useState(false);

  const activeGroups = useMemo(
    () => groupByPatient(alertRecords.filter((r) => !r.alertArchived), patientList),
    [alertRecords, patientList]
  );
  const archivedGroups = useMemo(
    () => groupByPatient(alertRecords.filter((r) => r.alertArchived), patientList),
    [alertRecords, patientList]
  );

  if (activeGroups.length === 0 && archivedGroups.length === 0) return null;

  return (
    <div className="mb-4 space-y-3">
      {activeGroups.length > 0 && (
        <div className="p-4 sm:p-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200">
          <h3 className="text-base font-bold text-[#4A3A33] mb-3 flex items-center gap-2">
            <span aria-hidden>⚠️</span> {activeGroups.length} patient{activeGroups.length !== 1 ? 's' : ''} need attention
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeGroups.map(({ patientId, name, email, criticalCount, warningCount, recordIds }) => (
              <div
                key={patientId}
                role="button"
                tabIndex={0}
                onClick={() => onSelectPatient(patientId)}
                onKeyDown={(e) => { if (e.key === 'Enter') onSelectPatient(patientId); }}
                className="group relative flex items-center gap-2 pl-3 pr-7 py-2 bg-white rounded-xl border border-red-200 hover:shadow-md transition-all text-left cursor-pointer"
                title={email}
              >
                <span className="font-semibold text-sm text-[#4A3A33] truncate max-w-[10rem]">{name}</span>
                {criticalCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {criticalCount} Critical
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="px-2 py-0.5 bg-yellow-500 text-white text-[10px] font-bold rounded-full">
                    {warningCount} Warning
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onToggleArchive(recordIds, true); }}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-[#4A3A33]/40 hover:text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                  title="Archive this alert"
                  aria-label="Archive this alert"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {archivedGroups.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowArchived((v) => !v)}
            className="text-sm font-semibold text-[#4A3A33]/60 hover:text-[#4A3A33] transition-all"
          >
            {showArchived ? '▾' : '▸'} Archived Alerts ({archivedGroups.length})
          </button>
          {showArchived && (
            <div className="mt-3 p-4 sm:p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
              <div className="flex flex-wrap gap-2">
                {archivedGroups.map(({ patientId, name, email, criticalCount, warningCount, recordIds }) => (
                  <div
                    key={patientId}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 text-left opacity-75"
                    title={email}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectPatient(patientId)}
                      className="font-semibold text-sm text-[#4A3A33] truncate max-w-[10rem] hover:underline"
                    >
                      {name}
                    </button>
                    {criticalCount > 0 && (
                      <span className="px-2 py-0.5 bg-gray-400 text-white text-[10px] font-bold rounded-full">
                        {criticalCount} Critical
                      </span>
                    )}
                    {warningCount > 0 && (
                      <span className="px-2 py-0.5 bg-gray-400 text-white text-[10px] font-bold rounded-full">
                        {warningCount} Warning
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onToggleArchive(recordIds, false)}
                      className="text-xs font-semibold text-[#8AAB88] hover:text-[#4A3A33] transition-all"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
