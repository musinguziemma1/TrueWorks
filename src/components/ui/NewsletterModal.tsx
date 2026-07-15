import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Mail, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { useUIStore } from '../../lib/store';

export function NewsletterModal() {
  const { isNewsletterOpen, setNewsletterOpen } = useUIStore();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
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
            onClick={() => setNewsletterOpen(false)}
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
              onClick={() => setNewsletterOpen(false)}
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
                    We've sent the free Hospital KPI Dashboard to <strong className="text-primary">{email}</strong>
                  </p>
                  <p className="text-sm text-text-muted mb-6">
                    Also check your spam folder if you don't see it within 5 minutes.
                  </p>
                  <Button variant="primary" fullWidth onClick={() => setNewsletterOpen(false)}>
                    Got it
                  </Button>
                </motion.div>
              ) : (
                <>
                  <h2 className="font-heading text-2xl font-bold text-primary mb-2">
                    Get a Free Hospital KPI Dashboard
                  </h2>
                  <p className="text-text-secondary mb-6">
                    Enter your email to download our premium Hospital KPI Dashboard template. Track 20+ essential healthcare metrics for free.
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your work email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<Mail className="w-4 h-4" />}
                      required
                      aria-label="Email address"
                    />
                    <Button type="submit" variant="accent" size="lg" fullWidth>
                      <Download className="w-5 h-5" />
                      Download Free Template
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
