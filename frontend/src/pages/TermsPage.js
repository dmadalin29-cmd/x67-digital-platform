import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-padding bg-card border-b border-border">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FileText className="w-16 h-16 text-gold-500 mx-auto mb-6" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Terms & <span className="text-gradient-gold">Conditions</span>
            </h1>
            <p className="text-muted-foreground">Last updated: January 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="section-container max-w-4xl">
          <div className="prose prose-invert max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-8 md:p-12 space-y-8"
            >
              <section>
                <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to x67 Digital ("we", "us", "our"), operated by x67 Digital Media Groupe. These Terms and Conditions govern your use of our website x67digital.co.uk and participation in our prize competitions. By using our services, you agree to be bound by these terms.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">2. Eligibility</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To participate in our competitions, you must:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Be at least 18 years of age</li>
                  <li>Be a resident of the United Kingdom</li>
                  <li>Not be an employee, agent, or family member of x67 Digital Media Groupe</li>
                  <li>Have a valid email address and payment method</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">3. Competition Entry</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Each competition entry requires the purchase of one or more tickets at the advertised price. Entry is confirmed only upon successful payment processing. Ticket numbers are allocated randomly and automatically upon purchase.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The maximum number of tickets that can be purchased per transaction is 100. There is no limit to the total number of tickets you may purchase for any competition.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">4. Prize Draws</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Winners are selected using a cryptographically secure random number generator. Draws take place at the advertised draw date/time or when all tickets have been sold, whichever occurs first.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  In the event that insufficient tickets are sold, we reserve the right to extend the draw date, offer a cash alternative, or cancel the competition with full refunds issued to all entrants.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">5. Prizes</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Prizes are as described on the competition page. For vehicle prizes, the winner will receive the vehicle as specified or a cash alternative at our discretion. All applicable taxes, insurance, and registration fees are the responsibility of the winner.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Prize delivery will be arranged within 14 working days of winner verification. Winners must provide valid identification and proof of age before prize release.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">6. Refunds</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All ticket purchases are final and non-refundable, except in the event of competition cancellation. In such cases, refunds will be processed to the original payment method within 14 working days.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">7. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  x67 Digital Media Groupe shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or participation in our competitions. Our total liability shall not exceed the amount paid by you for competition entries.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">8. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms and Conditions are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-2xl font-bold text-gold-500 mb-4">9. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div className="mt-4 text-muted-foreground">
                  <p>x67 Digital Media Groupe</p>
                  <p>Email: legal@x67digital.co.uk</p>
                  <p>Website: x67digital.co.uk</p>
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
