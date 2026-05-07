import React, { useState } from 'react';

interface WhatsAppSupportProps {
  userData: any;
  officeNumber: string; // Format: 15551234567 (No plus sign or spaces)
}

export default function WhatsAppSupport({ userData, officeNumber }: WhatsAppSupportProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Construct the automated part of the message
    const patientDetails = `\n\n-- Patient Details --\nName: ${userData?.fullName}\nEmail: ${userData?.email}\nPhone: ${userData?.phoneNumber || 'Not provided'}`;
    
    const fullMessage = `Hello Alera Office, I have a question: \n\n${message}${patientDetails}`;
    
    // Encode for URL
    const encodedMessage = encodeURIComponent(fullMessage);
    
    // Open WhatsApp
    window.open(`https://wa.me/${officeNumber}?text=${encodedMessage}`, '_blank');
    setMessage(''); // Clear input
  };

  return (
    <div className="mb-8 p-6 bg-gradient-to-br from-[#EFE7DD] to-white rounded-2xl shadow-lg border-2 border-[#8AAB88]/30">
      <h3 className="text-xl font-bold text-[#4A3A33] mb-4 flex items-center gap-2">
        <span className="text-2xl">💬</span> Contact Office via WhatsApp
      </h3>
      <div className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help you today?"
          className="w-full p-4 rounded-xl border-2 border-[#D9A68A]/30 focus:border-[#8AAB88] focus:ring-0 text-[#4A3A33] transition-all resize-none"
          rows={3}
        />
        <button
          onClick={handleSendMessage}
          className="w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl shadow-md transition-all transform hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2"
        >
          Send to WhatsApp
        </button>
      </div>
    </div>
  );
}