
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../lib/redux/slices/authSlice';
import { useToast } from '../hooks/use-toast';
import Navbar from '../components/common/Navbar';
import GoogleOAuthButton from '@/components/GoogleOAuthButton';
import PasswordInput from '../components/ui/PasswordInput';
import { useMutation } from '@tanstack/react-query';
import { apiLogin, apiForgotPassword } from '../lib/api/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: ({ email, password }) => apiLogin({ email, password }),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      dispatch(login(data.user));
      toast({
        title: "Login successful",
        description: "Welcome back to PortfolioPen!",
      });
      navigate('/dashboard');
      setIsLoading(false);
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    mutation.mutate({ email, password });
  };

  const [showForgot, setShowForgot] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState('');

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!fpEmail.trim()) {
      setFpError("Please enter your email address");
      return;
    }
    setFpLoading(true);
    setFpError('');
    try {
      await apiForgotPassword({ email: fpEmail });
      toast({ 
        title: 'Reset email sent!', 
        description: 'Check your inbox and spam folder for reset instructions.' 
      });
      setShowForgot(false);
      setFpEmail('');
      setFpError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send reset email';
      toast({ title: 'Request failed', description: errorMessage, variant: 'destructive' });
      setFpError(errorMessage);
    } finally {
      setFpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex min-h-screen pt-16">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 md:flex-none md:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sign in to your account</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Or{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  create a new account
                </Link>
              </p>
            </div>

            <div className="mt-8">
              {/* Google OAuth Section */}
              <div className="mb-6">
                <GoogleOAuthButton 
                  text="Sign in with Google"
                  className="mb-4"
                />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-gray-50 dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                      Or continue with email
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter your registered email'
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-gray-900"
                      />
                    </div>
                  </div>

                  <PasswordInput
                    id="password"
                    name="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="appearance-none placeholder-gray-400"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-400">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" onClick={(e) => {e.preventDefault(); setShowForgot(true);}} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot your password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
                    >
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 md:block">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-600 to-indigo-600">
            <div className="flex h-full items-center justify-center p-12">
              <div className="max-w-lg">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">Create, customize, and share your portfolio</h2>
                <p className="mt-4 text-lg text-indigo-100">
                  Get access to our intuitive drag-and-drop builder and showcase your work professionally.
                </p>
              </div>
            </div>
            {showForgot && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Reset your password</h3>
                  <form onSubmit={handleForgot} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                      <input
                        type="email"
                        value={fpEmail}
                        onChange={(e) => setFpEmail(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-gray-900"
                      />
                      {fpError && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fpError}</p>
                      )}
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        💡 Don't forget to check your spam folder if you don't see the email in your inbox.
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => { setShowForgot(false); setFpEmail(''); setFpError(''); }} className="rounded-md border px-4 py-2 text-sm dark:border-gray-600 dark:text-gray-200">Cancel</button>
                      <button type="submit" disabled={fpLoading} className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-70">
                        {fpLoading ? 'Sending...' : 'Send reset link'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
