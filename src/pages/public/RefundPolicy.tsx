import { motion } from 'framer-motion';
import { Section } from '../../components/ui/Section';

export function RefundPolicy() {
  return (
    <div className="pt-24 md:pt-28">
      <Section variant="dark" className="text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Refund Policy</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">Digital Products Refund Policy</p>
        </motion.div>
      </Section>
      <Section>
        <div className="max-w-3xl mx-auto prose prose-gray">
          <h2>Digital Products Are Non-Refundable Once Downloaded</h2>
          <p>Because our products are digital files that can be instantly downloaded and used, all sales are final once the download link has been accessed. This policy protects the value of our intellectual property and is standard practice in the digital products industry.</p>

          <h2>When We Will Issue a Refund</h2>
          <p>We will issue a full refund in the following circumstances:</p>
          <ul>
            <li><strong>Corrupted or non-functional file:</strong> If the downloaded file is corrupted or will not open with the stated software requirements</li>
            <li><strong>Wrong product delivered:</strong> If the file you received is not the product you purchased</li>
            <li><strong>Duplicate purchase:</strong> If you accidentally purchased the same product twice</li>
          </ul>

          <h2>When We Cannot Issue a Refund</h2>
          <p>Refunds will not be issued for:</p>
          <ul>
            <li>Change of mind after downloading the file</li>
            <li>Compatibility issues with software versions not stated in the product requirements (e.g., using an older Excel version than specified)</li>
            <li>Not reading the product description fully before purchase</li>
            <li>Inability to use the template due to lack of training — we provide support to help you get started</li>
          </ul>

          <h2>How to Request a Refund</h2>
          <p>If you believe your situation qualifies for a refund under the conditions above, email us within 7 days of purchase at <strong>hello@trueworks.ug</strong> with:</p>
          <ul>
            <li>Your order number</li>
            <li>A description of the issue</li>
            <li>A screenshot or evidence if applicable</li>
          </ul>
          <p>We will review your request and respond within 48 hours.</p>

          <h2>Support Before Purchase</h2>
          <p>To avoid issues, we strongly recommend:</p>
          <ul>
            <li>Reading the full product description and compatibility requirements before purchasing</li>
            <li>Contacting us at <strong>hello@trueworks.ug</strong> if you have any questions about whether a product meets your needs</li>
            <li>Checking that your software version matches the requirements stated on the product page</li>
          </ul>

          <p>We are committed to your satisfaction. If something is wrong with your purchase, we will make it right.</p>
        </div>
      </Section>
    </div>
  );
}
