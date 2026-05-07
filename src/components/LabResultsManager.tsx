import React from 'react';

interface LabResultsManagerProps {
  userData: any;
  user: any;
  labResults: any[];
  labFile: File | null;
  setLabFile: (file: File | null) => void;
  labDescription: string;
  setLabDescription: (desc: string) => void;
  labUploading: boolean;
  setLabUploading: (v: boolean) => void;
  labUploadProgress: number;
  setLabUploadProgress: (v: number) => void;
  labUploadMessage: string;
  setLabUploadMessage: (v: string) => void;
  patientList: any[];
  selectedUploadPatientId: string;
  setSelectedUploadPatientId: (id: string) => void;
  setSelectedUploadPatientEmail: (email: string) => void;
  setSelectedUploadPatientName: (name: string) => void;
  handleFileUpload: (
    e: React.FormEvent,
    collectionName: 'labResults' | 'referrals',
    file: File | null,
    description: string,
    setUploading: (v: boolean) => void,
    setProgress: (v: number) => void,
    setMessage: (v: string) => void,
    setFile: (v: File | null) => void,
    setDesc: (v: string) => void,
    currentList: any[],
    setList: (v: any[]) => void
  ) => void;
  handleFileDelete: (
    docId: string,
    filePath: string,
    collectionName: 'labResults' | 'referrals',
    currentList: any[],
    setList: (v: any[]) => void
  ) => void;
  setLabResults: (list: any[]) => void;
  validateFile: (file: File) => string | null;
}

export default function LabResultsManager({
  userData, user, labResults, labFile, setLabFile, labDescription, setLabDescription,
  labUploading, setLabUploading, labUploadProgress, setLabUploadProgress,
  labUploadMessage, setLabUploadMessage, patientList, selectedUploadPatientId,
  setSelectedUploadPatientId, setSelectedUploadPatientEmail, setSelectedUploadPatientName,
  handleFileUpload, handleFileDelete, setLabResults, validateFile
}: LabResultsManagerProps) {
  return (
    <div className="mb-8 p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-[#4A3A33] font-['Montserrat']">Lab Results</h2>

      <form
        onSubmit={(e) => handleFileUpload(e, 'labResults', labFile, labDescription, setLabUploading, setLabUploadProgress, setLabUploadMessage, setLabFile, setLabDescription, labResults, setLabResults)}
        className="space-y-6 mb-8"
      >
        {userData?.role === 'staff' && (
          <div>
            <label className="block text-base font-bold text-[#4A3A33] mb-3">Select Patient</label>
            <select
              required
              value={selectedUploadPatientId}
              onChange={(e) => {
                const selected = patientList.find(p => p.uid === e.target.value);
                setSelectedUploadPatientId(e.target.value);
                setSelectedUploadPatientEmail(selected?.email || '');
                setSelectedUploadPatientName(selected?.fullName || '');
              }}
              className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] transition-all cursor-pointer"
            >
              <option value="">-- Select a patient --</option>
              {patientList.map(p => (
                <option key={p.uid} value={p.uid}>
                  {p.fullName ? `${p.fullName} (${p.email})` : p.email}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-base font-bold text-[#4A3A33] mb-3">Upload Lab Result</label>
          <input
            type="file"
            data-upload="labResults"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (file) {
                const error = validateFile(file);
                if (error) {
                  alert(error);
                  e.target.value = '';
                  setLabFile(null);
                  return;
                }
              }
              setLabFile(file);
            }}
            className="block w-full text-base text-[#4A3A33] file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-base file:font-bold file:bg-[#EFE7DD] file:text-[#4A3A33] hover:file:bg-[#D9A68A]/30 file:transition-all file:cursor-pointer cursor-pointer"
          />
          <p className="text-xs text-[#4A3A33]/50 mt-1">Accepted: PDF, JPG, PNG, GIF, WebP, DOC, DOCX. Max size: 10MB</p>
        </div>

        <div>
          <label className="block text-base font-bold text-[#4A3A33] mb-3">Description (optional)</label>
          <input
            type="text"
            placeholder="e.g. Blood work results from Jan 2026"
            value={labDescription}
            onChange={(e) => setLabDescription(e.target.value)}
            className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
          />
        </div>

        {labUploading && (
          <div className="w-full bg-[#EFE7DD] rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[#8AAB88] to-[#7a9b78] h-3 rounded-full transition-all duration-300"
              style={{ width: `${labUploadProgress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={labUploading}
          className="w-full py-4 px-8 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-[#4A3A33] to-[#5e4d44] hover:from-[#3a2e28] hover:to-[#4A3A33] focus:outline-none focus:ring-4 focus:ring-[#4A3A33]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {labUploading ? `Uploading... ${labUploadProgress}%` : 'Upload Lab Result'}
        </button>

        {labUploadMessage && (
          <p className={`text-base font-bold ${labUploadMessage.includes('success') ? 'text-[#8AAB88]' : 'text-red-500'}`}>
            {labUploadMessage}
          </p>
        )}
      </form>

      {labResults.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-[#EFE7DD]/40 to-[#f7f2ea]/20 rounded-xl border-2 border-dashed border-[#D9A68A]/40">
          <p className="text-[#4A3A33]/70 font-medium">No lab results uploaded yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {labResults.map((item) => (
            <li key={item.id} className="p-4 sm:p-6 bg-gradient-to-br from-white to-[#EFE7DD]/10 rounded-xl border-2 border-[#D9A68A]/20 hover:border-[#8AAB88] hover:shadow-md transition-all duration-200 text-[#4A3A33]">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#8AAB88]/20 text-[#4A3A33]">
                      {item.fileType?.includes('pdf') ? 'PDF' : item.fileType?.includes('image') ? 'IMAGE' : 'DOC'}
                    </span>
                    <span className="font-bold text-lg truncate">{item.fileName}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-[#4A3A33]/70 mb-1">{item.description}</p>
                  )}
                  <p className="text-sm text-[#4A3A33]/60 font-medium">{new Date(item.createdAt).toLocaleString()}</p>
                  <p className="text-xs text-[#4A3A33]/50 mt-1">Uploaded by: {item.uploaderEmail} ({item.uploaderRole})</p>
                  {userData?.role === 'staff' && (
                    <p className="text-sm text-[#8AAB88] font-bold mt-1">Patient: {item.patientEmail}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={item.fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#8AAB88] to-[#7a9b78] hover:from-[#7a9b78] hover:to-[#8AAB88] rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    View / Download
                  </a>
                  {(userData?.role === 'staff' || item.uploadedBy === user?.uid) && (
                    <button
                      onClick={() => handleFileDelete(item.id, item.filePath, 'labResults', labResults, setLabResults)}
                      className="px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all shadow-md"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}