
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Zap, Sparkles } from "lucide-react";
import { upgradeToPro, refreshUser } from '@/lib/redux/slices/authSlice';
import { apiDowngradeSubscription } from '@/lib/api/auth';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/common/Navbar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PricingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { subscription, user } = useSelector((state) => state.auth);

  const downgradeMutation = useMutation({
    mutationFn: apiDowngradeSubscription,
    onSuccess: (data) => {
      dispatch(refreshUser(data.user));
      toast({
        title: "Success!",
        description: "Successfully downgraded to Free subscription",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to downgrade subscription",
        variant: "destructive",
      });
    },
  });

  const handleUpgrade = () => {
    navigate('/checkout');
  };

  const handleDowngrade = () => {
    downgradeMutation.mutate();
  };

  const handleBack = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 relative">
        <div className="absolute inset-0 -z-10 dark:block hidden" style={{
          backgroundImage: "url('./assets/dark-bg.svg')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            className="mb-6 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Choose the plan that best fits your needs
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-purple-900 rounded-lg shadow-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-8 flex-grow">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Free</h3>
                <p className="mt-4 text-gray-500 dark:text-gray-300">Perfect for getting started</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">$0</span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-300">/month</span>
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500 dark:text-gray-300">Portfolio Editor</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500 dark:text-gray-300">Multiple Sections</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500 dark:text-gray-300">Responsive Design</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500 dark:text-gray-300">Export to PDF</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500 dark:text-gray-300">Drag and Drop Sections</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-8">
                {subscription === 'free' ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                      >
                        Downgrade to Free
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Downgrade to Free Plan?</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>Are you sure you want to downgrade to the Free plan?</p>
                          <p className="font-medium text-amber-600">You will lose access to:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>AI Description Enhancement</li>
                            <li>AI Skill Generation</li>
                            <li>Priority support</li>
                          </ul>
                          <p className="text-sm text-gray-600">Your existing portfolios will remain, but AI features will be disabled.</p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDowngrade}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={downgradeMutation.isPending}
                        >
                          {downgradeMutation.isPending ? 'Downgrading...' : 'Confirm Downgrade'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-purple-900 rounded-lg shadow-lg overflow-hidden border-2 border-purple-500 dark:border-purple-400 relative flex flex-col">
              {/* Popular Badge */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="px-6 py-8 flex-grow">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Pro</h3>
                <p className="mt-4 text-gray-500 dark:text-gray-300">For professionals who want the best</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Rs. 900</span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-300">/month</span>
                </p>
                <div className="mt-8 space-y-4">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Everything in free plus:</p>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">AI Description Enhancement</span>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">AI Skill Generation</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-8">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={handleUpgrade}
                  variant={subscription === 'pro' ? 'outline' : 'default'}
                  disabled={subscription === 'pro'}
                >
                  {subscription === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
