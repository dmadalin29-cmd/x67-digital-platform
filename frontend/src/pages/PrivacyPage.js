import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-padding bg-card border-b border-border">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Shield className="w-16 h-16 text-gold-500 mx-auto mb-6" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy <span className="text-gradient-gold">Policy</span>
            </h1>
            <p className="text-muted-foreground">Last updated: January 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="section-container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 md:p-12 space-y-8"
          >
            <section>
              <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                x67 Digital Media Groupe ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website x67digital.co.uk and use our services. We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials (email and password)</li>
                <li>Payment information (processed securely by our payment provider)</li>
                <li>Competition entry records and ticket purchases</li>
                <li>Communications you send to us</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We also automatically collect certain information when you use our services, including IP address, browser type, device information, and usage data.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Process your competition entries and payments</li>
                <li>Manage your account and provide customer support</li>
                <li>Send you competition updates, winner notifications, and service communications</li>
                <li>Improve and optimize our services</li>
                <li>Comply with legal obligations and prevent fraud</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">4. Legal Basis for Processing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We process your personal data on the following legal bases: (a) Contract performance - to process your competition entries and manage your account; (b) Legitimate interests - to improve our services and prevent fraud; (c) Legal obligation - to comply with applicable laws; (d) Consent - for marketing communications.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">5. Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Payment processors to complete transactions</li>
                <li>Service providers who assist in operating our platform</li>
                <li>Legal authorities when required by law</li>
                <li>Prize delivery partners to fulfill winnings</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal data for as long as necessary to provide our services and fulfill the purposes described in this policy. Account data is retained while your account is active and for up to 6 years afterward for legal and regulatory compliance. Transaction records are retained for 7 years as required by UK tax law.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Under UK GDPR, you have the following rights:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at privacy@x67digital.co.uk.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">8. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage, and assist in marketing efforts. You can control cookie preferences through your browser settings. Essential cookies required for site functionality cannot be disabled.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">9. Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes SSL encryption, secure data storage, and regular security assessments.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>x67 Digital Media Groupe</p>
                <p>Email: privacy@x67digital.co.uk</p>
                <p>Website: x67digital.co.uk</p>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) if you believe your data protection rights have been violated.
              </p>
            </section>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
