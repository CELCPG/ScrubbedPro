import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-medium tracking-tight text-navy">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: May 24, 2026</p>

          <div className="mt-10 space-y-8 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-medium text-navy mb-3">1. Introduction</h2>
              <p>Scrubbed.Pro, Inc. (&quot;Scrubbed.Pro,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our personal data removal platform and related services (collectively, the &quot;Platform&quot; or &quot;Service&quot;).</p>
              <p className="mt-2">This policy applies to all users of the Service, including residents of California, Virginia, and other U.S. states with applicable privacy laws. By using the Service, you consent to the collection and use of information as described in this policy.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">2. Information We Collect</h2>
              <p><strong>Information you provide directly:</strong> When you create an account or update your profile, you voluntarily provide: your first and last name, current and previous addresses (city and state), phone numbers, email addresses, and the names of known relatives. We <strong>never</strong> request or collect your Social Security number, driver&apos;s license number, financial account information, or medical information.</p>
              <p className="mt-2"><strong>Usage information:</strong> When you access the Platform, we automatically collect: your IP address, browser type, device information, pages visited, actions taken, and referring URL. This data is used to operate and secure the Platform and to improve our services.</p>
              <p className="mt-2"><strong>Payment information:</strong> All payment processing is handled by Stripe, Inc. We do not store your credit card number, bank account number, or other financial account information. Stripe&apos;s privacy policy governs their handling of your payment data.</p>
              <p className="mt-2"><strong>Broker scan results:</strong> When we scan data broker sites on your behalf, we collect information about listings found, including broker name, listing URL, fields exposed, and match confidence scores. This information is stored in association with your account.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="mt-2 space-y-1 list-disc pl-6">
                <li>Search data broker sites for listings of your personal information</li>
                <li>Submit opt-out requests to data brokers on your behalf</li>
                <li>Monitor for re-listing of previously removed personal information</li>
                <li>Notify you of scan results, removal status, and account events</li>
                <li>Process subscription billing and send billing-related communications</li>
                <li>Improve our Platform, including our scanning algorithms and opt-out automation</li>
                <li>Detect and prevent fraud, abuse, or unauthorized access</li>
                <li>Comply with our legal obligations</li>
              </ul>
              <p className="mt-2">We do <strong>not</strong> sell, rent, or share your personal information with third parties for their marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">4. Information Sharing and Disclosure</h2>
              <p>We share your information only in the following circumstances:</p>
              <ul className="mt-2 space-y-1 list-disc pl-6">
                <li><strong>Service providers:</strong> We use third-party processors (such as Stripe for payments, Resend for transactional email, and Supabase for database hosting) solely for the purpose of delivering the Service. These providers are contractually bound to use your information only to provide services to Scrubbed.Pro.</li>
                <li><strong>Legal requirements:</strong> We may disclose your information if required by law, regulation, court order, or other legal process, or if we believe disclosure is necessary to protect the rights, property, or safety of Scrubbed.Pro, our users, or the public.</li>
                <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of all or substantially all of our assets, your information may be transferred as part of that transaction. We will notify you via email or prominent notice on the Platform of any such change in ownership or use.</li>
                <li><strong>With your consent:</strong> We will not share your information with any other third parties without your explicit consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">5. Data Retention</h2>
              <p>We retain your personal information for as long as your account is active. After account deletion, we retain your information for up to 30 days before permanent deletion from our active systems, subject to our legal retention obligations. Aggregated, anonymized platform analytics may be retained indefinitely.</p>
              <p className="mt-2">Raw scraped HTML and page data is automatically purged within 24 hours of scan completion. Processed scan results (broker name, listing URL, field types, match scores) are retained as part of your account history.</p>
              <p className="mt-2">Our service providers (Supabase, Stripe, Resend) retain data as described in their respective privacy policies.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">6. Data Security</h2>
              <p>We implement industry-standard technical and organizational measures to protect your information, including: encryption of data in transit (TLS 1.2+); encryption of sensitive data at rest (AES-256); role-based access controls; and regular security reviews of our infrastructure and code.</p>
              <p className="mt-2">No method of transmission or storage is completely secure. If you become aware of any security vulnerability in our Platform, please contact us immediately at security@scrubbed.pro.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">7. Your Rights</h2>
              <p>Depending on your state of residence, you may have the following rights regarding your personal information:</p>
              <ul className="mt-2 space-y-2 list-disc pl-6">
                <li><strong>Right to know:</strong> You may request disclosure of the categories and specific pieces of personal information we have collected about you, the business purposes for which we collect it, and the categories of third parties with whom we share it.</li>
                <li><strong>Right to delete:</strong> You may request deletion of your personal information, subject to certain exceptions (such as information required for billing, legal compliance, or fraud prevention).</li>
                <li><strong>Right to opt out:</strong> You may opt out of the sale of your personal information. We do not sell your personal information.</li>
                <li><strong>Right to correct:</strong> You may request correction of inaccurate personal information.</li>
                <li><strong>Right to non-discrimination:</strong> We will not discriminate against you for exercising any of these rights.</li>
              </ul>
              <p className="mt-2">To exercise any of these rights, contact us at privacy@scrubbed.pro. We will verify your identity before processing your request. You may also designate an authorized agent to submit requests on your behalf, who must provide written authorization proving your consent.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">8. California Privacy Rights (CCPA)</h2>
              <p>California residents have the following additional rights under the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA):</p>
              <ul className="mt-2 space-y-1 list-disc pl-6">
                <li><strong>Right to correct:</strong> Request correction of inaccurate personal information.</li>
                <li><strong>Right to limit use:</strong> Request limitation on the use of sensitive personal information to the minimum necessary for the Service.</li>
                <li><strong>Right to know data retention period:</strong> Request disclosure of the length of time we retain each category of personal information.</li>
              </ul>
              <p className="mt-2">We do not sell your personal information (as defined under CCPA). We do not use sensitive personal information beyond what is necessary to deliver the Service. To exercise your rights, contact us at privacy@scrubbed.pro.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">9. Virginia Privacy Rights (VCDPA)</h2>
              <p>Virginia residents have the right to: (a) confirm whether we process your personal information; (b) access personal information; (c) correct inaccuracies; (d) delete personal information; (e) obtain a copy of personal information in a portable format; and (f) opt out of profiling, targeted advertising, and sale of personal information. To exercise these rights, contact us at privacy@scrubbed.pro.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">10. Children&apos;s Privacy</h2>
              <p>The Service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a minor, we will take steps to delete that information promptly. If you believe a minor&apos;s information has been collected, contact us at privacy@scrubbed.pro.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">11. Third-Party Links</h2>
              <p>The Platform may contain links to third-party websites (such as data broker sites or third-party privacy policies). We are not responsible for the privacy practices of any third-party websites. We encourage you to review the privacy policies of any third-party sites you visit.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">12. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email to the address associated with your account and by posting a prominent notice on the Platform prior to the change becoming effective. Your continued use of the Platform after any changes constitutes acceptance of the revised Privacy Policy.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">13. Contact</h2>
              <p>Questions or concerns about this Privacy Policy or our privacy practices? Contact us at:</p>
              <p className="mt-2">Scrubbed.Pro, Inc.<br />
              1616 Pacific Coast Highway, Suite 201<br />
              Wilmington, DE 90401<br />
              privacy@scrubbed.pro</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}