import { MarketingNav } from '@/components/layout/MarketingNav'
import { Footer } from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <div className="pt-24 pb-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-medium tracking-tight text-navy">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: May 24, 2026</p>

          <div className="mt-10 space-y-8 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-medium text-navy mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using Scrubbed.Pro (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service. These Terms constitute a legally binding agreement between you and Scrubbed.Pro, Inc. (&quot;Scrubbed.Pro,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).</p>
              <p className="mt-2">We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page with a revised &quot;Last updated&quot; date. Your continued use of the Service after any changes constitutes acceptance of the revised Terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">2. Description of Service</h2>
              <p>Scrubbed.Pro provides an automated personal data removal platform (&quot;Platform&quot;) that submits opt-out requests to publicly accessible data broker websites on the user&apos;s (&quot;you&quot; or &quot;your&quot;) behalf. The Service scans for personal information across a database of known data brokers, generates opt-out requests using official broker opt-out mechanisms, and monitors for re-listing of removed data.</p>
              <p className="mt-2">The Service does <strong>not</strong> include removal of data from credit bureaus, government records, social media platforms, or any source that does not provide a lawful opt-out mechanism. Scrubbed.Pro does not guarantee complete removal from all data brokers, as brokers vary in their response times and opt-out procedures.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">3. Eligibility</h2>
              <p>You must be at least 18 years of age and a resident of the United States to use the Service. By using the Service, you represent and warrant that you meet these eligibility requirements. The Service is not available in jurisdictions where the described opt-out mechanisms are not recognized by law.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">4. Account Registration</h2>
              <p>You must create an account to use the Service. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify Scrubbed.Pro immediately of any unauthorized use of your account.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">5. User Information</h2>
              <p>You agree to provide only your own personal information when using the Service. You may not use the Service to submit opt-out requests for any other individual without their express consent. Scrubbed.Pro will only process information you voluntarily provide and will use that information solely for the purposes described in these Terms and our Privacy Policy.</p>
              <p className="mt-2">You retain all rights to the personal information you provide. Scrubbed.Pro does not claim ownership of any data you submit.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">6. Subscriptions and Billing</h2>
              <p>The Service is available through subscription plans. Subscription fees are billed in advance on a monthly or annual basis, depending on the plan you select. All fees are non-refundable except as required by law or as explicitly stated in this agreement.</p>
              <p className="mt-2">Subscriptions automatically renew at the end of each billing period unless you cancel before the renewal date. You may cancel your subscription at any time through your account settings or by contacting us at support@scrubbed.pro. Cancellation takes effect at the end of the current billing period — you will not receive a refund for the remaining period, but you will retain access until the end of your paid term.</p>
              <p className="mt-2">We reserve the right to change subscription fees with 30 days&apos; prior written notice. Any fee change will apply to the next billing cycle following the notice period.</p>
              <p className="mt-2">Failed payments: If a payment fails, we will attempt to process it again within 5 business days. If the payment remains failed, your account may be suspended and access to the Service discontinued.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">7. Cancellation and Termination</h2>
              <p>You may cancel your subscription at any time from your account settings. Upon cancellation, your subscription will remain active until the end of your current paid billing period. We may suspend or terminate your access to the Service at any time if you breach these Terms. We may also discontinue the Service at any time with 30 days&apos; prior notice.</p>
              <p className="mt-2">Upon termination for any reason, all data associated with your account will be deleted from our active systems within 30 days, subject to our data retention obligations under applicable law.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">8. Prohibited Use</h2>
              <p>You agree not to use the Service to: (a) violate any applicable law, regulation, or third-party rights; (b) submit false, misleading, or fraudulent information; (c) attempt to gain unauthorized access to any account or system; (d) interfere with or disrupt the Service or its underlying infrastructure; (e) use the Service to process data for third parties as a service bureau; or (f) reverse engineer, decompile, or disassemble any component of the Service.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">9. No Guarantee of Removal</h2>
              <p>Scrubbed.Pro uses automated tools to submit opt-out requests through official channels. We do not guarantee that all data broker sites will honor opt-out requests, that removed data will not re-appear, or that the Service will identify all data brokers on which your information appears. Removal timelines vary by broker and are outside our control.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">10. Intellectual Property</h2>
              <p>The Service, including its text, graphics, logos, software, and other content, is owned by Scrubbed.Pro, Inc. or its licensors and is protected by U.S. copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on the Service without our express written permission.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">11. Disclaimer of Warranties</h2>
              <p>THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. Scrubbed.Pro DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">12. Limitation of Liability</h2>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, Scrubbed.Pro AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, OR OTHERWISE), EVEN IF Scrubbed.Pro HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
              <p className="mt-2">IN NO EVENT SHALL Scrubbed.Pro&apos;S TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">13. Indemnification</h2>
              <p>You agree to indemnify, defend, and hold harmless Scrubbed.Pro and its officers, directors, employees, and agents from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or related to: (a) your use of the Service; (b) your violation of these Terms; or (c) your violation of any third-party rights.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">14. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. Any dispute arising out of or related to these Terms or the Service shall be resolved exclusively in the state or federal courts located in Wilmington, Delaware, and you hereby consent to the personal jurisdiction of those courts.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">15. Severability</h2>
              <p>If any provision of these Terms is held to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will continue in full force and effect.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">16. Entire Agreement</h2>
              <p>These Terms, together with our Privacy Policy and any plan confirmation documents, constitute the entire agreement between you and Scrubbed.Pro regarding the Service and supersede all prior agreements, understandings, or representations, whether written or oral.</p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-navy mb-3">17. Contact</h2>
              <p>Questions about these Terms? Contact us at:</p>
              <p className="mt-2">Scrubbed.Pro, Inc.<br />
              1616 Pacific Coast Highway, Suite 201<br />
              Wilmington, DE 90401<br />
              support@scrubbed.pro</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}