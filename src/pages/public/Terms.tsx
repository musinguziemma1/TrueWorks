import { motion } from 'framer-motion';
import { Section } from '../../components/ui/Section';

export function Terms() {
  return (
    <div className="pt-24 md:pt-28">
      <Section variant="dark" className="text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">Last updated: July 2026</p>
        </motion.div>
      </Section>
      <Section>
        <div className="max-w-3xl mx-auto prose prose-gray">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the TrueWorks Limited website and purchasing our digital products, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site.</p>

          <h2>2. Products</h2>
          <p>All products sold on this website are digital goods (Excel templates, PowerPoint decks, Word documents, PDFs, and similar files). No physical items are shipped. Upon successful payment, you receive an instant download link and an email with the same link.</p>

          <h2>3. License and Use</h2>
          <p>When you purchase a template, you receive a single-organization use license. You may:</p>
          <ul>
            <li>Use the template within your organization for its intended purpose</li>
            <li>Modify the template to suit your organization's needs</li>
            <li>Create reports and outputs from the template for business use</li>
          </ul>
          <p>You may NOT:</p>
          <ul>
            <li>Resell, redistribute, or sublicense the template or any derivative</li>
            <li>Share the download link or files with individuals outside your organization</li>
            <li>Use the template as part of a product or service you sell to others</li>
          </ul>

          <h2>4. Pricing and Payment</h2>
          <p>All prices are listed in Ugandan Shillings (UGX). We accept MTN Mobile Money, Airtel Money, Visa, and Mastercard. Payment is processed securely through our payment gateway. Your transaction is confirmed immediately, and your download link is generated automatically.</p>

          <h2>5. Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account and purchase information. TrueWorks is not liable for any loss or damage arising from unauthorized use of your account.</p>

          <h2>6. Limitation of Liability</h2>
          <p>TrueWorks Limited provides templates as professional tools. While we take care to ensure accuracy and quality, templates are provided 'as is' without warranty of fitness for a particular purpose. We are not liable for any indirect, incidental, or consequential damages arising from the use of our products.</p>

          <h2>7. Changes to Terms</h2>
          <p>We reserve the right to update these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of the site after changes constitutes acceptance of the new terms.</p>

          <h2>8. Governing Law</h2>
          <p>These terms are governed by the laws of the Republic of Uganda. Any disputes shall be resolved in the courts of Kampala, Uganda.</p>

          <h2>9. Contact</h2>
          <p>For questions about these terms, contact us at <strong>hello@trueworks.ug</strong>.</p>
        </div>
      </Section>
    </div>
  );
}
