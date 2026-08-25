import { useEffect, useMemo, useRef, useState } from 'react';

interface Patient {
  uid: string;
  email: string;
  fullName: string;
}

interface PatientSearchSelectProps {
  patients: Patient[];
  alertPatientIds?: Set<string>;
  onSelect: (patientId: string) => void;
  placeholder?: string;
}

export default function PatientSearchSelect({
  patients,
  alertPatientIds,
  onSelect,
  placeholder = 'Search patients by name or email...',
}: PatientSearchSelectProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPatients = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter(p =>
      (p.fullName || '').toLowerCase().includes(term) ||
      (p.email || '').toLowerCase().includes(term)
    );
  }, [patients, query]);

  const handleSelect = (patient: Patient) => {
    onSelect(patient.uid);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg className="w-5 h-5 text-[#4A3A33]/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 py-3 sm:py-4 pl-11 pr-4 text-base text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
        />
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full max-h-80 overflow-y-auto bg-white rounded-xl shadow-lg border-2 border-[#D9A68A]/20">
          {patients.length === 0 ? (
            <p className="p-4 text-sm text-[#4A3A33]/60">No patients registered yet.</p>
          ) : filteredPatients.length === 0 ? (
            <p className="p-4 text-sm text-[#4A3A33]/60">No patients match &quot;{query}&quot;.</p>
          ) : (
            filteredPatients.map((p) => (
              <button
                key={p.uid}
                type="button"
                onClick={() => handleSelect(p)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#EFE7DD]/40 transition-all border-b border-[#D9A68A]/10 last:border-b-0"
              >
                <span className="min-w-0">
                  <span className="block font-semibold text-[#4A3A33] truncate">{p.fullName || p.email}</span>
                  {p.fullName && <span className="block text-sm text-[#4A3A33]/60 truncate">{p.email}</span>}
                </span>
                {alertPatientIds?.has(p.uid) && (
                  <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-red-500" title="Has a flagged reading" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
