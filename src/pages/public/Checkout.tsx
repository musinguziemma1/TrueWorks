import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, ShieldCheck, Lock, ChevronRight, Loader2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useCartStore } from '../../lib/store';
import { formatPrice, cn } from '../../lib/utils';
import { SEO } from '../../components/SEO';
import { checkoutContactSchema, parseForm } from '../../lib/validation';

type PaymentMethod = 'mtn_momo' | 'airtel_money' | 'visa' | 'mastercard';

const paymentMethods = [
  { id: 'mtn_momo' as PaymentMethod, name: 'MTN Mobile Money', icon: Smartphone, description: 'Pay with MTN MoMo' },
  { id: 'airtel_money' as PaymentMethod, name: 'Airtel Money', icon: Smartphone, description: 'Pay with Airtel Money' },
  { id: 'visa' as PaymentMethod, name: 'Visa', icon: CreditCard, description: 'Credit or debit card' },
  { id: 'mastercard' as PaymentMethod, name: 'Mastercard', icon: CreditCard, description: 'Credit or debit card' },
];

export function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<'info' | 'payment' | 'confirm'>('info');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'name' | 'email' | 'phone' | 'company', string>>>({});
  const createCustomer = useMutation(api.customers.create);
  const createOrder = useMutation(api.orders.create);
  const initiatePayment = useMutation(api.payments_integration.initiatePayment);
  const confirmPayment = useMutation(api.payments_integration.confirmPayment);

  const handleContinueToPayment = () => {
    const result = parseForm(checkoutContactSchema, formData);
    if (!result.ok) {
      setFieldErrors(result.errors);
      setError('Please complete the missing contact details before continuing.');
      return;
    }

    setFieldErrors({});
    setError(null);
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    const result = parseForm(checkoutContactSchema, formData);
    if (!result.ok) {
      setFieldErrors(result.errors);
      setError('Please complete the missing contact details before placing your order.');
      setStep('info');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setFieldErrors({});

    try {
      const customerId = await createCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        newsletter: false,
      });

      const id = await createOrder({
        customerId: customerId as any,
        customer: { name: formData.name, email: formData.email, phone: formData.phone || undefined },
        items: items.map(i => ({
          productId: i.product._id as any,
          productName: i.product.name,
          quantity: i.quantity,
          price: i.product.salePrice || i.product.price,
        })),
        subtotal: subtotal(),
        total: subtotal(),
        paymentMethod,
      });

      const { trackingId } = await initiatePayment({
        orderId: id as any,
        amount: subtotal(),
        email: formData.email,
        phone: formData.phone || undefined,
        firstName: formData.name.split(' ')[0] || formData.name,
        lastName: formData.name.split(' ').slice(1).join(' ') || undefined,
      });

      await confirmPayment({
        trackingId,
        status: "completed",
      });

      clearCart();
      navigate('/order-confirmation', { state: { orderId: id, email: formData.email } });
    } catch (err) {
      console.error('Order creation error:', err);
      setError('An error occurred while processing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const checkoutSteps = [
    { id: 'info', label: 'Information' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirm', label: 'Confirm' },
  ];

  return (
    <>
      <SEO
        title="Secure Checkout"
        description="Complete your order securely with Mobile Money or Card payment. Instant download on confirmation."
        canonical="/checkout"
      />
    <div className="pt-24 md:pt-28 min-h-screen bg-section">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {checkoutSteps.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                step === s.id ? 'bg-accent text-white' : 
                checkoutSteps.findIndex(x => x.id === step) > idx ? 'bg-success text-white' : 'bg-border text-text-muted'
              )}>
                {checkoutSteps.findIndex(x => x.id === step) > idx ? '✓' : idx + 1}
              </div>
              <span className={cn('text-sm font-semibold hidden sm:block', step === s.id ? 'text-primary' : 'text-text-muted')}>
                {s.label}
              </span>
              {idx < checkoutSteps.length - 1 && <ChevronRight className="w-4 h-4 text-text-muted" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <motion.div key={step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-lg border border-border bg-white">
              {step === 'info' && (
                <div>
                  <h2 className="font-heading text-xl font-bold text-primary mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input label="Full Name" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} error={fieldErrors.name} required />
                      <Input label="Email Address" type="email" placeholder="you@organization.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} error={fieldErrors.email} required />
                    </div>
                    <Input label="Phone Number" placeholder="+256 700 000 000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} error={fieldErrors.phone} required />
                    <Input label="Organization (optional)" placeholder="Your company or organization" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} error={fieldErrors.company} />
                    <Button variant="primary" size="lg" onClick={handleContinueToPayment} className="mt-4">
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div>
                  <h2 className="font-heading text-xl font-bold text-primary mb-6">Payment Method</h2>
                  <div className="space-y-3 mb-6">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={cn(
                          'w-full flex items-center gap-4 p-4 rounded-lg border transition-all text-left',
                          paymentMethod === pm.id ? 'border-accent bg-accent/5' : 'border-border hover:border-secondary'
                        )}
                      >
                        <div className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                          paymentMethod === pm.id ? 'border-accent' : 'border-border'
                        )}>
                          {paymentMethod === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                        </div>
                        <pm.icon className="w-6 h-6 text-primary" />
                        <div>
                          <p className="font-semibold text-primary">{pm.name}</p>
                          <p className="text-xs text-text-muted">{pm.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setStep('info')}>Back</Button>
                    <Button variant="primary" size="lg" onClick={() => setStep('confirm')}>Continue</Button>
                  </div>
                </div>
              )}

              {step === 'confirm' && (
                <div>
                  <h2 className="font-heading text-xl font-bold text-primary mb-6">Confirm Your Order</h2>
                  <div className="space-y-4 mb-6">
                    <div className="p-4 rounded-lg bg-section">
                      <p className="text-sm font-semibold text-text-muted mb-1">Contact</p>
                      <p className="text-primary font-medium">{formData.name} | {formData.email}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-section">
                      <p className="text-sm font-semibold text-text-muted mb-1">Payment Method</p>
                      <p className="text-primary font-medium">{paymentMethods.find(p => p.id === paymentMethod)?.name}</p>
                    </div>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.product._id} className="flex justify-between text-sm">
                          <span>{item.product.name} x{item.quantity}</span>
                          <span className="font-semibold">{formatPrice((item.product.salePrice || item.product.price) * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 rounded-lg bg-error/10 border border-error/20 mb-4">
                      <p className="text-sm text-error">{error}</p>
                    </div>
                  )}

                  <Button
                    variant="accent"
                    size="lg"
                    fullWidth
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !formData.name || !formData.email || !formData.phone}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Pay {formatPrice(subtotal())}
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-text-muted text-center mt-3 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    Your payment is secure and encrypted via Pesapal
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-lg border border-border bg-white sticky top-28">
              <h3 className="font-heading font-bold text-primary mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product._id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-section shrink-0 flex items-center justify-center overflow-hidden">
                      {item.product.thumbnail ? (
                        <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Smartphone className="w-6 h-6 text-text-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary truncate">{item.product.name}</p>
                      <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary">{formatPrice((item.product.salePrice || item.product.price) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between font-heading text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
