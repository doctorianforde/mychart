import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPolicy() {
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

        {/* Privacy Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#4A3A33] mb-4 font-['Montserrat']">Privacy Policy</h1>
          <p className="text-sm text-[#4A3A33]/60 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="space-y-8 text-[#4A3A33]">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">1. Introduction</h2>
              <p className="leading-relaxed mb-4">
                At Alera Care Collective ("we," "our," or "us"), we are committed to protecting your privacy and safeguarding your personal and health information. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use MyChart, our patient portal platform.
              </p>
              <p className="leading-relaxed">
                We comply with the Data Protection Act 2011 (DPA) of Trinidad and Tobago, the Regional Health Authorities Act (RHA Act), and all applicable privacy and healthcare regulations.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold mb-3 text-[#4A3A33]">2.1 Personal Information</h3>
              <p className="leading-relaxed mb-4">We collect personal information that you provide when registering and using our Service:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                <li>Full name and date of birth</li>
                <li>Email address and phone number</li>
                <li>Profile photograph (optional)</li>
                <li>Login credentials (encrypted)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#4A3A33]">2.2 Health Information</h3>
              <p className="leading-relaxed mb-4">We collect health-related information that you input or that your healthcare providers share:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                <li>Blood pressure readings and logs</li>
                <li>Glucose/blood sugar readings</li>
                <li>Weight measurements</li>
                <li>Medical history and comorbidities</li>
                <li>Medications and allergies (where applicable)</li>
                <li>Communications with healthcare providers</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#4A3A33]">2.3 Technical Information</h3>
              <p className="leading-relaxed mb-4">We automatically collect certain technical information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Access times and pages viewed</li>
                <li>Referring website addresses</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">3. How We Use Your Information</h2>
              <p className="leading-relaxed mb-4">We use your information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Healthcare Services:</strong> To provide, maintain, and improve our patient portal services</li>
                <li><strong>Communication:</strong> To communicate with you about your health records and appointments</li>
                <li><strong>Provider Coordination:</strong> To facilitate communication between you and your healthcare providers</li>
                <li><strong>Data Analysis:</strong> To analyze health trends and improve care quality (anonymized data only)</li>
                <li><strong>Security:</strong> To protect against unauthorized access and ensure platform security</li>
                <li><strong>Legal Compliance:</strong> To comply with the Data Protection Act 2011, RHA Act, and other applicable laws</li>
                <li><strong>Service Improvement:</strong> To enhance user experience and platform functionality</li>
              </ul>
            </section>

            {/* Data Protection Act 2011 Compliance */}
            <section className="bg-[#E0F2FE] border-l-4 border-[#0284C7] p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">4. Data Protection Act 2011 Compliance</h2>
              <p className="leading-relaxed mb-4">
                We adhere to the principles established by Trinidad and Tobago's Data Protection Act 2011:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Lawful Processing:</strong> We process your data lawfully, fairly, and transparently</li>
                <li><strong>Purpose Limitation:</strong> We collect data only for specified, explicit, and legitimate purposes</li>
                <li><strong>Data Minimization:</strong> We collect only data that is adequate, relevant, and necessary</li>
                <li><strong>Accuracy:</strong> We take reasonable steps to ensure your data is accurate and up-to-date</li>
                <li><strong>Storage Limitation:</strong> We retain data only as long as necessary for the stated purposes</li>
                <li><strong>Security:</strong> We implement appropriate technical and organizational security measures</li>
                <li><strong>Accountability:</strong> We are responsible for and can demonstrate compliance with these principles</li>
              </ul>
            </section>

            {/* Information Sharing and Disclosure */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">5. Information Sharing and Disclosure</h2>

              <h3 className="text-xl font-semibold mb-3 text-[#4A3A33]">5.1 With Your Consent</h3>
              <p className="leading-relaxed mb-6">
                We share your information with your explicit consent, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                <li>Your designated healthcare providers and medical staff</li>
                <li>Family members or caregivers you authorize</li>
                <li>Other healthcare facilities when you request a referral or transfer of care</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#4A3A33]">5.2 Legal Requirements</h3>
              <p className="leading-relaxed mb-4">
                We may disclose your information without consent when required by law:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                <li>To comply with court orders or legal processes</li>
                <li>To comply with the Regional Health Authorities Act</li>
                <li>To report communicable diseases as required by public health authorities</li>
                <li>To prevent serious harm to you or others</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-[#4A3A33]">5.3 Service Providers</h3>
              <p className="leading-relaxed mb-4">
                We may share data with trusted service providers who assist us in operating our platform:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cloud hosting providers (Firebase, Google Cloud Platform)</li>
                <li>Email communication services</li>
                <li>Security and authentication services</li>
              </ul>
              <p className="leading-relaxed mt-4">
                All service providers are bound by strict confidentiality agreements and are required to comply with applicable data protection laws.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">6. Data Security</h2>
              <p className="leading-relaxed mb-4">
                We implement comprehensive security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Encryption:</strong> All data is encrypted in transit (TLS/SSL) and at rest</li>
                <li><strong>Access Controls:</strong> Role-based access controls limit who can view your information</li>
                <li><strong>Authentication:</strong> Multi-factor authentication options for enhanced security</li>
                <li><strong>Monitoring:</strong> Continuous security monitoring and regular security audits</li>
                <li><strong>Staff Training:</strong> All staff receive regular training on data protection and security</li>
                <li><strong>Backup Systems:</strong> Regular backups ensure data availability and recovery</li>
              </ul>
              <p className="leading-relaxed mt-4">
                While we implement robust security measures, no system is completely secure. Please help protect your account by using a strong password and not sharing your login credentials.
              </p>
            </section>

            {/* Your Rights Under the Data Protection Act */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">7. Your Rights Under the Data Protection Act</h2>
              <p className="leading-relaxed mb-4">
                Under Trinidad and Tobago's Data Protection Act 2011, you have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4">
                <li><strong>Right to Access:</strong> You can request a copy of your personal information we hold</li>
                <li><strong>Right to Correction:</strong> You can request correction of inaccurate or incomplete information</li>
                <li><strong>Right to Erasure:</strong> You can request deletion of your data (subject to legal retention requirements)</li>
                <li><strong>Right to Object:</strong> You can object to certain types of data processing</li>
                <li><strong>Right to Data Portability:</strong> You can request your data in a portable format</li>
                <li><strong>Right to Withdraw Consent:</strong> You can withdraw consent for data processing at any time</li>
                <li><strong>Right to Complain:</strong> You can lodge a complaint with the Data Protection Authority</li>
              </ul>
              <p className="leading-relaxed mt-4">
                To exercise any of these rights, please contact us at office@aleracarecollective.com
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">8. Data Retention</h2>
              <p className="leading-relaxed mb-4">
                We retain your information for as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Active Accounts:</strong> We retain data while your account is active</li>
                <li><strong>Inactive Accounts:</strong> We may retain data for up to 7 years after account closure (as required by healthcare regulations)</li>
                <li><strong>Legal Requirements:</strong> We retain data as required by the RHA Act and other applicable laws</li>
                <li><strong>Anonymized Data:</strong> We may retain anonymized data indefinitely for research and quality improvement</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">9. Children's Privacy</h2>
              <p className="leading-relaxed mb-4">
                Our Service is not intended for children under 18 years of age without parental or guardian consent. If you are a parent or guardian and believe your child has provided us with personal information without your consent, please contact us immediately.
              </p>
            </section>

            {/* International Data Transfers */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">10. International Data Transfers</h2>
              <p className="leading-relaxed mb-4">
                Your data may be stored and processed on servers located outside of Trinidad and Tobago, including but not limited to the United States (Google Cloud Platform/Firebase). We ensure that any international data transfers comply with the Data Protection Act 2011 and that adequate safeguards are in place.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">11. Cookies and Tracking Technologies</h2>
              <p className="leading-relaxed mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintain your session and keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Analyze platform usage and improve performance</li>
                <li>Enhance security and prevent fraud</li>
              </ul>
              <p className="leading-relaxed mt-4">
                You can control cookies through your browser settings, but disabling cookies may affect the functionality of our Service.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">12. Changes to This Privacy Policy</h2>
              <p className="leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Posting the updated policy on this page</li>
                <li>Updating the "Last Updated" date</li>
                <li>Sending notice via email or through the portal</li>
              </ul>
              <p className="leading-relaxed mt-4">
                We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#4A3A33] font-['Montserrat']">13. Contact Information</h2>
              <p className="leading-relaxed mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights under the Data Protection Act:
              </p>
              <div className="bg-[#EFE7DD] p-4 rounded-lg mb-6">
                <p className="font-semibold mb-2">Alera Care Collective</p>
                <p>Email: office@aleracarecollective.com</p>
                <p>Website: mychart.aleracarecollective.com</p>
              </div>
              <p className="leading-relaxed">
                You may also contact the Data Protection Commissioner of Trinidad and Tobago if you have concerns about how we handle your personal information.
              </p>
            </section>

            {/* Acceptance */}
            <section className="border-t-2 border-[#D9A68A]/40 pt-8 mt-8">
              <p className="leading-relaxed font-medium">
                By using MyChart by Alera Care Collective, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.
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
