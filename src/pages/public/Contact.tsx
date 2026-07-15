import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react';
import { Section } from '../../components/ui/Section';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const contactMethods: { icon: typeof Mail; title: string; description: string; sub: string; href?: string }[] = [
  { icon: Mail, title: 'Email Us', description: 'hello@trueworks.ug', sub: 'We respond within 24 hours', href: 'mailto:hello@trueworks.ug' },
  { icon: Phone, title: 'Call Us', description: '+256 700 123 456', sub: 'Mon-Fri, 8:00 AM - 5:00 PM', href: 'tel:+256700123456' },
  { icon: MessageCircle, title: 'WhatsApp', description: '+256 700 123 456', sub: 'Quick response via chat', href: 'https://wa.me/256700123456' },
  { icon: MapPin, title: 'Visit Us', description: 'Kampala, Uganda', sub: 'Schedule an appointment' },
];

const supportCards = [
  { title: 'Technical Support', description: 'Having trouble with your template? Our team is here to help.', icon: Mail },
  { title: 'Sales Inquiries', description: 'Questions about our products or bulk purchases?', icon: Phone },
  { title: 'Partnerships', description: 'Interested in partnering with TrueWorks?', icon: MessageCircle },
];

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const sendContact = useMutation(api.content.sendContactMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendContact(formData);
    setSubmitted(true);
  };

  return (
    <div className="pt-24 md:pt-28">
      <Section variant="dark" className="text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Have a question about our templates? Need help choosing the right product? We're here to help.
          </p>
        </motion.div>
      </Section>

      {/* Contact Methods */}
      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map((method) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg border border-border bg-white hover:shadow-card-hover transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <method.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-primary mb-1">{method.title}</h3>
              {method.href ? (
                <a href={method.href} className="text-sm font-medium text-primary hover:text-accent transition-colors">{method.description}</a>
              ) : (
                <p className="text-sm font-medium text-primary">{method.description}</p>
              )}
              <p className="text-xs text-text-muted mt-1">{method.sub}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section variant="section">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">Send us a Message</h2>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-lg bg-success/5 border border-success/20 text-center"
              >
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                <h3 className="font-heading text-xl font-bold text-primary mb-2">Message Sent!</h3>
                <p className="text-text-secondary">We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input
                    label="Full Name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@organization.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more about what you need..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-md border border-border bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors"
                  />
                </div>
                <Button type="submit" variant="primary" size="lg">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>

          {/* Support Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">Quick Support</h2>
            {supportCards.map((card) => (
              <div key={card.title} className="p-5 rounded-lg border border-border bg-white hover:shadow-card-hover transition-all">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center mb-3">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-primary mb-1">{card.title}</h3>
                <p className="text-sm text-text-secondary">{card.description}</p>
              </div>
            ))}
            <div className="p-5 rounded-lg bg-primary text-white mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-accent" />
                <h3 className="font-heading font-bold">Business Hours</h3>
              </div>
              <div className="space-y-1 text-sm text-white/70">
                <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                <p>Saturday: 9:00 AM - 1:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
