import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
const createAuthenticatedRequest = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
};

// Create payment order
export const createPaymentOrder = async (amount, currency = 'INR') => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.post('/api/payment/create-order', {
      amount,
      currency
    });
    return response.data;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error.response?.data || error;
  }
};

// Verify payment
export const verifyPayment = async (paymentData) => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.post('/api/payment/verify', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error.response?.data || error;
  }
};

// Get payment status
export const getPaymentStatus = async (paymentId) => {
  try {
    const api = createAuthenticatedRequest();
    const response = await api.get(`/api/payment/status/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error.response?.data || error;
  }
};

// Initialize Razorpay payment
export const initializeRazorpayPayment = (orderData, onSuccess, onFailure) => {
  return new Promise((resolve, reject) => {
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        createRazorpayInstance(orderData, onSuccess, onFailure, resolve, reject);
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay SDK'));
      };
      document.body.appendChild(script);
    } else {
      createRazorpayInstance(orderData, onSuccess, onFailure, resolve, reject);
    }
  });
};

// Create Razorpay instance
const createRazorpayInstance = (orderData, onSuccess, onFailure, resolve, reject) => {
  const options = {
    key: orderData.key_id,
    amount: orderData.order.amount,
    currency: orderData.order.currency,
    name: 'Portfolio Pen',
    description: 'Upgrade to Pro Plan',
    order_id: orderData.order.id,
    handler: async (response) => {
      try {
        // Verify payment on backend
        const verificationResult = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });
        
        if (verificationResult.success) {
          onSuccess && onSuccess(verificationResult);
          resolve(verificationResult);
        } else {
          onFailure && onFailure(verificationResult);
          reject(verificationResult);
        }
      } catch (error) {
        onFailure && onFailure(error);
        reject(error);
      }
    },
    prefill: {
      name: '',
      email: '',
      contact: ''
    },
    notes: {
      address: 'Portfolio Pen Pro Upgrade'
    },
    theme: {
      color: '#3B82F6'
    },
    modal: {
      ondismiss: () => {
        const error = { message: 'Payment cancelled by user' };
        onFailure && onFailure(error);
        reject(error);
      }
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

// Payment plans configuration
export const PAYMENT_PLANS = {
  PRO: {
    name: 'Pro Plan',
    amount: 900, // Amount in INR
    currency: 'INR',
    features: [
      'Unlimited portfolios',
      'Custom domains',
      'Advanced analytics',
      'Priority support',
      'Custom themes'
    ]
  }
};

export default {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus,
  initializeRazorpayPayment,
  PAYMENT_PLANS
};