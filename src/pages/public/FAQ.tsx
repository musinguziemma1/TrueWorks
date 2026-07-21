import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Section, SectionHeader } from '../../components/ui/Section';
import { cn } from '../../lib/utils';
import { SEO } from '../../components/SEO';

const faqs = [
  {
    category: 'Ordering & Delivery',
    items: [
      { q: 'How do I receive my template after purchase?', a: 'Immediately after successful payment, you will see a download button on your screen. We also send a download link to the email address you provided during checkout. Links are active for 7 days or 5 downloads, whichever comes first.' },
      { q: 'How long does delivery take?', a: 'Delivery is instant. Our products are digital files, so there is no shipping. As soon as your payment is confirmed, your download link is generated automatically.' },
      { q: 'I did not receive my download email. What should I do?', a: 'Check your spam or promotions folder first. If it is not there, email us at hello@trueworks.ug with your order number and we will resend the link.' },
    ],
  },
  {
    category: 'Payment',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept major credit cards (Visa, Mastercard) and mobile money (MTN, Airtel) where supported. All payments are processed securely through our PCI-compliant payment gateway, Pesapal.' },
      { q: 'Is it safe to pay on your site?', a: 'Yes. Payments are processed through Pesapal, a PCI-compliant payment gateway. We do not store your payment details on our servers.' },
      { q: 'What currency are prices shown in?', a: 'All prices are shown in United States Dollars (USD). Mobile money options may settle in your local currency equivalent at the prevailing rate.' },
    ],
  },
  {
    category: 'File Compatibility',
    items: [
      { q: 'What software do I need to use these templates?', a: 'Most templates are built for Microsoft Excel 2016 or later (including Excel 365). Some products are available in PowerPoint, Word, or PDF format. Each product page lists the specific file format and software requirements.' },
      { q: 'Will these work on a Mac?', a: 'Excel for Mac supports most of our templates. However, some advanced features (VBA macros, ActiveX controls) may not function on Mac. Check the product description for Mac compatibility notes.' },
      { q: 'Can I use these templates in Google Sheets?', a: 'Basic functionality may work in Google Sheets, but we recommend using Excel for full compatibility. Our templates often use features not available in Google Sheets.' },
    ],
  },
  {
    category: 'Licensing',
    items: [
      { q: 'Can I use the template for multiple organizations?', a: 'Each purchase grants a license for use within a single organization. If you need to use the template across multiple organizations, please contact us for a multi-license or enterprise quote.' },
      { q: 'Can I resell your templates?', a: 'No. Our templates are licensed for use within your organization. Reselling, redistributing, or sublicensing is strictly prohibited.' },
      { q: 'Can I modify the template?', a: 'Yes. You are free to modify the template to suit your organization\'s specific needs. The license covers the modified version as long as it is used within your organization.' },
    ],
  },
  {
    category: 'Support',
    items: [
      { q: 'Do you offer support if I get stuck?', a: 'Yes. Email us at hello@trueworks.ug and we will help you get started. We typically respond within 24 hours during business days.' },
      { q: 'Can I request a custom template?', a: 'Yes. We build custom business systems for organizations. Contact us with your requirements and we will provide a quote.' },
    ],
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <SEO
        title="Frequently Asked Questions"
        description="Answers to common questions about ordering, payment, delivery and using TrueWorks Excel templates and business systems."
        canonical="/faq"
      />
    <div className="pt-24 md:pt-28">
      <Section variant="dark" className="text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">Everything you need to know about ordering, payment, and using our templates.</p>
        </motion.div>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto space-y-8">
          {faqs.map((group) => (
            <div key={group.category}>
              <h2 className="font-heading text-xl font-bold text-primary mb-4">{group.category}</h2>
              <div className="space-y-2">
                {group.items.map((item, idx) => {
                  const globalIndex = faqs.flatMap(g => g.items).indexOf(item);
                  const isOpen = openIndex === globalIndex;
                  return (
                    <div key={idx} className="rounded-lg border border-border bg-white overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-section/50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="font-semibold text-primary pr-4">{item.q}</span>
                        <ChevronDown className={cn('w-5 h-5 text-text-muted shrink-0 transition-transform', isOpen && 'rotate-180')} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
    </>
  );
}
