import React from 'react';

interface ReferralsManagerProps {
  userData: any;
  user: any;
  referrals: any[];
  referralFile: File | null;
  setReferralFile: (file: File | null) => void;
  referralDescription: string;
  setReferralDescription: (desc: string) => void;
  referralUploading: boolean;
  setReferralUploading: (v: boolean) => void;
  referralUploadProgress: number;
  setReferralUploadProgress: (v: number) => void;
  referralUploadMessage: string;
  setReferralUploadMessage: (v: string) => void;
  selectedPatient: { uid: string; email: string; fullName: string } | null;
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
  setReferrals: (list: any[]) => void;
  validateFile: (file: File) => string | null;
}

export default function ReferralsManager({
  userData, user, referrals, referralFile, setReferralFile, referralDescription, setReferralDescription,
  referralUploading, setReferralUploading, referralUploadProgress, setReferralUploadProgress,
  referralUploadMessage, setReferralUploadMessage, selectedPatient,
  handleFileUpload, handleFileDelete, setReferrals, validateFile
}: ReferralsManagerProps) {
  if (userData?.role === 'staff' && !selectedPatient) {
    return (
      <div className="mb-8 p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[#4A3A33] font-['Montserrat']">Referrals</h2>
        <p className="text-[#4A3A33]/60">Select a patient above to view or upload referrals.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 p-4 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-[#4A3A33] font-['Montserrat']">Referrals</h2>

      <form
        onSubmit={(e) => handleFileUpload(e, 'referrals', referralFile, referralDescription, setReferralUploading, setReferralUploadProgress, setReferralUploadMessage, setReferralFile, setReferralDescription, referrals, setReferrals)}
        className="space-y-6 mb-8"
      >
        {userData?.role === 'staff' && selectedPatient && (
          <p className="text-sm font-semibold text-[#8AAB88]">
            Uploading for: {selectedPatient.fullName || selectedPatient.email}
          </p>
        )}

        <div>
          <label className="block text-base font-bold text-[#4A3A33] mb-3">Upload Referral</label>
          <input
            type="file"
            data-upload="referrals"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              if (file) {
                const error = validateFile(file);
                if (error) {
                  alert(error);
                  e.target.value = '';
                  setReferralFile(null);
                  return;
                }
              }
              setReferralFile(file);
            }}
            className="block w-full text-base text-[#4A3A33] file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-base file:font-bold file:bg-[#EFE7DD] file:text-[#4A3A33] hover:file:bg-[#D9A68A]/30 file:transition-all file:cursor-pointer cursor-pointer"
          />
          <p className="text-xs text-[#4A3A33]/50 mt-1">Accepted: PDF, JPG, PNG, GIF, WebP, DOC, DOCX. Max size: 10MB</p>
        </div>

        <div>
          <label className="block text-base font-bold text-[#4A3A33] mb-3">Description (optional)</label>
          <input
            type="text"
            placeholder="e.g. Cardiology referral from Dr. Smith"
            value={referralDescription}
            onChange={(e) => setReferralDescription(e.target.value)}
            className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 p-4 text-base text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
          />
        </div>

        {referralUploading && (
          <div className="w-full bg-[#EFE7DD] rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[#8AAB88] to-[#7a9b78] h-3 rounded-full transition-all duration-300"
              style={{ width: `${referralUploadProgress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={referralUploading}
          className="w-full py-4 px-8 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-[#4A3A33] to-[#5e4d44] hover:from-[#3a2e28] hover:to-[#4A3A33] focus:outline-none focus:ring-4 focus:ring-[#4A3A33]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {referralUploading ? `Uploading... ${referralUploadProgress}%` : 'Upload Referral'}
        </button>

        {referralUploadMessage && (
          <p className={`text-base font-bold ${referralUploadMessage.includes('success') ? 'text-[#8AAB88]' : 'text-red-500'}`}>
            {referralUploadMessage}
          </p>
        )}
      </form>

      {referrals.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-[#EFE7DD]/40 to-[#f7f2ea]/20 rounded-xl border-2 border-dashed border-[#D9A68A]/40">
          <p className="text-[#4A3A33]/70 font-medium">No referrals uploaded yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {referrals.map((item) => (
            <li key={item.id} className="p-4 sm:p-6 bg-gradient-to-br from-white to-[#EFE7DD]/10 rounded-xl border-2 border-[#D9A68A]/20 hover:border-[#8AAB88] hover:shadow-md transition-all duration-200 text-[#4A3A33]">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D9A68A]/20 text-[#4A3A33]">
                      {item.fileType?.includes('pdf') ? 'PDF' : item.fileType?.includes('image') ? 'IMAGE' : 'DOC'}
                    </span>
                    <span className="font-bold text-lg truncate">{item.fileName}</span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-[#4A3A33]/70 mb-1">{item.description}</p>
                  )}
                  <p className="text-sm text-[#4A3A33]/60 font-medium">{new Date(item.createdAt).toLocaleString()}</p>
                  <p className="text-xs text-[#4A3A33]/50 mt-1">Uploaded by: {item.uploaderEmail} ({item.uploaderRole})</p>
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
                      onClick={() => handleFileDelete(item.id, item.filePath, 'referrals', referrals, setReferrals)}
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