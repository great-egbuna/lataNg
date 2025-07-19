import { useState } from "react";
import { paymentService } from "@/services/payment.service";
import { useAuth } from "@/context/AuthContext";
import { IAUTH } from "@/interfaces/context/auth";

interface UseSubscriptionPaymentOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useSubscriptionPayment(
  options: UseSubscriptionPaymentOptions = {}
) {
  const { user, isLoggedIn } = useAuth() as IAUTH;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  const initiatePayment = async (
    planId: number,
    type: "paystack" | "transfer",
    useWallet: boolean = false
  ) => {
    if (!isLoggedIn || !user) {
      setError(new Error("User not logged in"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.getSubscriptionCredentials(
        planId,
        type,
        useWallet
      );

      if (result instanceof Error) {
        setError(result);
        options.onError?.(result);
        return result;
      }

      setPaymentData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("An unexpected error occurred");
      setError(error);
      options.onError?.(error);
      return err;
    } finally {
      setLoading(false);
    }
  };

  const resetPaymentData = () => {
    setPaymentData(null);
    setError(null);
  };

  return {
    loading,
    error,
    paymentData,
    initiatePayment,
    resetPaymentData,
  };
}
