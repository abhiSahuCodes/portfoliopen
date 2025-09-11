import React, { useState } from 'react';
import paymentService, { createPaymentOrder, initializeRazorpayPayment } from '../../services/paymentService';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';

const PaymentButton = ({ plan = 'PRO', className = '', children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { PAYMENT_PLANS } = paymentService;

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to upgrade to Pro',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    if (user.subscription === 'pro') {
      toast({
        title: 'Already Pro User',
        description: 'You are already a Pro user!',
      });
      return;
    }

    setIsLoading(true);

    try {
      const planDetails = PAYMENT_PLANS[plan.toUpperCase()];
      
      if (!planDetails) {
        throw new Error(`Plan '${plan}' not found in PAYMENT_PLANS`);
      }
      
      // Create payment order
      const orderData = await createPaymentOrder(
        planDetails.amount,
        planDetails.currency
      );

      // Initialize Razorpay payment
      await initializeRazorpayPayment(
        orderData,
        (result) => {
          // Payment successful
          toast({
            title: 'Payment Successful!',
            description: 'Welcome to Pro! Redirecting to confirmation page...',
          });
          
          // Navigate to confirmation page
          navigate('/payment-success', {
            state: {
              paymentResult: result,
              plan: planDetails
            }
          });
        },
        (error) => {
          // Payment failed
          console.error('Payment failed:', error);
          toast({
            title: 'Payment Failed',
            description: error.message || 'Payment failed. Please try again.',
            variant: 'destructive'
          });
        }
      );
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initialize payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || user?.subscription === 'pro'}
      className={`
        relative inline-flex items-center justify-center
        px-6 py-3 text-base font-medium rounded-lg
        transition-all duration-200
        ${user?.subscription === 'pro' 
          ? 'bg-green-100 text-green-800 cursor-not-allowed dark:bg-green-900 dark:text-green-200'
          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        }
        ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {user?.subscription === 'pro' ? (
        <>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Pro User
        </>
      ) : (
        <>
          {isLoading ? 'Processing...' : (children || 'Upgrade to Pro')}
        </>
      )}
    </button>
  );
};

export default PaymentButton;