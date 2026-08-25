import { useMemo } from 'react';
import { CRITICAL_FLAGS, WARNING_FLAGS } from '@/src/lib/flagStyles';

interface Patient {
  uid: string;
  email: string;
  fullName: string;
}

interface PatientAlertsPanelProps {
  alertRecords: any[];
  patientList: Patient[];
  onSelectPatient: (patientId: string) => void;
}

export default function PatientAlertsPanel({ alertRecords, patientList, onSelectPatient }: PatientAlertsPanelProps) {
  const patientsWithAlerts = useMemo(() => {
    const grouped: { [patientId: string]: { criticalCount: number; warningCount: number; latest: any } } = {};

    alertRecords.forEach((r) => {
      const patientId = r.patientId || r.patientEmail;
      if (!patientId) return;
      if (!grouped[patientId]) {
        grouped[patientId] = { criticalCount: 0, warningCount: 0, latest: r };
      }
      if (CRITICAL_FLAGS.includes(r.flag)) grouped[patientId].criticalCount += 1;
      else if (WARNING_FLAGS.includes(r.flag)) grouped[patientId].warningCount += 1;

      const currentLatest = new Date(grouped[patientId].latest.readingTime || grouped[patientId].latest.createdAt).getTime();
      const candidate = new Date(r.readingTime || r.createdAt).getTime();
      if (candidate > currentLatest) grouped[patientId].latest = r;
    });

    return Object.entries(grouped)
      .map(([patientId, data]) => {
        const matchedPatient = patientList.find((p) => p.uid === patientId || p.email === data.latest.patientEmail);
        const name = data.latest.patientName || matchedPatient?.fullName || 'Unknown Patient';
        return { patientId, name, email: data.latest.patientEmail, ...data };
      })
      .sort((a, b) => (b.criticalCount - a.criticalCount) || (b.warningCount - a.warningCount));
  }, [alertRecords, patientList]);

  if (patientsWithAlerts.length === 0) return null;

  return (
    <div className="mb-4 p-4 sm:p-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200">
      <h3 className="text-base font-bold text-[#4A3A33] mb-3 flex items-center gap-2">
        <span aria-hidden>⚠️</span> {patientsWithAlerts.length} patient{patientsWithAlerts.length !== 1 ? 's' : ''} need attention
      </h3>
      <div className="flex flex-wrap gap-2">
        {patientsWithAlerts.map(({ patientId, name, email, criticalCount, warningCount }) => (
          <button
            key={patientId}
            type="button"
            onClick={() => onSelectPatient(patientId)}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-red-200 hover:shadow-md transition-all text-left"
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
          </button>
        ))}
      </div>
    </div>
  );
}
