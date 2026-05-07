import React from 'react';
import Image from 'next/image';

interface HypertensionFormProps {
  logDate: string;
  setLogDate: (val: string) => void;
  logTime: string;
  setLogTime: (val: string) => void;
  readingSite: string;
  setReadingSite: (val: string) => void;
  systolic: string;
  setSystolic: (val: string) => void;
  diastolic: string;
  setDiastolic: (val: string) => void;
  pulse: string;
  setPulse: (val: string) => void;
  hypertensionLogMessage: string;
  handleHypertensionLog: (e: React.FormEvent) => void;
  handleSetCurrentTime: () => void;
}

export default function HypertensionForm({
  logDate, setLogDate, logTime, setLogTime, readingSite, setReadingSite,
  systolic, setSystolic, diastolic, setDiastolic, pulse, setPulse,
  hypertensionLogMessage, handleHypertensionLog, handleSetCurrentTime
}: HypertensionFormProps) {
  return (
    <div className="mb-8 p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-[#4A3A33] font-['Montserrat']">Log Blood Pressure Reading</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleHypertensionLog} className="space-y-6">
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
            <label className="block text-base font-bold text-[#4A3A33] mb-3">Time of Reading</label>
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
            <label className="block text-base font-bold text-[#4A3A33] mb-3">Reading Site</label>
            <select
              value={readingSite}
              onChange={(e) => setReadingSite(e.target.value)}
              className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] transition-all cursor-pointer"
            >
              <option value="left_arm">Left Arm</option>
              <option value="right_arm">Right Arm</option>
              <option value="left_wrist">Left Wrist</option>
              <option value="right_wrist">Right Wrist</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-bold text-[#4A3A33] mb-3">Systolic (Top Number)</label>
            <input
              type="number"
              required
              placeholder="e.g. 120"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-lg text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
            />
          </div>
          <div>
            <label className="block text-base font-bold text-[#4A3A33] mb-3">Diastolic (Bottom Number)</label>
            <input
              type="number"
              required
              placeholder="e.g. 80"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-lg text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
            />
          </div>
          <div>
            <label className="block text-base font-bold text-[#4A3A33] mb-3">Pulse (BPM)</label>
            <input
              type="number"
              required
              placeholder="e.g. 70"
              value={pulse}
              onChange={(e) => setPulse(e.target.value)}
              className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-lg text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
            />
          </div>
          <button type="submit" className="w-full py-4 px-8 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-[#4A3A33] to-[#5e4d44] hover:from-[#3a2e28] hover:to-[#4A3A33] focus:outline-none focus:ring-4 focus:ring-[#4A3A33]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
            Log BP Reading
          </button>
          {hypertensionLogMessage && <p className="text-base text-[#8AAB88] font-bold mt-2">{hypertensionLogMessage}</p>}
        </form>
        <div className="bg-gradient-to-br from-[#EFE7DD]/40 to-[#f7f2ea]/20 p-6 rounded-xl border-2 border-[#D9A68A]/20">
          <h3 className="text-xl font-bold text-[#4A3A33] font-['Montserrat'] mb-5">How to Measure Your Blood Pressure Correctly</h3>
          <p className="text-base text-[#4A3A33] font-semibold mb-5">Follow these steps from the American Heart Association:</p>
          <ul className="space-y-4 text-base text-[#4A3A33] leading-relaxed">
            <li className="flex gap-3"><span className="text-[#8AAB88] font-bold text-xl">•</span><span><strong className="text-[#4A3A33] font-bold">Be still.</strong> Don't smoke, drink caffeinated beverages or exercise within 30 minutes before measuring your blood pressure. Empty your bladder and ensure at least 5 minutes of quiet rest before measurements.</span></li>
            <li className="flex gap-3"><span className="text-[#8AAB88] font-bold text-xl">•</span><span><strong className="text-[#4A3A33] font-bold">Sit correctly.</strong> Sit with your back straight and supported (on a dining chair, rather than a sofa). Your feet should be flat on the floor and your legs should not be crossed. Your arm should be supported on a flat surface (such as a table) with the upper arm at heart level.</span></li>
            <li className="flex gap-3"><span className="text-[#8AAB88] font-bold text-xl">•</span><span><strong className="text-[#4A3A33] font-bold">Measure on a bare arm.</strong> Roll up your sleeve. The cuff should be placed on a bare arm.</span></li>
            <li className="flex gap-3"><span className="text-[#8AAB88] font-bold text-xl">•</span><span><strong className="text-[#4A3A33] font-bold">Take multiple readings.</strong> Take at least two readings one minute apart and record both results.</span></li>
          </ul>
          <div className="mt-6 p-4 rounded-xl bg-white border border-[#D9A68A]/20">
            <h4 className="font-semibold text-[#4A3A33] mb-3 text-sm">Correct Posture Diagram</h4>
            <Image src="/bp_posture.jpg" alt="Correct posture for blood pressure measurement" width={500} height={300} style={{ objectFit: 'contain' }} />
          </div>
        </div>
      </div>
    </div>
  );
}