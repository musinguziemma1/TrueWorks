import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface UsePesapalPaymentProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId: string;
  orderNumber: string;
}

export function usePesapalPayment({
  amount,
  customerName,
  customerEmail,
  customerPhone,
  orderId,
  orderNumber,
}: UsePesapalPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createPayment = useMutation(api.payments.create);

  const handlePayment = async (method: 'mtn_momo' | 'airtel_money' | 'visa' | 'mastercard') => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create pending payment record
      await createPayment({
        orderId: orderId as any,
        orderNumber,
        amount,
        method: 'pesapal',
        reference: `TW-${orderNumber}-${Date.now()}`,
      });

      // In production, this would call a Convex action that:
      // 1. Authenticates with Pesapal API
      // 2. Submits the order request
      // 3. Returns the redirect URL

      // For now, we'll simulate the Pesapal redirect
      // In production, replace with actual Pesapal API call
      const pesapalConfig = {
        id: orderNumber,
        currency: 'USD',
        amount,
        description: `TrueWorks Order - ${orderNumber}`,
        callback_url: `${window.location.origin}/order-confirmation?orderId=${orderId}`,
        notification_id: import.meta.env.VITE_PESAPAL_IPN_ID || '',
        billing_address: {
          email_address: customerEmail,
          phone_number: customerPhone || '',
          country_code: 'US',
          first_name: customerName.split(' ')[0] || customerName,
          last_name: customerName.split(' ').slice(1).join(' ') || '',
          line_1: '',
          city: '',
          state: '',
        },
      };

      // In production, this would be an API call to your backend/Convex action
      // For now, redirect to Pesapal sandbox for testing
      console.log('Pesapal payment request:', pesapalConfig);

      // Simulate redirect to Pesapal
      // In production, this would be the actual Pesapal redirect URL
      const sandboxUrl = `https://cybqa.pesapal.com/pesapaliframe/PesapalIframe3/Index/?OrderTrackingId=placeholder`;

      // For demo purposes, show success after a delay
      setTimeout(() => {
        window.location.href = `/order-confirmation?orderId=${orderId}`;
      }, 2000);

    } catch (err) {
      console.error('Payment error:', err);
      setError('An error occurred while processing your payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return {
    handlePayment,
    isProcessing,
    error,
  };
}
