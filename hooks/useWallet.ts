import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // Adjust import path as needed
import { IAUTH } from "@/interfaces/context/auth";
import { generalService } from "@/services/general.service";
import { showToast } from "@/components/general/Toast";

interface IWallet {
  balance: number;
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function useWallet() {
  const { isLoggedIn } = useAuth() as IAUTH;

  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getWallet = async () => {
    if (!isLoggedIn) {
      setLoading(false);
      setError("User must be authenticated to fetch wallet.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await generalService.getWallet();

      if (response instanceof Error) {
        console.log("Error in response");
        showToast({
          text1: response.message,
          type: "error",
          text2: "Please try again",
        });
        setError(response.message);
        setLoading(false);
        return;
      }

      if (response && response.wallet) {
        setWallet(response.wallet);
      } else {
        setError("Invalid wallet data received");
      }

      return response;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Wallet fetch failed!";
      setError(errorMessage);
      return new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshWallet = () => {
    return getWallet();
  };

  useEffect(() => {
    (async () => {
      await getWallet();
    })();
  }, [isLoggedIn]);

  return {
    wallet,
    loading,
    error,
    refreshWallet,
  };
}
