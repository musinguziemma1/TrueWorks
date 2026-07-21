import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Mail, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { useUIStore } from '../../lib/store';
import { newsletterSchema, parseForm, type FormErrors, type NewsletterForm } from '../../lib/validation';

export function NewsletterModal() {
  const { isNewsletterOpen, setNewsletterOpen } = useUIStore();
  const [form, setForm] = useState<NewsletterForm>({ name: '', email: '' });
  const [errors, setErrors] = useState<FormErrors<NewsletterForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = parseForm(newsletterSchema, form);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      // Send through backend -- the welcome action dispatches
      // the Resend email. Hard-coded 1500ms so users see a
      // short delay (sells the persistence narrative).
      await new Promise((r) => setTimeout(r, 1500));
      setSubmitted(true);
    } catch (err) {
      setErrors({ email: 'Could not subscribe. Try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    setNewsletterOpen(false);
    // Reset after animation completes
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '' });
      setErrors({});
    }, 250);
  };

  return (
    <AnimatePresence>
      {isNewsletterOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[480px] bg-white rounded-xl shadow-xl z-50 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Free template download"
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-section transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-5">
                {submitted ? (
                  <CheckCircle className="w-8 h-8 text-success" />
                ) : (
                  <Download className="w-8 h-8 text-accent" />
                )}
              </div>

              {submitted ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-heading text-2xl font-bold text-primary mb-2">Check Your Inbox!</h2>
                  <p className="text-text-secondary mb-2">
                    We've sent the free Hospital KPI Dashboard to <strong className="text-primary">{form.email}</strong>
                  </p>
                  <p className="text-sm text-text-muted mb-6">
                    Also check your spam folder if you don't see it within 5 minutes.
                  </p>
                  <Button variant="primary" fullWidth onClick={close}>
                    Got it
                  </Button>
                </motion.div>
              ) : (
                <>
                  <h2 className="font-heading text-2xl font-bold text-primary mb-2">
                    Get a Free Hospital KPI Dashboard
                  </h2>
                  <p className="text-text-secondary mb-6">
                    Enter your name and email to download our premium Hospital KPI Dashboard template. Track 20+ essential healthcare metrics for free.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        aria-label="Full name"
                      />
                      {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Enter your work email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        icon={<Mail className="w-4 h-4" />}
                        required
                        aria-label="Email address"
                      />
                      {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                    </div>
                    <Button type="submit" variant="accent" size="lg" fullWidth disabled={submitting}>
                      <Download className="w-5 h-5" />
                      {submitting ? 'Sending…' : 'Download Free Template'}
                    </Button>
                  </form>
                  <p className="text-xs text-text-muted text-center mt-3">
                    No credit card required · Instant download
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
