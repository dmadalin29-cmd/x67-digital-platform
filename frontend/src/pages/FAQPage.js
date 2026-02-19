import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { API } from "../App";

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${API}/content/faq`);
      if (response.ok) {
        const data = await response.json();
        setFaqs(data.items || []);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Default FAQs if none from API
  const defaultFAQs = [
    {
      question: "How do I enter a competition?",
      answer: "Simply browse our competitions, select the one you want to enter, choose how many tickets you want, and complete the secure checkout. Your ticket numbers will be emailed to you instantly.",
    },
    {
      question: "How are winners selected?",
      answer: "Winners are selected using a cryptographically secure random number generator when the competition ends. All draws are conducted fairly and transparently.",
    },
    {
      question: "When will I receive my prize?",
      answer: "Once you've been confirmed as a winner, we aim to arrange prize delivery within 14 working days. For vehicles, this includes full handover and registration assistance.",
    },
    {
      question: "Are the competitions legitimate?",
      answer: "Absolutely! x67 Digital is operated by x67 Digital Media Groupe, a UK registered company. All our competitions comply with UK gambling laws and regulations.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards through our secure payment provider Viva Payments. All transactions are encrypted and secure.",
    },
    {
      question: "Can I get a refund?",
      answer: "Tickets are non-refundable once purchased as per our terms and conditions. Please only purchase tickets you intend to keep.",
    },
    {
      question: "How do I know if I've won?",
      answer: "Winners are notified via email immediately after the draw. We also publish winners on our website and social media channels. Make sure your contact details are up to date!",
    },
    {
      question: "Is there a limit to how many tickets I can buy?",
      answer: "You can purchase up to 100 tickets per transaction. There's no overall limit on ticket purchases, but we encourage responsible play.",
    },
  ];

  const displayFAQs = faqs.length > 0 ? faqs : defaultFAQs;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-padding bg-card border-b border-border">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <HelpCircle className="w-16 h-16 text-gold-500 mx-auto mb-6" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked <span className="text-gradient-gold">Questions</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Got questions? We've got answers. Find everything you need to know about x67 Digital competitions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section-padding">
        <div className="section-container max-w-3xl">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {displayFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="glass-card rounded-xl border border-border px-6 data-[state=open]:border-gold-500/50"
                    data-testid={`faq-item-${index}`}
                  >
                    <AccordionTrigger className="text-white font-medium text-left hover:text-gold-500 hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-card">
        <div className="section-container text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href="mailto:support@x67digital.co.uk"
            className="inline-flex items-center gap-2 btn-primary px-8 py-4 rounded-none text-base font-bold uppercase tracking-wide"
            data-testid="contact-support"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
