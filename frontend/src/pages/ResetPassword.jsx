import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import Navbar from '../components/common/Navbar';
import PasswordInput from '../components/ui/PasswordInput';
import { apiResetPassword } from '../lib/api/auth';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const isTokenMissing = useMemo(() => !token || !emailParam, [token, emailParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: 'Weak password', description: 'Use at least 6 characters.', variant: 'destructive' });
      return;
    }
    if (password !== confirm) {
      toast({ title: 'Passwords do not match', description: 'Please confirm your new password.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await apiResetPassword({ token, email, password });
      toast({ 
        title: 'Password updated successfully!', 
        description: 'Your password has been changed. You can now sign in with your new password.' 
      });
      navigate('/login');
    } catch (err) {
      toast({ 
        title: 'Password reset failed', 
        description: err.response?.data?.message || 'Failed to reset password. Please try again or request a new reset link.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex min-h-screen pt-16 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Reset Password</h1>
          {isTokenMissing ? (
            <div className="text-sm text-red-600 dark:text-red-400">
              Invalid or missing reset token. Please request a new reset link from the login page.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-gray-900"
                />
              </div>
              <PasswordInput
                label="New password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                autoComplete="new-password"
              />
              <PasswordInput
                label="Confirm new password"
                value={confirm}
                onChange={(e)=>setConfirm(e.target.value)}
                placeholder="Confirm your new password"
                required
                autoComplete="new-password"
              />
              <div className="flex justify-end gap-2">
                <Link to="/login" className="rounded-md border px-4 py-2 text-sm dark:border-gray-600 dark:text-gray-200">Cancel</Link>
                <button type="submit" disabled={loading || isTokenMissing} className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-70">
                  {loading ? 'Saving...' : 'Update password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;