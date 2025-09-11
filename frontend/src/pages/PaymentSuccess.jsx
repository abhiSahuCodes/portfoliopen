import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { upgradeToPro } from '../lib/redux/slices/authSlice';
import { useToast } from '../hooks/use-toast';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { toast } = useToast();
  const [countdown, setCountdown] = useState(10);
  const [showProDialog, setShowProDialog] = useState(false);

  const { paymentResult, plan } = location.state || {};

  useEffect(() => {
    // If no payment data, redirect to dashboard
    if (!paymentResult) {
      navigate('/dashboard');
      return;
    }

    // Update user to pro status in Redux
    dispatch(upgradeToPro());

    // Start countdown timer for auto-redirect
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          navigate('/dashboard');
          
          // Show pro user confirmation dialog on dashboard
          setTimeout(() => {
            toast({
              title: '🎉 Payment Successful!',
              description: 'You are now a Pro user with unlimited access to all features!',
              duration: 5000,
            });
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownTimer);
    };
  }, [paymentResult, navigate, dispatch, toast]);

  const handleRedirectToDashboard = () => {
    navigate('/dashboard');
    
    // Show pro user dialog on dashboard
    setTimeout(() => {
      toast({
        title: '🎉 You are now a Pro user!',
        description: 'Enjoy unlimited features!',
      });
    }, 500);
  };

  const handleGoToDashboard = () => {
    handleRedirectToDashboard();
  };

  if (!paymentResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 dark:from-green-600/10 dark:to-blue-600/10"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for upgrading to {plan?.name || 'Pro Plan'}!
            </p>

            {/* Payment Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{plan?.name || 'Pro Plan'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="text-gray-900 dark:text-white font-medium">₹{plan?.amount || '999'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Completed</span>
                </div>
              </div>
            </div>

            {/* Pro Features */}
            <div className="text-left mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Now you have access to:</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {[
                  'AI Description Generation',
                  'AI skill generation',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Go to Dashboard
              </button>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting automatically in {countdown} seconds...
              </p>
            </div>
          </div>
        </div>

        {/* Pro User Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium shadow-lg">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Pro User
          </div>
        </div>
      </div>

      {/* Pro Dialog Modal */}
      {showProDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Pro!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You are now a Pro user with unlimited access to all features!
            </p>
            <button
              onClick={() => setShowProDialog(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;