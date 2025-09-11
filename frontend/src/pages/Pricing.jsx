
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Zap, Sparkles } from "lucide-react";
import { upgradeToPro, refreshUser } from "@/lib/redux/slices/authSlice";
import { apiDowngradeSubscription } from "@/lib/api/auth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/common/Navbar";
import PaymentButton from "@/components/payment/PaymentButton";
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

  const handleDowngrade = () => {
    downgradeMutation.mutate();
  };

  const handleBack = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 relative">
        <div
          className="absolute inset-0 -z-10 dark:block hidden"
          style={{
            backgroundImage: "url('./assets/dark-bg.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
          }}
        ></div>
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
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Free
                </h3>
                <p className="mt-4 text-gray-500 dark:text-gray-300">
                  Perfect for getting started
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                    $0
                  </span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-300">
                    /month
                  </span>
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500 dark:text-gray-300">
                      Portfolio Editor
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500 dark:text-gray-300">
                      Multiple Sections
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500 dark:text-gray-300">
                      Responsive Design
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500 dark:text-gray-300">
                      Export to PDF
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="ml-3 text-gray-500 dark:text-gray-300">
                      Drag and Drop Sections
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-8">
                {subscription === "free" ? (
                  <Button className="w-full" variant="outline" disabled>
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
                        <AlertDialogTitle>
                          Downgrade to Free Plan?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2">
                          <p>
                            Are you sure you want to downgrade to the Free plan?
                          </p>
                          <p className="font-medium text-amber-600">
                            You will lose access to:
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>AI Description Enhancement</li>
                            <li>AI Skill Generation</li>
                            <li>Priority support</li>
                          </ul>
                          <p className="text-sm text-gray-600">
                            Your existing portfolios will remain, but AI
                            features will be disabled.
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDowngrade}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={downgradeMutation.isPending}
                        >
                          {downgradeMutation.isPending
                            ? "Downgrading..."
                            : "Confirm Downgrade"}
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
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Pro
                </h3>
                <p className="mt-4 text-gray-500 dark:text-gray-300">
                  For professionals who want the best
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
                    Rs. 900
                  </span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-300">
                    /month
                  </span>
                </p>
                <div className="mt-8 space-y-4">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Everything in free plus:
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                      AI Description Enhancement
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">
                      AI Skill Generation
                    </span>
                  </div>
                </div>
              </div>

              {/* Test Payment Information */}
              <div className="px-6 pb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-100 dark:bg-blue-800 p-1.5 rounded-full mr-2">
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                      Test Payment Information
                    </h4>
                  </div>
                  <p className="text-xs text-blue-800 dark:text-blue-200 mb-3">
                    Use these test card details:
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 dark:text-blue-400">💳</span>
                      <span className="font-mono">4386 2894 0766 0153</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText('4386289407660153')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                        title="Copy card number"
                      >
                        📋
                      </button>
                      <span className="text-xs text-gray-500">(Visa)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 dark:text-blue-400">💳</span>
                      <span className="font-mono">2305 3242 5784 8228</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText('2305324257848228')}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                        title="Copy card number"
                      >
                        📋
                      </button>
                      <span className="text-xs text-gray-500">(Mastercard)</span>
                    </div>

                    <p className="text-blue-600 dark:text-blue-400 text-center mt-2">
                      CVV: Any 3 digits
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 text-center mt-2">
                      Expiry: Any future date
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 text-center mt-2">
                      OTP: Any 8 digits if asked only
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-8">
                <PaymentButton
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  plan="pro"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
