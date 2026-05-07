import React from 'react';

interface WeightLogFormProps {
  logDate: string;
  setLogDate: (val: string) => void;
  logTime: string;
  setLogTime: (val: string) => void;
  weightValue: string;
  setWeightValue: (val: string) => void;
  weightLogMessage: string;
  handleWeightLog: (e: React.FormEvent) => void;
  handleSetCurrentTime: () => void;
}

export default function WeightLogForm({
  logDate, setLogDate, logTime, setLogTime, weightValue, setWeightValue,
  weightLogMessage, handleWeightLog, handleSetCurrentTime
}: WeightLogFormProps) {
  return (
    <div className="mb-8 p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-[#4A3A33] font-['Montserrat']">Log Weight</h2>
      <form onSubmit={handleWeightLog} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-bold text-[#4A3A33] mb-3">Date</label>
          <input
            type="date"
            required
            value={logDate}
            onChange={(e) => setLogDate(e.target.value)}
            className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-2 sm:p-4 text-sm sm:text-base text-[#4A3A33] transition-all"
          />
        </div>
        <div>
          <label className="block text-base font-bold text-[#4A3A33] mb-3">Time of Measurement</label>
          <div className="flex gap-2">
            <input
              type="time"
              required
              value={logTime}
              onChange={(e) => setLogTime(e.target.value)}
              className="block flex-1 min-w-0 rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] transition-all"
            />
            <button
              type="button"
              onClick={handleSetCurrentTime}
              className="shrink-0 text-sm text-[#8AAB88] hover:text-[#4A3A33] font-bold px-4 py-2 rounded-xl border-2 border-[#8AAB88]/30 hover:bg-[#8AAB88]/10 transition-all"
            >
              Now
            </button>
          </div>
        </div>
        <div>
          <label className="block text-base font-bold text-[#4A3A33] mb-3">Weight (kg)</label>
          <input
            type="number"
            required
            placeholder="e.g. 70"
            value={weightValue}
            onChange={(e) => setWeightValue(e.target.value)}
            className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-lg text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
          />
        </div>
        <button type="submit" className="md:col-span-2 mt-2 w-full py-4 px-8 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-[#4A3A33] to-[#5e4d44] hover:from-[#3a2e28] hover:to-[#4A3A33] focus:outline-none focus:ring-4 focus:ring-[#4A3A33]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
          Log Weight
        </button>
      </form>
      {weightLogMessage && <p className="mt-4 text-base text-[#8AAB88] font-bold">{weightLogMessage}</p>}
    </div>
  );
}