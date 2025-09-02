import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { refreshUser } from "@/lib/redux/slices/authSlice";
import { apiUpgradeSubscription } from "@/lib/api/auth";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const upgradeMutation = useMutation({
    mutationFn: apiUpgradeSubscription,
    onSuccess: (data) => {
      dispatch(refreshUser(data.user));
      toast({
        title: "Success!",
        description: "Successfully upgraded to Pro subscription",
      });
      navigate(-1);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upgrade subscription",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = () => {
    upgradeMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 relative">
      <div
        className="absolute inset-0 -z-10 dark:block hidden"
        style={{
          backgroundImage: "url('/dark-bg.svg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="max-w-md mx-auto bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-purple-900 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Complete Your Purchase
        </h2>

        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded border dark:border-gray-600">
          <div className="flex justify-between mb-2 text-gray-900 dark:text-gray-100">
            <span>Pro Plan (Monthly)</span>
            <span>Rs. 900</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-300">
            <span>Tax</span>
            <span>Rs. 162</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between font-bold text-gray-900 dark:text-gray-100">
            <span>Total</span>
            <span>Rs. 1062</span>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handlePurchase}
          disabled={upgradeMutation.isPending}
        >
          {upgradeMutation.isPending ? "Processing..." : "Purchase Now"}
        </Button>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 w-full text-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Checkout;
