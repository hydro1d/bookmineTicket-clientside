import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../../services/api';
import { ShieldCheck, CreditCard } from 'lucide-react';

const stripePromise = loadStripe((import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string) || 'pk_test_51PxTjS2NMockStripeKeyValuesHere');

const CheckoutForm: React.FC<{ bookingId: string; clientSecret: string; amount: number; onSuccess: () => void }> = ({
  bookingId,
  clientSecret,
  amount,
  onSuccess
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement
      }
    });

    if (stripeErr) {
      setError(stripeErr.message || 'Payment failed');
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        const res = await api.post('/payments/verify', {
          bookingId,
          paymentIntentId: paymentIntent.id
        });
        if (res.data.success) {
          onSuccess();
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Verification failed');
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              '::placeholder': { color: '#aab7c4' }
            },
            invalid: { color: '#fa755a' }
          }
        }} />
      </div>
      {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}
      <button
        type="submit"
        disabled={processing || !stripe}
        className="btn btn-primary w-full bg-blue-600 border-none hover:bg-blue-700 text-white rounded-xl py-3.5 h-auto font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center"
      >
        {processing ? (
          <span className="loading loading-spinner loading-sm mr-2"></span>
        ) : (
          <CreditCard className="w-4 h-4 mr-2" />
        )}
        {processing ? 'Processing Payment...' : 'Pay $' + amount}
      </button>
    </form>
  );
};

export const PayBooking: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntent = async () => {
      try {
        const res = await api.post('/payments/create-checkout-session', { bookingId: id });
        if (res.data.success) {
          setClientSecret(res.data.clientSecret);
          setAmount(res.data.amount);
        }
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to initialize payment gateway');
        navigate('/dashboard/bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchIntent();
  }, [id]);

  const handlePaymentSuccess = () => {
    alert('Payment successfully completed! Your boarding ticket has been issued.');
    navigate('/dashboard/bookings');
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-extrabold">Complete Checkout</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Enter card details to finish booking</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl font-bold">
          <span className="text-sm text-slate-500">Total Price</span>
          <span className="text-xl text-blue-600 dark:text-blue-400">${amount}</span>
        </div>

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm bookingId={id!} clientSecret={clientSecret} amount={amount} onSuccess={handlePaymentSuccess} />
          </Elements>
        )}

        <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-4">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span>Stripe Certified PCI-DSS 256-Bit SSL Encryption</span>
        </div>
      </div>
    </div>
  );
};
