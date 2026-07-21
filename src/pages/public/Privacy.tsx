import { motion } from 'framer-motion';
import { Section } from '../../components/ui/Section';
import { SEO } from '../../components/SEO';

export function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="TrueWorks Limited privacy policy — how we collect, use and protect your personal information when you use our website and purchase our digital products."
        canonical="/privacy"
      />
    <div className="pt-24 md:pt-28">
      <Section variant="dark" className="text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">Last updated: July 2026</p>
        </motion.div>
      </Section>
      <Section>
        <div className="max-w-3xl mx-auto prose prose-gray">
          <h2>1. Information We Collect</h2>
          <p>When you use our website, we may collect:</p>
          <ul>
            <li><strong>Personal information:</strong> name, email address, phone number, and billing information when you make a purchase or sign up for our newsletter</li>
            <li><strong>Usage data:</strong> pages visited, products viewed, and interactions with our site via Google Analytics 4 and Meta Pixel</li>
            <li><strong>Transaction data:</strong> order details, payment method (we do not store card numbers), and download history</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Process your orders and deliver digital products</li>
            <li>Send purchase confirmations and download links</li>
            <li>Send occasional product updates and offers (with your consent via newsletter signup)</li>
            <li>Improve our website and product offerings based on usage patterns</li>
            <li>Respond to your inquiries via the contact form</li>
          </ul>

          <h2>3. Email Communications</h2>
          <p>If you subscribe to our newsletter or download a free template, we will send you emails about our products and services. You can unsubscribe at any time using the link in every email. We use MailerLite to manage our email communications.</p>

          <h2>4. Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul>
            <li>Our payment gateway (Pesapal) to process transactions</li>
            <li>MailerLite to manage email subscriptions and purchase follow-ups</li>
            <li>Google Analytics and Meta for website analytics and advertising</li>
          </ul>
          <p>These third parties are contractually obligated to protect your data.</p>

          <h2>5. Data Security</h2>
          <p>We implement industry-standard security measures including SSL encryption, secure payment processing, and restricted admin access. However, no online transmission is 100% secure, and we cannot guarantee absolute security.</p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Unsubscribe from marketing communications at any time</li>
            <li>Request a copy of your transaction history</li>
          </ul>
          <p>To exercise these rights, email us at <strong>hello@trueworks.ug</strong>.</p>

          <h2>7. Cookies</h2>
          <p>We use essential cookies for site functionality and analytics cookies to understand usage patterns. You can control cookie preferences through your browser settings.</p>

          <h2>8. Changes to This Policy</h2>
          <p>We may update this policy periodically. Changes will be posted on this page with an updated revision date.</p>

          <h2>9. Contact</h2>
          <p>For privacy-related inquiries: <strong>hello@trueworks.ug</strong><br />TrueWorks Limited, Kampala, Uganda</p>
        </div>
      </Section>
    </div>
    </>
  );
}
