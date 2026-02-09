import Link from 'next/link';
import Image from 'next/image';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFE7DD] via-[#f7f2ea] to-[#EFE7DD]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image src="/blacklogo2.png" alt="MyChart by Alera" width={180} height={45} style={{ objectFit: 'contain' }} priority />
            </div>
            <Link
              href="/"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#D9A68A] to-[#c9906f] hover:from-[#c9906f] hover:to-[#D9A68A] rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Back to Portal
            </Link>
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#4A3A33] mb-4 font-['Montserrat']">Terms of Service</h1>
          <p className="text-sm text-[#4A3A33]/60 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="space-y-8 text-[#4A3A33]">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">1. Introduction</h2>
              <p className="leading-relaxed mb-4">
                Welcome to MyChart by Alera Care Collective ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our patient portal platform, including our website at mychart.aleracarecollective.com and related services (collectively, the "Service").
              </p>
              <p className="leading-relaxed">
                By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">2. Acceptance of Terms</h2>
              <p className="leading-relaxed mb-4">
                By creating an account or using our Service, you represent that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You are at least 18 years of age or have parental/guardian consent</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You will provide accurate, current, and complete information</li>
                <li>You will maintain and update your information to keep it accurate and current</li>
              </ul>
            </section>

            {/* Description of Service */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">3. Description of Service</h2>
              <p className="leading-relaxed mb-4">
                MyChart provides a secure patient portal that enables you to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Track and log health metrics (blood pressure, glucose, weight)</li>
                <li>View your health data and trends</li>
                <li>Communicate with healthcare providers</li>
                <li>Access your medical records (where available)</li>
                <li>Manage appointments and health information</li>
              </ul>
            </section>

            {/* Privacy and Data Protection Compliance */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">4. Privacy and Data Protection Compliance</h2>
              <p className="leading-relaxed mb-4">
                Your privacy and the security of your health information are critically important to us. We comply with the Data Protection Act 2011 (DPA), the Regional Health Authorities Act (RHA Act), and other applicable privacy laws in Trinidad and Tobago.
              </p>
              <p className="leading-relaxed mb-4">
                Key points about your data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your personal and health information is encrypted and securely stored in accordance with the DPA 2011</li>
                <li>We will not share your information without your consent, except as required by law or the RHA Act</li>
                <li>You have the right to access, correct, and request deletion of your data under the Data Protection Act</li>
                <li>All staff members are trained in data protection and privacy compliance</li>
                <li>Your data is processed in accordance with the principles of the Data Protection Act 2011</li>
              </ul>
              <p className="leading-relaxed mt-4">
                For more details, please review our Privacy Policy.
              </p>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">5. User Responsibilities</h2>
              <p className="leading-relaxed mb-4">
                As a user of our Service, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Security:</strong> Maintain the confidentiality of your login credentials and not share your account with others</li>
                <li><strong>Accurate Information:</strong> Provide accurate and truthful health information</li>
                <li><strong>Appropriate Use:</strong> Use the Service only for lawful purposes and in accordance with these Terms</li>
                <li><strong>Emergency Care:</strong> Understand that this portal is not for emergency communications. Call 911 for emergencies</li>
                <li><strong>Compliance:</strong> Follow all instructions and guidelines provided by your healthcare providers</li>
              </ul>
            </section>

            {/* Not Emergency Service */}
            <section className="bg-[#FEE2E2] border-l-4 border-[#EF4444] p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2 text-[#4A3A33] font-['Montserrat']">⚠️ Emergency Notice</h2>
              <p className="leading-relaxed font-semibold">
                This service is NOT for medical emergencies. If you are experiencing a medical emergency, call 911 immediately or go to your nearest emergency room.
              </p>
            </section>

            {/* Account Termination */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">6. Account Termination</h2>
              <p className="leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account if:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You violate these Terms of Service</li>
                <li>You provide false or misleading information</li>
                <li>Your account is inactive for an extended period</li>
                <li>We determine that continuing service poses a risk to our systems or other users</li>
              </ul>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">7. Disclaimer of Warranties</h2>
              <p className="leading-relaxed mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="leading-relaxed">
                We do not warrant that the Service will be uninterrupted, error-free, or completely secure. While we take reasonable measures to protect your data, no internet transmission is completely secure.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">8. Limitation of Liability</h2>
              <p className="leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, ALERA CARE COLLECTIVE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">9. Intellectual Property</h2>
              <p className="leading-relaxed mb-4">
                All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, images, and software, are the exclusive property of Alera Care Collective and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="leading-relaxed">
                You may not copy, modify, distribute, sell, or lease any part of our Service without our express written permission.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">10. Changes to Terms</h2>
              <p className="leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Posting the updated Terms on this page</li>
                <li>Updating the "Last Updated" date</li>
                <li>Sending notice via email or through the portal</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Your continued use of the Service after changes are posted constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">11. Governing Law</h2>
              <p className="leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the Republic of Trinidad and Tobago, including but not limited to the Data Protection Act 2011 and the Regional Health Authorities Act, without regard to its conflict of law provisions.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">12. Contact Information</h2>
              <p className="leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-[#EFE7DD] p-4 rounded-lg">
                <p className="font-semibold mb-2">Alera Care Collective</p>
                <p>Email: office@aleracarecollective.com</p>
                <p>Website: mychart.aleracarecollective.com</p>
              </div>
            </section>

            {/* Acceptance */}
            <section className="border-t-2 border-[#D9A68A]/40 pt-8 mt-8">
              <p className="leading-relaxed font-medium">
                By using MyChart by Alera Care Collective, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-[#4A3A33]/60">
          <p>© {new Date().getFullYear()} Alera Care Collective. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
